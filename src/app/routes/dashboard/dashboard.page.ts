import { Component } from '@angular/core';
import { SummaryCard } from '../../shared/dashboard/summary-card.component';
import { MoneyBagIcon, PlusIcon, ArrowRightIcon } from '../../../assets/icons';
import { ButtonDirective, Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { LenderCard } from '../../shared/dashboard/lender-card.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { Card } from 'primeng/card';

type BorrowerStatus = 'Overdue' | 'Pending' | 'Active';

interface Borrower {
	id: string;
	name: string;
	amount: number;
	dueDate: string; // ISO string recommended, or formatted string
	status: BorrowerStatus;
}

@Component({
	selector: 'app-dashboard',
	imports: [
		SummaryCard,
		MoneyBagIcon,
		ButtonDirective,
		PlusIcon,
		ArrowRightIcon,
		TableModule,
		Button,
		CurrencyPipe,
		LenderCard,
		ProgressBarModule,
		Card,
	],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class DashboardPage {
	borrowers: Borrower[] = [
		{
			id: '1',
			name: 'Marcus Holloway',
			amount: 4200.0,
			dueDate: 'Oct 12, 2023',
			status: 'Overdue',
		},
		{
			id: '2',
			name: 'Elena Rodriguez',
			amount: 1850.0,
			dueDate: 'Oct 28, 2023',
			status: 'Pending',
		},
		{
			id: '3',
			name: 'Simon Chen',
			amount: 6400.0,
			dueDate: 'Nov 04, 2023',
			status: 'Active',
		},
	];
}
