import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { SummaryCard } from '../../shared/dashboard/summary-card.component';
import { MoneyBagIcon, PlusIcon, ArrowRightIcon } from '../../../assets/icons';
import { ButtonDirective, Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { LenderCard } from '../../shared/dashboard/lender-card.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { Card, CardModule } from 'primeng/card';
import { DashboardService, GetDashboardSummaryResponse } from './dashboard.service';
import { ChartModule } from 'primeng/chart';

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
		TableModule,
		ProgressBarModule,
		ChartModule,
		CardModule,
		// ButtonDirective,
		// PlusIcon,
		// ArrowRightIcon,
		// Button,
		// CurrencyPipe,
		// LenderCard,
		// Card,
	],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class DashboardPage {
	private dashboardService = inject(DashboardService);
	lentVsBorrowedData: any;
	balancesData: any;
	options: any;
	platformId = inject(PLATFORM_ID);
	dashboardAnalytics = signal<GetDashboardSummaryResponse>({
		totalLent: 0,
		totalBorrowed: 0,
		amountOwedToMe: 0,
		amountIOwe: 0,
		activeLoansLent: 0,
		activeLoansBorrowed: 0,
		overdueLoans: 0,
	});

	initChart(analytics: GetDashboardSummaryResponse) {
		console.log(this.dashboardAnalytics());
		if (isPlatformBrowser(this.platformId)) {
			const documentStyle = getComputedStyle(document.documentElement);
			const textColor = documentStyle.getPropertyValue('--p-text-color');

			this.lentVsBorrowedData = {
				labels: ['Total amount lent out', 'Total amount borrowed'],
				datasets: [
					{
						data: [analytics.totalLent, analytics.totalBorrowed],
						backgroundColor: [
							documentStyle.getPropertyValue('--p-cyan-500'),
							documentStyle.getPropertyValue('--p-orange-500'),
						],
						hoverBackgroundColor: [
							documentStyle.getPropertyValue('--p-cyan-400'),
							documentStyle.getPropertyValue('--p-orange-400'),
						],
					},
				],
			};

			this.balancesData = {
				labels: ['Money owed to me (Expected Income)', 'Money I owe(My debts)'],
				datasets: [
					{
						data: [analytics.amountOwedToMe, analytics.amountIOwe],
						backgroundColor: [
							documentStyle.getPropertyValue('--p-indigo-500'),
							documentStyle.getPropertyValue('--p-rose-500'),
						],
						hoverBackgroundColor: [
							documentStyle.getPropertyValue('--p-indigo-400'),
							documentStyle.getPropertyValue('--p-rose-400'),
						],
					},
				],
			};

			this.options = {
				cutout: '60%',
				plugins: {
					legend: {
						labels: {
							color: textColor,
						},
					},
				},
			};
			// this.cd.markForCheck();
		}
	}

	constructor() {
		this.dashboardService.getDashboardSummary().subscribe({
			next: (analytics) => {
				this.dashboardAnalytics.set(analytics);
			},
			error: (err) => {
				console.log(err);
			},
		});

		effect(() => {
			console.log(this.dashboardAnalytics());
			this.initChart(this.dashboardAnalytics());
		});
	}
}
