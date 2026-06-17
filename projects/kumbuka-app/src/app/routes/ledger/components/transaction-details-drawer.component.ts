import { Component, input, output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { DatePipe, DecimalPipe, NgTemplateOutlet, UpperCasePipe } from '@angular/common';

@Component({
	selector: 'app-transaction-details-drawer',
	imports: [
		DrawerModule,
		AvatarModule,
		CardModule,
		DividerModule,
		ProgressBarModule,
		TimelineModule,
		ButtonModule,
		DatePipe,
		DecimalPipe,
		NgTemplateOutlet,
		UpperCasePipe,
	],
	template: `
		<ng-template #accountDisplay let-data>
			<div class="flex flex-col text-white">
				<span class="text-[0.7rem] font-bold opacity-60">{{ data.label | uppercase }}</span>
				<span class="text-2xl font-bold">{{
					data.amount | number: '1.0-0' : 'en-US'
				}}</span>
			</div>
		</ng-template>
		<p-drawer
			id="transaction-drawer"
			[visible]="visible()"
			position="right"
			styleClass="w-full! md:w-80! lg:w-120!"
			(onHide)="hide.emit($event)"
		>
			<ng-template #header>
				<div class="flex items-center gap-2">
					<p-avatar
						[label]="getInitials(record()?.borrower ?? record()?.lender ?? '')"
						shape="circle"
					/>
					<span class="font-bold">{{ record()?.borrower ?? record()?.lender }}</span>
				</div>
			</ng-template>
			<ng-template #content>
				<p-divider class="mt-0!" />
				<div class="mx-4 pb-8">
					<p-card class="bg-kumbuka-primary-500!">
						<div class="flex justify-between">
							<ng-container
								*ngTemplateOutlet="
									accountDisplay;
									context: {
										$implicit: {
											label: 'total principle',
											amount:
												record()?.amount?.lent ??
												record()?.amount?.borrowed,
										},
									}
								"
							></ng-container>
							<ng-container
								*ngTemplateOutlet="
									accountDisplay;
									context: {
										$implicit: {
											label: 'amount paid',
											amount: record()?.amount?.paid,
										},
									}
								"
							></ng-container>
						</div>
						<div class="my-6">
							<p-progressbar
								color="#e64a33"
								class="mb-1.5"
								[value]="
									((record()?.amount?.paid ?? 0) /
										(record()?.amount?.lent ??
											record()?.amount?.borrowed ??
											0)) *
									100
								"
							>
								<ng-template #content> </ng-template>
							</p-progressbar>
							<div class="flex justify-between text-[0.7rem] text-white font-bold">
								<span class="opacity-60">REPAYMENT PROGRESS</span>
								<span class="text-[#e64a33]"
									>{{
										((record()?.amount?.paid ?? 0) /
											(record()?.amount?.lent ??
												record()?.amount?.borrowed ??
												0)) *
											100 | number: '1.0-0'
									}}%</span
								>
							</div>
						</div>
						<p-divider class="opacity-30" />
						<ng-container
							*ngTemplateOutlet="
								accountDisplay;
								context: {
									$implicit: {
										label: 'remaining balance',
										amount: record()?.amount?.balance,
									},
								}
							"
						></ng-container>
					</p-card>
					<section class="mt-6">
						<div class="flex justify-between items-center mb-6">
							<h5 class="text-lg font-bold">Installment History</h5>
						</div>
						<p-timeline class="items-start" [value]="record()?.payments ?? []">
							<ng-template #content let-installment>
								<div
									class="w-[81cqw] flex flex-col gap-1 p-1.5 rounded-xl text-sm cursor-pointer transition-colors border-1 border-neutral-300"
								>
									<div class="flex justify-between content-box">
										<span class="text-lg font-semibold"
											><span>KSH </span
											>{{
												installment.amount | number: '1.0-0' : 'en-US'
											}}</span
										>
									</div>
									<div class="flex justify-between content-box">
										<span class="font-bold text-neutral-400">{{
											installment.paymentDate
												| date: 'medium' : 'Africa/Nairobi'
										}}</span>
									</div>
								</div>
							</ng-template>
						</p-timeline>
					</section>
				</div>
			</ng-template>
		</p-drawer>
	`,
})
export class TransactionDetailsDrawerComponent {
	visible = input.required<boolean>();
	record = input.required<any>(); // Using any to smoothly accept your extended disbursement model

	hide = output<any>();

	getInitials(name: string) {
		const matches = name.match(/\b[a-zA-Z]/g);
		return matches?.join('').toUpperCase();
	}
}
