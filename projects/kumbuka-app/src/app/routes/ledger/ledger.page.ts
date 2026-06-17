import {
	Component,
	computed,
	signal,
	HostListener,
	inject,
	viewChild,
	ElementRef,
	effect,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Segmented } from '@shared/segmented/segmented.component';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SearchIcon, PlusIcon } from 'kumbuka-icons';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce } from '@app/shared/utils/debounce';
import {
	LoanLentStatus,
	LoansLentService,
	type LoanLent,
} from '@routes/ledger/services/loans-lent.service';
import { DebtStatus, LoanBorrowed, LoansBorrowedService } from './services/loans-borrowed.service';
import { TransactionDetailsDrawerComponent } from './components/transaction-details-drawer.component';
import { DisbursementsListComponent } from './components/disbursements-list.component';
import { ObligationsListComponent } from './components/obligations-list.component';
import { DatePickerModule } from 'primeng/datepicker';
import { formatDate } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';

type Installment = {
	amount: number;
	status: 'Pending' | 'Paid';
	paymentDate: string;
	transactionCode: null | string;
};

export type Severity = 'danger' | 'warn' | 'success';

@Component({
	selector: 'app-ledger',
	imports: [
		Segmented,
		InputTextModule,
		IconFieldModule,
		InputIconModule,
		SearchIcon,
		ButtonModule,
		DialogModule,
		DatePickerModule,
		ReactiveFormsModule,
		PlusIcon,
		TransactionDetailsDrawerComponent,
		DisbursementsListComponent,
		ObligationsListComponent,
	],
	templateUrl: './ledger.html',
	styleUrl: './ledger.css',
})
export class LedgerPage {
	router = inject(Router);
	route = inject(ActivatedRoute);
	loanLentService = inject(LoansLentService);
	loanBorrowedService = inject(LoansBorrowedService);
	segmentOptions = ['Money Lent', 'My Debts'];
	segment = signal('money_lent');
	selected_id = signal<string | null>(null);
	private messageService = inject(MessageService);
	private confirmationService = inject(ConfirmationService);

	private readonly _disbursements = signal<LoanLent[]>([]);
	private readonly _obligations = signal<LoanBorrowed[]>([]);
	selectedInstallment = signal<Installment | null>(null);

	isLoadingDisbursements = signal(true);
	isLoadingObligations = signal(true);

	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];
	searchBox = viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
	private static searchInput = signal('');
	visible = signal(false);

	fb = inject(FormBuilder);
	isEditModalVisible = signal(false);
	isSaving = signal(false);
	editingRecordId = signal<number | null>(null);

	editForm: FormGroup = this.fb.group({
		personName: ['', Validators.required],
		phoneNumber: ['', Validators.required],
		amountLent: [0, [Validators.required, Validators.min(1)]],
		dateLent: ['', Validators.required],
		dueDate: ['', Validators.required],
		notes: [''],
	});

	isPaymentModalVisible = signal(false);
	isSavingPayment = signal(false);
	paymentRecord = signal<LoanLent | null>(null);
	paymentForm: FormGroup = this.fb.group({
		amount: [null, [Validators.required, Validators.min(1)]],
	});

	isBorrowedPaymentModalVisible = signal(false);
	isSavingBorrowedPayment = signal(false);
	borrowedPaymentRecordId = signal<number | null>(null);
	borrowedPaymentForm: FormGroup = this.fb.group({
		amount: [null, [Validators.required, Validators.min(1)]],
	});

	isBorrowedEditModalVisible = signal(false);
	isSavingBorrowedEdit = signal(false);
	borrowedEditingRecordId = signal<number | null>(null);
	borrowedEditForm: FormGroup = this.fb.group({
		personName: ['', Validators.required],
		phoneNumber: ['', Validators.required],
		amountBorrowed: [0, [Validators.required, Validators.min(1)]],
		dateBorrowed: ['', Validators.required],
		dueDate: ['', Validators.required],
		notes: [''],
	});

	isCreateLentModalVisible = signal(false);
	isSavingNewLent = signal(false);
	createLentForm: FormGroup = this.fb.group({
		personName: ['', Validators.required],
		phoneNumber: ['', Validators.required],
		amountLent: [null, [Validators.required, Validators.min(1)]],
		dateLent: ['', Validators.required],
		dueDate: ['', Validators.required],
		notes: [''],
	});

	isCreateBorrowedModalVisible = signal(false);
	isSavingNewBorrowed = signal(false);
	createBorrowedForm: FormGroup = this.fb.group({
		personName: ['', Validators.required],
		phoneNumber: ['', Validators.required],
		amountBorrowed: [null, [Validators.required, Validators.min(1)]],
		dateBorrowed: ['', Validators.required],
		dueDate: ['', Validators.required],
		notes: [''],
	});

	constructor() {
		this.route.queryParams.subscribe((params) => {
			// retrieve query params['segment'] and set it
			// as selected segment
			const segment = params['segment'];
			segment && this.segment.set(segment);

			console.log(segment);

			const selected_id = params['selected_id'];
			this.selected_id.set(selected_id ?? null);

			const drawer = params['drawer'] === 'true';
			// If we are initially loading and data isn't present, defer opening the drawer
			// to prevent blocking the main thread during the slide-in animation.
			if (drawer && this._disbursements() === null) {
				return;
			}

			this.visible.set(drawer);
		});

		effect(() => {
			console.log(this.isLoadingDisbursements());
		});

		this.loanLentService.getLoansLent().subscribe({
			next: (loans) => {
				this._disbursements.set(loans);
				this.isLoadingDisbursements.set(false);

				const params = this.route.snapshot.queryParams;
				if (params['drawer'] === 'true') {
					// Yield to the browser paint cycle to ensure the background table
					// is fully rendered before we start the drawer's CSS animation.
					setTimeout(() => this.visible.set(true), 50);
				}
			},
			error: (err) => {
				console.log(err);
				this.isLoadingDisbursements.set(false);
			},
		});

		this.loanBorrowedService.getLoansBorrowed().subscribe({
			next: (loans) => {
				this._obligations.set(loans);
				this.isLoadingObligations.set(false);

				const params = this.route.snapshot.queryParams;
				if (params['drawer'] === 'true') {
					// Yield to the browser paint cycle to ensure the background table
					// is fully rendered before we start the drawer's CSS animation.
					setTimeout(() => this.visible.set(true), 50);
				}
			},
			error: (err) => {
				console.log(err);
				this.isLoadingObligations.set(false);
			},
		});
	}

	handleCardSelect(data: any) {
		console.log(data);
		this.router.navigate(['.'], {
			queryParams: { drawer: true, selected_id: data.id },
			queryParamsHandling: 'merge',
			relativeTo: this.route,
		});
	}

	handleInstallmentSelection(installment: Installment) {
		const selectedInstallment = this.selectedInstallment() === installment ? null : installment;
		this.selectedInstallment.set(selectedInstallment);
	}

	handleRowSelect(event: any) {
		console.log(event);
		const data = event.data;
		this.router.navigate(['.'], {
			queryParams: { drawer: true, selected_id: data.id },
			queryParamsHandling: 'merge',
			relativeTo: this.route,
		});
	}

	handleDrawerHide(event: any) {
		this.router.navigate(['.'], {
			queryParams: { drawer: null, selected_id: null },
			queryParamsHandling: 'merge',
			relativeTo: this.route,
		});
	}

	openCreateModal() {
		if (this.segment() === 'money_lent') {
			this.createLentForm.reset();
			this.isCreateLentModalVisible.set(true);
		} else {
			this.createBorrowedForm.reset();
			this.isCreateBorrowedModalVisible.set(true);
		}
	}

	openEditModal(record: LoanLent) {
		console.log(record);
		this.editingRecordId.set(record.id);
		this.editForm.patchValue({
			personName: record.borrower,
			phoneNumber: record.phoneNumber,
			amountLent: record.amount.lent,
			dateLent: record.dateLent ? new Date(record.dateLent) : null,
			dueDate: record.dueDate ? new Date(record.dueDate) : null,
			notes: record.notes,
		});
		this.isEditModalVisible.set(true);
	}

	saveEdit() {
		if (this.editForm.valid && this.editingRecordId() !== null) {
			this.isSaving.set(true);
			let payload = this.editForm.value;
			payload = {
				...payload,
				dueDate: formatDate(payload.dueDate, 'yyyy-MM-dd', 'en_US'),
				dateLent: formatDate(payload.dateLent, 'yyyy-MM-dd', 'en_US'),
			};
			this.loanLentService.updateLoanLent(this.editingRecordId()!, payload).subscribe({
				next: () => {
					// Re-fetch the list so that our table updates seamlessly
					this.loanLentService.getLoansLent().subscribe({
						next: (loans) => {
							this._disbursements.set(loans);
							this.isSaving.set(false);
							this.isEditModalVisible.set(false);
						},
						error: (err) => {
							console.error('Failed to refetch loans: ', err);
							this.isSaving.set(false);
						},
					});
				},
				error: (err) => {
					console.error('Error updating loan', err);
					this.isSaving.set(false);
				},
			});
		}
	}

	saveNewLentLoan() {
		if (this.createLentForm.valid) {
			this.isSavingNewLent.set(true);
			const payload = this.createLentForm.value;
			this.loanLentService.recordLoan(payload).subscribe({
				next: () => {
					this.loanLentService.getLoansLent().subscribe({
						next: (loans) => {
							this._disbursements.set(loans);
							this.isSavingNewLent.set(false);
							this.isCreateLentModalVisible.set(false);
						},
						error: (err) => {
							console.error('Failed to refetch loans: ', err);
							this.isSavingNewLent.set(false);
						},
					});
				},
				error: (err) => {
					console.error('Error creating loan', err);
					this.isSavingNewLent.set(false);
				},
			});
		}
	}

	openPaymentModal(record: LoanLent) {
		this.paymentRecord.set(record);
		this.paymentForm.reset({ amount: null });
		this.paymentForm.controls['amount'].setValidators([
			Validators.required,
			Validators.min(1),
			Validators.max(record.amount.balance),
		]);
		this.paymentForm.controls['amount'].updateValueAndValidity();
		this.isPaymentModalVisible.set(true);
	}

	deleteDisbursement(disbursementId: number) {
		this.loanLentService.deleteLoanLent(disbursementId).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'info',
					summary: 'Info',
					detail: 'Disbursement successfully deleted',
				});
				this.loanLentService.getLoansLent().subscribe({
					next: (loans) => {
						this._disbursements.set(loans);
					},
					error: (err) => {
						console.error('Failed to refetch loans: ', err);
					},
				});
			},
			error: (err) => {
				console.error('Failure occurred deleting the record');
			},
		});
	}

	confirmDisbursementDelete(e: { target: EventTarget; disbursement: number }) {
		this.confirmationService.confirm({
			target: e.target,
			message: 'Do you want to delete this record?',
			icon: 'pi pi-info-circle',
			rejectButtonProps: {
				label: 'Cancel',
				severity: 'secondary',
				outlined: true,
			},
			acceptButtonProps: {
				label: 'Delete',
				severity: 'danger',
			},
			accept: () => {
				this.deleteDisbursement(e.disbursement);
			},
			reject: () => {
				this.messageService.add({
					severity: 'error',
					summary: 'Rejected',
					detail: 'You have rejected',
					life: 3000,
				});
			},
		});
	}

	savePayment() {
		if (this.paymentForm.valid && this.paymentRecord() !== null) {
			this.isSavingPayment.set(true);
			const amount = this.paymentForm.value.amount;
			this.loanLentService.recordPayment(this.paymentRecord()!.id, amount).subscribe({
				next: () => {
					// Re-fetch the list so that our table updates seamlessly
					this.loanLentService.getLoansLent().subscribe({
						next: (loans) => {
							this._disbursements.set(loans);
							this.isSavingPayment.set(false);
							this.isPaymentModalVisible.set(false);
						},
						error: (err) => {
							console.error('Failed to refetch loans: ', err);
							this.isSavingPayment.set(false);
						},
					});
				},
				error: (err) => {
					console.error('Error recording payment', err);
					this.isSavingPayment.set(false);
				},
			});
		}
	}

	openBorrowedPaymentModal(record: LoanBorrowed) {
		this.borrowedPaymentRecordId.set(record.id);
		this.borrowedPaymentForm.reset({ amount: null });
		this.borrowedPaymentForm.controls['amount'].setValidators([
			Validators.required,
			Validators.min(1),
			Validators.max(record.amount.balance),
		]);
		this.borrowedPaymentForm.controls['amount'].updateValueAndValidity();
		this.isBorrowedPaymentModalVisible.set(true);
	}

	saveBorrowedPayment() {
		if (this.borrowedPaymentForm.valid && this.borrowedPaymentRecordId() !== null) {
			this.isSavingBorrowedPayment.set(true);
			const amount = this.borrowedPaymentForm.value.amount;
			this.loanBorrowedService
				.recordPayment(this.borrowedPaymentRecordId()!, amount)
				.subscribe({
					next: () => {
						this.loanBorrowedService.getLoansBorrowed().subscribe({
							next: (loans) => {
								this._obligations.set(loans);
								this.isSavingBorrowedPayment.set(false);
								this.isBorrowedPaymentModalVisible.set(false);
							},
						});
					},
					error: (err) => {
						console.error('Error recording borrowed payment', err);
						this.isSavingBorrowedPayment.set(false);
					},
				});
		}
	}

	openBorrowedEditModal(record: LoanBorrowed) {
		this.borrowedEditingRecordId.set(record.id);
		this.borrowedEditForm.patchValue({
			personName: record.lender,
			phoneNumber: record.phoneNumber,
			amountBorrowed: record.amount.borrowed,
			dateBorrowed: record.dateBorrowed ? new Date(record.dateBorrowed) : null,
			dueDate: record.dueDate ? new Date(record.dueDate) : null,
		});
		this.isBorrowedEditModalVisible.set(true);
	}

	saveBorrowedEdit() {
		if (this.borrowedEditForm.valid && this.borrowedEditingRecordId() !== null) {
			this.isSavingBorrowedEdit.set(true);
			const payload = this.borrowedEditForm.value;
			this.loanBorrowedService
				.updateLoanBorrowed(this.borrowedEditingRecordId()!, payload)
				.subscribe({
					next: () => {
						this.loanBorrowedService.getLoansBorrowed().subscribe({
							next: (loans) => {
								this._obligations.set(loans);
								this.isSavingBorrowedEdit.set(false);
								this.isBorrowedEditModalVisible.set(false);
							},
							error: (err) => {
								console.error('Failed to refetch borrowed loans: ', err);
								this.isSavingBorrowedEdit.set(false);
							},
						});
					},
					error: (err) => {
						console.error('Error updating borrowed loan', err);
						this.isSavingBorrowedEdit.set(false);
					},
				});
		}
	}

	saveNewBorrowedLoan() {
		if (this.createBorrowedForm.valid) {
			this.isSavingNewBorrowed.set(true);
			const payload = this.createBorrowedForm.value;
			this.loanBorrowedService.recordLoan(payload).subscribe({
				next: () => {
					this.loanBorrowedService.getLoansBorrowed().subscribe({
						next: (loans) => {
							this._obligations.set(loans);
							this.isSavingNewBorrowed.set(false);
							this.isCreateBorrowedModalVisible.set(false);
						},
						error: (err) => {
							console.error('Failed to refetch borrowed loans: ', err);
							this.isSavingNewBorrowed.set(false);
						},
					});
				},
				error: (err) => {
					console.error('Error creating borrowed loan', err);
					this.isSavingNewBorrowed.set(false);
				},
			});
		}
	}

	private static handleInput(event: Event) {
		const value = (event.target as HTMLInputElement)?.value;
		LedgerPage.searchInput.set(value);
	}
	handleInput = debounce(LedgerPage.handleInput);

	getAvatarColor(name: string): string {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const index = Math.abs(hash % this.colors.length);
		return this.colors[index];
	}

	getInitials(name: string) {
		const matches = name.match(/\b[a-zA-Z]/g);
		return matches?.join('').toUpperCase();
	}

	selectedRecord = computed(() => {
		const id = this.selected_id();
		if (id === null) return null;

		if (this.segment() === 'money_lent') {
			return this.disbursements().find((d) => d.id.toString() === id.toString()) ?? null;
		} else {
			return this.obligations().find((d) => d.id.toString() === id.toString()) ?? null;
		}
	});

	disbursements = computed(() => {
		const result =
			this._disbursements().map((disbursement) => {
				const statusColor = this.getColor(disbursement.status);
				const avatarColor = this.getAvatarColor(
					`${disbursement.borrower}#${disbursement.id}`,
				);
				const initials = this.getInitials(disbursement.borrower);
				const balance = disbursement.amount.balance;
				console.log('DISBURSEMENT', disbursement);
				return {
					...disbursement,
					balance,
					initials,
					avatarColor,
					status: {
						label: disbursement.status,
						color: { label: statusColor.label, background: statusColor.background },
					},
					payments: disbursement.payments
						.map((payment) => ({ ...payment }))
						.sort(
							(a, b) =>
								new Date(b.paymentDate).getTime() -
								new Date(a.paymentDate).getTime(),
						),
				};
			}) ?? [];
		return this.segment() === 'money_lent'
			? result?.filter((disbursement) =>
					disbursement.borrower
						.toLowerCase()
						.startsWith(LedgerPage.searchInput().toLowerCase()),
				)
			: result;
	});

	obligations = computed(() => {
		const result =
			this._obligations()?.map((obligation) => {
				const initials = this.getInitials(obligation.lender);
				const severity = this.getSeverity(obligation.status);
				return {
					...obligation,
					severity,
					initials,
					payments: [...(obligation.payments ?? [])].sort(
						(a, b) =>
							new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
					),
				};
			}) ?? [];
		return this.segment() === 'my_debts'
			? result?.filter((obligation) =>
					obligation.lender
						.toLowerCase()
						.startsWith(LedgerPage.searchInput().toLowerCase()),
				)
			: result;
	});

	handleSegmentChange = (value: string) => {
		// take value of segment option and put it on
		// query parameters of the URL
		const newSegment = value.toLowerCase().replace(/\s/g, '_');

		if (this.segment() !== newSegment) {
			this.router.navigate(['.'], {
				queryParams: { segment: newSegment },
				queryParamsHandling: 'merge',
				relativeTo: this.route,
			});
		}
	};

	// 18rem * 16px = 288px
	tableHeight = signal(typeof window !== 'undefined' ? `${window.innerHeight - 350}px` : '400px');

	@HostListener('window:resize')
	onResize() {
		if (typeof window !== 'undefined') this.tableHeight.set(`${window.innerHeight - 288}px`);
	}

	getColor(status: LoanLentStatus) {
		switch (status) {
			case 'ACTIVE':
				return { label: '#E3F2FD', background: '#1976D2' };
			case 'PARTIALLY_PAID':
				return { label: '#EDE7F6', background: '#673AB7' };
			default:
				return { label: '#D32F2F', background: '#FFEBEE' };
		}
	}

	getSeverity(status: DebtStatus): Severity {
		switch (status) {
			case 'PARTIALLY_PAID':
				return 'warn';
			case 'PAID':
				return 'success';
			default:
				return 'danger';
		}
	}
}
