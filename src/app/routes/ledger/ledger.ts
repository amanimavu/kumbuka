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
import { Segmented } from '@shared/segmented/segmented.component';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SearchIcon, LogIcon } from '@assets/icons';
import { TableModule } from 'primeng/table';
import { DatePipe, formatNumber, UpperCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { disbursements, obligations } from '@routes/ledger/data';
import { debounce } from '@app/shared/utils/debounce';

type Status = 'Pending Verification' | 'Active' | 'Paused';
export type Disbursement = {
	id: string;
	borrower: string;
	initials: string;
	amount: number;
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
	],
	templateUrl: './ledger.html',
	styleUrl: './ledger.css',
})
export class LedgerPage {
	private readonly _disbursements = signal(disbursements);
	private readonly _obligations = signal(obligations);
	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];
	searchBox = viewChild.required<ElementRef<HTMLInputElement>>('searchBox');
	private static searchInput = signal('');

	router = inject(Router);
	route = inject(ActivatedRoute);
	segmentOptions = ['Money Lent', 'My Debts'];
	segment = signal('money_lent');

	constructor() {
		this.route.queryParams.subscribe((params) => {
			let segment = params['segment'];
			this.segment.set(segment);
		});
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
			return {
				...disbursement,
				amount: formatNumber(disbursement.amount, 'en-US'),
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
		this.router.navigate(['/app/ledger'], {
			queryParams: { segment: value.toLowerCase().replace(/\s/g, '_') },
		});
	};

	// 18rem * 16px = 288px
	tableHeight = signal(typeof window !== 'undefined' ? `${window.innerHeight - 350}px` : '400px');

	@HostListener('window:resize')
	onResize() {
		if (typeof window !== 'undefined') this.tableHeight.set(`${window.innerHeight - 288}px`);
	}

	getColor(status: Status) {
		switch (status) {
			case 'Active':
				return { label: '#E3F2FD', background: '#1976D2' };
			case 'Paused':
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
