import { Component, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LogIcon, EditIcon } from '@assets/icons';
import type { LoanBorrowed } from '../services/loans-borrowed.service';

@Component({
	selector: 'app-obligations-list',
	imports: [CardModule, TagModule, ButtonModule, DatePipe, DecimalPipe, LogIcon, EditIcon],
	template: `
		<h3 class="text-xl font-bold my-5">Outstanding Obligations</h3>
		<div class="grid grid-cols-3 gap-6">
			@for (obligation of obligations(); track obligation.id) {
				<p-card>
					<div class="flex justify-between items-start mb-6">
						<div class="flex flex-col">
							<span class="font-bold">{{ obligation.personName }}</span>
						</div>
						<p-tag
							class="font-medium!"
							[severity]="obligation.severity"
							[value]="obligation.status"
							[rounded]="true"
						/>
					</div>
					<div class="mb-10">
						<div class="flex justify-between">
							<span class="text-neutral-400">Amount borrowed</span>
							<span class="font-semibold">{{
								obligation.amount.borrowed | number: '1.0-0' : 'en-US'
							}}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-neutral-400">Pending amount</span>
							<span class="font-semibold">{{
								obligation.amount.balance | number: '1.0-0' : 'en-US'
							}}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-neutral-400">Due date</span>
							<span class="text-red-500 font-semibold">{{
								obligation.dueDate | date: 'mediumDate'
							}}</span>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<button class="w-full" pButton (click)="logRepayment.emit(obligation)">
							<svg class="w-7" log-icon></svg>
							<span class="self-start">Log Repayment</span>
						</button>
						<button
							class="w-full"
							pButton
							severity="secondary"
							(click)="edit.emit(obligation)"
						>
							<svg class="w-7" edit-icon></svg>
							<span class="self-start">Edit</span>
						</button>
					</div>
				</p-card>
			}
		</div>
	`,
})
export class ObligationsListComponent {
	obligations = input.required<any[]>();
	isLoading = input.required<boolean>();

	logRepayment = output<LoanBorrowed>();
	edit = output<LoanBorrowed>();
}
