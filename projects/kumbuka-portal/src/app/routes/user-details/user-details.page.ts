import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Loan, UserDetails } from '@routes/user-management/user.types';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ArrowLeftIcon, FolderOpenIcon, PaymentsIcon } from 'kumbuka-icons';
import { UserManagementService } from '@routes/user-management/user-management.service';

@Component({
	selector: 'user-details',
	styles: `
		::ng-deep .p-timeline-event-opposite {
			display: none;
		}
		::ng-deep #transaction-drawer > div {
			container-type: size;
		}
	`,
	imports: [
		TableModule,
		CardModule,
		TagModule,
		AvatarModule,
		ButtonModule,
		SkeletonModule,
		DatePipe,
		DecimalPipe,
		ArrowLeftIcon,
		FolderOpenIcon,
		PaymentsIcon,
		TooltipModule,
		DrawerModule,
		TimelineModule,
		DividerModule,
	],
	template: `
		<button
			pButton
			[text]="true"
			size="small"
			class="mb-6! font-semibold text-neutral-500!"
			(click)="goBack()"
		>
			<svg class="w-5" arrow-left-icon></svg>
			<span>Back to Users</span>
		</button>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
			<p-card>
				@if (isLoading()) {
					<div class="flex flex-col items-center gap-3">
						<p-skeleton shape="circle" size="6rem" />
						<p-skeleton width="10rem" height="1.5rem" />
						<p-skeleton width="14rem" />
					</div>
				} @else {
					<div class="flex flex-col items-center text-center gap-2">
						<p-avatar
							[label]="initials()"
							shape="circle"
							size="xlarge"
							class="text-2xl!"
							[style.backgroundColor]="avatarColor()"
						/>
						<h3 class="text-xl font-bold">{{ user()?.fullName }}</h3>
						<span class="text-neutral-500">{{ user()?.email }}</span>
						<span class="text-neutral-500">{{ user()?.phoneNumber }}</span>
					</div>
				}
			</p-card>

			<p-card>
				<span class="text-xs font-bold tracking-wide text-neutral-400 uppercase">
					Total Loans Lent
				</span>
				<div class="text-4xl font-bold mt-2">{{ user()?.loansLent?.length ?? 0 }}</div>
			</p-card>

			<p-card>
				<span class="text-xs font-bold tracking-wide text-neutral-400 uppercase">
					Total Loans Borrowed
				</span>
				<div class="text-4xl font-bold mt-2">{{ user()?.loansBorrowed?.length ?? 0 }}</div>
			</p-card>
		</div>

		<p-card class="mb-6 block">
			<h4 class="text-lg font-bold mb-4">Loans Lent</h4>
			<p-table
				[value]="user()?.loansLent ?? []"
				size="small"
				dataKey="id"
				[scrollable]="true"
				[tableStyle]="{ 'min-width': '56rem' }"
			>
				<ng-template #header>
					<tr>
						<th pFrozenColumn>Person</th>
						<th>Amount</th>
						<th>Balance</th>
						<th>Date Lent</th>
						<th>Due Date</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</ng-template>
				<ng-template #body let-loan>
					<tr>
						<td class="flex items-center gap-2" pFrozenColumn>
							<p-avatar
								[label]="loanInitials(loan)"
								shape="circle"
								class="text-xs!"
								[style.backgroundColor]="getAvatarColor(loan.personName)"
							/>
							{{ loan.personName }}
						</td>
						<td>{{ loan.loanAmount | number: '1.2-2' }}</td>
						<td>{{ loan.balance | number: '1.2-2' }}</td>
						<td>{{ loan.dateLent | date: 'mediumDate' }}</td>
						<td>{{ loan.dueDate | date: 'mediumDate' }}</td>
						<td>
							<p-tag [value]="loan.status" [severity]="statusSeverity(loan.status)" />
						</td>
						<td>
							<button
								pButton
								size="small"
								[text]="true"
								pTooltip="view payments"
								tooltipPosition="right"
								(click)="openPayments(loan)"
							>
								<svg class="w-4.5" payments-icon></svg>
							</button>
						</td>
					</tr>
				</ng-template>
				<ng-template #emptymessage>
					@if (!isLoading() && user()) {
						<tr>
							<td colspan="7">
								<div
									class="text-neutral-500 font-medium flex flex-col items-center text-center"
								>
									<svg class="w-10 m-2" folder-open-icon></svg>
									<span class="text-xl">No loans lent</span>
								</div>
							</td>
						</tr>
					}
				</ng-template>
			</p-table>
		</p-card>

		<p-card class="block">
			<h4 class="text-lg font-bold mb-4">Loans Borrowed</h4>
			<p-table
				[value]="user()?.loansBorrowed ?? []"
				size="small"
				dataKey="id"
				[scrollable]="true"
				[tableStyle]="{ 'min-width': '56rem' }"
			>
				<ng-template #header>
					<tr>
						<th pFrozenColumn>Person</th>
						<th>Amount</th>
						<th>Balance</th>
						<th>Date Borrowed</th>
						<th>Due Date</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</ng-template>
				<ng-template #body let-loan>
					<tr>
						<td class="flex items-center gap-2" pFrozenColumn>
							<p-avatar
								[label]="loanInitials(loan)"
								shape="circle"
								class="text-xs!"
								[style.backgroundColor]="getAvatarColor(loan.personName)"
							/>
							{{ loan.personName }}
						</td>
						<td>{{ loan.loanAmount | number: '1.2-2' }}</td>
						<td>{{ loan.balance | number: '1.2-2' }}</td>
						<td>{{ loan.dateBorrowed | date: 'mediumDate' }}</td>
						<td>{{ loan.dueDate | date: 'mediumDate' }}</td>
						<td>
							<p-tag [value]="loan.status" [severity]="statusSeverity(loan.status)" />
						</td>
						<td>
							<button
								pButton
								size="small"
								[text]="true"
								pTooltip="view payments"
								tooltipPosition="right"
								(click)="openPayments(loan)"
							>
								<svg class="w-4.5" payments-icon></svg>
							</button>
						</td>
					</tr>
				</ng-template>
				<ng-template #emptymessage>
					@if (!isLoading() && user()) {
						<tr>
							<td colspan="6">
								<div
									class="text-neutral-500 font-medium flex flex-col items-center text-center"
								>
									<svg class="w-10 m-2" folder-open-icon></svg>
									<span class="text-xl">No loans borrowed</span>
								</div>
							</td>
						</tr>
					}
				</ng-template>
			</p-table>
		</p-card>

		<p-drawer
			[visible]="drawerVisible()"
			(visibleChange)="drawerVisible.set($event)"
			position="right"
			id="transaction-drawer"
			styleClass="w-full! md:w-96! lg:w-[32rem]!"
		>
			<ng-template #header>
				<div class="flex flex-col">
					<span class="font-bold text-lg">{{ selectedLoan()?.personName }}</span>
					<span class="text-sm text-neutral-500">Payment timeline</span>
				</div>
			</ng-template>
			<ng-template #content>
				<p-divider class="mt-0!" />
				<div class="px-2 pb-8">
					<div class="grid grid-cols-3 gap-2 mb-6 text-center">
						<div>
							<div class="text-xs font-bold text-neutral-400 uppercase">Loan</div>
							<div class="text-lg font-bold">
								{{ selectedLoan()?.loanAmount | number: '1.0-0' }}
							</div>
						</div>
						<div>
							<div class="text-xs font-bold text-neutral-400 uppercase">Paid</div>
							<div class="text-lg font-bold text-green-600">
								{{ selectedLoan()?.amountPaid | number: '1.0-0' }}
							</div>
						</div>
						<div>
							<div class="text-xs font-bold text-neutral-400 uppercase">Balance</div>
							<div class="text-lg font-bold text-amber-600">
								{{ selectedLoan()?.balance | number: '1.0-0' }}
							</div>
						</div>
					</div>
					<p-divider />
					@if (sortedInstallments().length > 0) {
						<p-timeline [value]="sortedInstallments()" class="items-start mt-6!">
							<ng-template #content let-installment>
								<div
									class="w-[81cqw] flex flex-col gap-1 p-2 ml-2 mb-2 rounded-xl text-sm border border-neutral-300"
								>
									<span class="text-base font-semibold">
										KSH {{ installment.amount | number: '1.0-0' }}
									</span>
									<span class="text-xs font-bold text-neutral-400">
										{{ installment.paymentDate | date: 'medium' }}
									</span>
								</div>
							</ng-template>
						</p-timeline>
					} @else {
						<div class="flex flex-col items-center text-neutral-500 py-8">
							<svg class="w-10 m-2" folder-open-icon></svg>
							<span class="text-lg">No payments recorded</span>
						</div>
					}
				</div>
			</ng-template>
		</p-drawer>
	`,
})
export class UserDetailsPage implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private service = inject(UserManagementService);
	private messageService = inject(MessageService);
	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];

	user = signal<UserDetails | null>(null);
	isLoading = signal(false);
	selectedLoan = signal<Loan | null>(null);
	drawerVisible = signal(false);

	initials = computed(() => UserDetailsPage.getInitials(this.user()?.fullName ?? ''));
	avatarColor = computed(() =>
		this.getAvatarColor(`${this.user()?.fullName ?? ''}#${this.user()?.id ?? ''}`),
	);
	sortedInstallments = computed(() => {
		const list = this.selectedLoan()?.installments ?? [];
		return [...list].sort(
			(a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
		);
	});

	openPayments(loan: Loan) {
		this.selectedLoan.set(loan);
		this.drawerVisible.set(true);
	}

	ngOnInit() {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		this.loadUser(id);
	}

	private loadUser(id: number) {
		this.isLoading.set(true);
		this.service.get(id).subscribe({
			next: (details) => {
				this.user.set(details);
				this.isLoading.set(false);
			},
			error: (err: Error) => {
				this.isLoading.set(false);
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'Failed to load user details: ' + err.message,
				});
			},
		});
	}

	goBack() {
		this.router.navigate(['/admin/user-management']);
	}

	loanInitials(loan: Loan) {
		return UserDetailsPage.getInitials(loan.personName ?? '');
	}

	statusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
		switch (status?.toUpperCase()) {
			case 'PAID':
				return 'success';
			case 'ACTIVE':
				return 'info';
			case 'PARTIALLY_PAID':
				return 'warn';
			case 'OVERDUE':
				return 'danger';
			default:
				return 'secondary';
		}
	}

	getAvatarColor(name: string): string {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const index = Math.abs(hash % this.colors.length);
		return this.colors[index];
	}

	private static getInitials(name: string) {
		const matches = name.match(/\b[a-zA-Z]/g);
		return matches?.join('').toUpperCase() ?? '';
	}
}
