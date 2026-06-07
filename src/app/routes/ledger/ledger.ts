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
import { SearchIcon, LogIcon, CheckIcon, WarningIcon } from '@assets/icons';
import { TableModule } from 'primeng/table';
import {
	DatePipe,
	formatNumber,
	UpperCasePipe,
	NgTemplateOutlet,
	DecimalPipe,
} from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { obligations } from '@routes/ledger/data';
import { debounce } from '@app/shared/utils/debounce';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import {
	LoanLentStatus,
	LoansLentService,
	type LoanLent,
} from '@routes/ledger/services/loans-lent.service';

type Installment = {
	amount: number;
	status: 'Pending' | 'Paid';
	paymentDate: string;
	transactionCode: null | string;
};

export type DebtStatus = 'pending' | 'overdue' | 'repaid';
export type Severity = 'danger' | 'warn' | 'success';
export interface Obligation {
	id: string;
	name: string;
	category: 'family' | 'friend' | 'shopkeeper' | 'colleague';
	amountDue: number;
	dueDate: string;
	status: DebtStatus;
}

@Component({
	selector: 'app-ledger',
	imports: [
		Segmented,
		InputTextModule,
		IconFieldModule,
		InputIconModule,
		SearchIcon,
		TableModule,
		DatePipe,
		ButtonModule,
		CardModule,
		TagModule,
		AvatarModule,
		ButtonModule,
		LogIcon,
		UpperCasePipe,
		DrawerModule,
		DividerModule,
		ProgressBarModule,
		NgTemplateOutlet,
		TimelineModule,
		DecimalPipe,
		CheckIcon,
		WarningIcon,
		DialogModule,
		ReactiveFormsModule,
	],
	templateUrl: './ledger.html',
	styleUrl: './ledger.css',
})
export class LedgerPage {
	router = inject(Router);
	route = inject(ActivatedRoute);
	loanLentService = inject(LoansLentService);
	segmentOptions = ['Money Lent', 'My Debts'];
	segment = signal('money_lent');
	selected_id = signal(null);
	selectedRecord: LoanLent | null = null;

	private readonly _disbursements = signal<LoanLent[] | null>(null);
	private readonly _obligations = signal(obligations);
	selectedInstallment = signal<Installment | null>(null);

	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];
	searchBox = viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
	private static searchInput = signal('');
	installments: Installment[];
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
	paymentRecordId = signal<number | null>(null);
	paymentForm: FormGroup = this.fb.group({
		amount: [null, [Validators.required, Validators.min(1)]],
	});

	handleInstallmentSelection(installment: Installment) {
		const selectedInstallment = this.selectedInstallment() === installment ? null : installment;
		this.selectedInstallment.set(selectedInstallment);
	}

	handleRowSelect(event: any) {
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

	openEditModal(record: LoanLent) {
		this.editingRecordId.set(record.id);
		this.editForm.patchValue({
			personName: record.borrower,
			phoneNumber: record.phoneNumber,
			amountLent: record.amount.lent,
			dateLent: record.dateLent,
			dueDate: record.dueDate,
			notes: record.notes,
		});
		this.isEditModalVisible.set(true);
	}

	saveEdit() {
		if (this.editForm.valid && this.editingRecordId() !== null) {
			this.isSaving.set(true);
			const payload = this.editForm.value;
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

	openPaymentModal(record: LoanLent) {
		this.paymentRecordId.set(record.id);
		this.paymentForm.reset({ amount: null });
		this.paymentForm.controls['amount'].setValidators([
			Validators.required,
			Validators.min(1),
			Validators.max(record.amount.balance),
		]);
		this.paymentForm.controls['amount'].updateValueAndValidity();
		this.isPaymentModalVisible.set(true);
	}

	savePayment() {
		if (this.paymentForm.valid && this.paymentRecordId() !== null) {
			this.isSavingPayment.set(true);
			const amount = this.paymentForm.value.amount;
			this.loanLentService.recordPayment(this.paymentRecordId()!, amount).subscribe({
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

	constructor() {
		this.route.queryParams.subscribe((params) => {
			const segment = params['segment'];
			segment && this.segment.set(segment);

			const drawer = params['drawer'] === 'true' || params['drawer'] === true;
			this.visible.set(drawer);

			const selected_id = params['selected_id'];
			this.selected_id.set(selected_id ?? null);
		});

		this.loanLentService.getLoansLent().subscribe({
			next: (loans) => {
				this._disbursements.set(loans);
			},
			error: (err) => {
				console.log(err);
			},
		});

		this.installments = [
			{
				amount: 5000,
				status: 'Pending',
				paymentDate: '2023-10-15',
				transactionCode: null,
			},
			{
				amount: 15000,
				status: 'Paid',
				paymentDate: '2023-08-15',
				transactionCode: 'QNK8T4V9Z',
			},
			{
				amount: 12500,
				status: 'Paid',
				paymentDate: '2023-09-15',
				transactionCode: 'QNL9R2M1X',
			},
		];
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

	disbursements = computed(() => {
		const result =
			this._disbursements()?.map((disbursement) => {
				const statusColor = this.getColor(disbursement.status);
				const avatarColor = this.getAvatarColor(
					`${disbursement.borrower}#${disbursement.id}`,
				);
				const initials = this.getInitials(disbursement.borrower);
				const balance = disbursement.amount.balance;
				return {
					...disbursement,
					balance,
					initials,
					avatarColor,
					status: {
						label: disbursement.status,
						color: { label: statusColor.label, background: statusColor.background },
					},
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
		const result = this._obligations().map((obligation) => {
			const severity = this.getSeverity(obligation.status);
			return {
				...obligation,
				amountDue: formatNumber(obligation.amountDue, 'en-US'),
				severity,
			};
		});
		return this.segment() === 'my_debts'
			? result.filter((obligation) =>
					obligation.name
						.toLowerCase()
						.startsWith(LedgerPage.searchInput().toLowerCase()),
				)
			: result;
	});

	handleSegmentChange = (value: string) => {
		console.log('Has been called');
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
			case 'overdue':
				return 'danger';
			case 'pending':
				return 'warn';
			case 'repaid':
				return 'success';
		}
	}
}
