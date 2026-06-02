import {
	Component,
	computed,
	signal,
	HostListener,
	inject,
	viewChild,
	ElementRef,
	effect,
	linkedSignal,
} from '@angular/core';
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
import { disbursements, obligations } from '@routes/ledger/data';
import { debounce } from '@app/shared/utils/debounce';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { toSignal } from '@angular/core/rxjs-interop';

type Status = 'Pending Verification' | 'Unpaid' | 'Partially paid' | 'Paid';
type Installment = {
	amount: number;
	status: 'Pending' | 'Paid';
	paymentDate: string;
	transactionCode: null | string;
};
export type Disbursement = {
	id: string;
	borrower: string;
	initials: string;
	principle: number;
	amountPaid: number;
	dueDate: string;
	status: Status;
	actionLabel: string;
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
	],
	templateUrl: './ledger.html',
	styleUrl: './ledger.css',
})
export class LedgerPage {
	router = inject(Router);
	route = inject(ActivatedRoute);
	segmentOptions = ['Money Lent', 'My Debts'];
	segment = signal('money_lent');
	selected_id = signal(null);

	private readonly _disbursements = signal(disbursements);
	private readonly _obligations = signal(obligations);
	selectedInstallment = signal<Installment | null>(null);

	selectedRecord = linkedSignal<any>(() => {
		const selectedId = this.selected_id();
		if (selectedId) {
			const disbursement = this.disbursements().find(
				(disbursement) => disbursement.id === selectedId,
			);
			return disbursement;
		}
		return null;
	});
	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];
	searchBox = viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
	private static searchInput = signal('');
	installments: Installment[];
	visible = signal(false);

	handleInstallmentSelection(installment: Installment) {
		const selectedInstallment = this.selectedInstallment() === installment ? null : installment;
		this.selectedInstallment.set(selectedInstallment);
	}

	handleRowSelect(event: any) {
		console.log(this.selectedRecord());
		this.router.navigate(['.'], {
			queryParams: { drawer: true, selected_id: this.selectedRecord()?.id },
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

	constructor() {
		this.route.queryParams.subscribe((params) => {
			const segment = params['segment'];
			segment && this.segment.set(segment);

			const drawer = params['drawer'] === 'true' || params['drawer'] === true;
			this.visible.set(drawer);

			const selected_id = params['selected_id'];
			this.selected_id.set(selected_id ?? null);
		});

		effect(() => {
			console.log(this.visible());
			console.log(this.selectedRecord());
			console.log(this.selected_id());
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

	disbursements = computed(() => {
		const result = this._disbursements().map((disbursement) => {
			const statusColor = this.getColor(disbursement.status);
			const avatarColor = this.getAvatarColor(disbursement.id);
			const balance = disbursement.principle - disbursement.amountPaid;
			return {
				...disbursement,
				balance,
				avatarColor,
				status: {
					label: disbursement.status,
					color: { label: statusColor.label, background: statusColor.background },
				},
			};
		});
		return this.segment() === 'money_lent'
			? result.filter((disbursement) =>
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

	getColor(status: Status) {
		switch (status) {
			case 'Unpaid':
				return { label: '#E3F2FD', background: '#1976D2' };
			case 'Partially paid':
				return { label: '#EDE7F6', background: '#673AB7' };
			case 'Pending Verification':
				return { label: '#F5F5F5', background: '#757575' };
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
