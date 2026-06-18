import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { SummaryCard } from '../../shared/dashboard/summary-card.component';
import { MoneyBagIcon, DonutChartIcon, PlusIcon } from 'kumbuka-icons';
import { TableModule } from 'primeng/table';
import { isPlatformBrowser } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { DashboardService, GetDashboardSummaryResponse } from './dashboard.service';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';

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
		DonutChartIcon,
		ButtonModule,
		PlusIcon,
		SkeletonModule,
	],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css',
})
export class DashboardPage {
	loading = signal(true);
	private router = inject(Router);
	private dashboardService = inject(DashboardService);
	lentVsBorrowedData = signal<any>(null);
	balancesData = signal<any>(null);
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

	navigateToCashFlow() {
		this.router.navigate(['/app/ledger']);
	}

	canDisplayOutstandingBalanceGraph = computed(() => {
		return (
			this.balancesData()?.datasets?.[0]?.data?.[0] > 0 ||
			this.balancesData()?.datasets?.[0]?.data?.[1] > 0
		);
	});
	canDisplayMoneyMovementGraph = computed(() => {
		return (
			this.lentVsBorrowedData()?.datasets?.[0]?.data?.[0] > 0 ||
			this.lentVsBorrowedData()?.datasets?.[0]?.data?.[1] > 0
		);
	});

	initChart(analytics: GetDashboardSummaryResponse) {
		if (isPlatformBrowser(this.platformId)) {
			const documentStyle = getComputedStyle(document.documentElement);
			const textColor = documentStyle.getPropertyValue('--p-text-color');

			this.lentVsBorrowedData.set({
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
			});

			this.balancesData.set({
				labels: ['Expected Cash inflow', 'My debts'],
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
			});

			this.options = {
				cutout: '60%',
				plugins: {
					legend: {
						maxWidth: 160, // Limits the maximum width the legend can take
						labels: {
							color: textColor,
							padding: 20, // Increases space between the items
							boxWidth: 12, // Reduces the width of the color box
						},
						position: 'right',
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
			complete: () => {
				this.loading.set(false);
			},
		});

		effect(() => {
			this.initChart(this.dashboardAnalytics());
		});
	}
}
