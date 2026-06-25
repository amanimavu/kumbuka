import { Component, effect, input, output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LogIcon, EditIcon, WalletIcon, FolderOpenIcon } from 'kumbuka-icons';
import type { LoanBorrowed } from '../services/loans-borrowed.service';

@Component({
	selector: 'app-obligations-list',
	imports: [
		CardModule,
		TagModule,
		ButtonModule,
		AccordionModule,
		DatePipe,
		DecimalPipe,
		LogIcon,
		EditIcon,
		WalletIcon,
		FolderOpenIcon,
	],
	template: `
		<h3 class="text-xl font-bold my-5">Outstanding Obligations</h3>

		<!-- Collapsible card list: below lg -->
		<div class="block lg:hidden">
			@if (obligations().length) {
				<p-accordion [multiple]="true">
					@for (obligation of obligations(); track obligation.id) {
						<p-accordion-panel [value]="obligation.id">
							<p-accordion-header class="items-start! sm:items-center!">
								<div
									class="flex flex-1 flex-col items-start gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-3 pr-2"
								>
									<span class="font-bold">{{ obligation.lender }}</span>
									<p-tag
										class="font-medium!"
										[severity]="obligation.severity"
										[value]="obligation.status"
										[rounded]="true"
									/>
								</div>
							</p-accordion-header>
							<p-accordion-content>
								<div class="mb-6">
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
								<button
									class="w-full mb-3"
									pButton
									severity="secondary"
									(click)="cardSelect.emit(obligation)"
								>
									<svg class="w-6" folder-open-icon></svg>
									<span class="self-start">View Payment History</span>
								</button>
								<div class="grid grid-cols-2 gap-4">
									<button
										class="w-full"
										pButton
										(click)="logRepayment.emit(obligation)"
									>
										<svg class="w-7" log-icon></svg>
										<span class="self-start">Log Repayment</span>
									</button>
									<button
										class="w-full"
										pButton
										severity="secondary"
										(click)="edit.emit(obligation)"
									>
										<svg class="w-4" edit-icon></svg>
										<span class="">Edit</span>
									</button>
								</div>
							</p-accordion-content>
						</p-accordion-panel>
					}
				</p-accordion>
			} @else if (isLoading()) {
				<div class="flex flex-col items-center justify-center py-20 text-neutral-400">
					<p>Loading obligations…</p>
				</div>
			} @else {
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div class="bg-blue-50 rounded-full p-6 mb-5">
						<svg class="w-10 text-blue-400" wallet-icon></svg>
					</div>
					<h4 class="text-lg font-bold mb-2">No outstanding obligations</h4>
					<p class="text-neutral-400 max-w-sm">
						You're all caught up. Loans you borrow will appear here so you can track
						balances and log repayments.
					</p>
				</div>
			}
		</div>

		<!-- Grid of cards: lg and up -->
		<div class="hidden lg:grid grid-cols-3 gap-6">
			@for (obligation of obligations(); track obligation.id) {
				<p-card
					class="cursor-pointer block"
					[class]="
						selectedRecord()?.id == obligation.id
							? 'border-2 border-blue-500 shadow-md transition-all'
							: 'border-2 border-transparent hover:border-blue-300 transition-all'
					"
					(click)="cardSelect.emit(obligation)"
				>
					<div class="flex justify-between items-start mb-6">
						<div class="flex flex-col">
							<span class="font-bold">{{ obligation.lender }}</span>
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
						<button
							class="w-full"
							pButton
							(click)="$event.stopPropagation(); logRepayment.emit(obligation)"
						>
							<svg class="w-7" log-icon></svg>
							<span class="self-start">Log Repayment</span>
						</button>
						<button
							class="w-full"
							pButton
							severity="secondary"
							(click)="$event.stopPropagation(); edit.emit(obligation)"
						>
							<svg class="w-7" edit-icon></svg>
							<span class="self-start">Edit</span>
						</button>
					</div>
				</p-card>
			} @empty {
				@if (isLoading()) {
					<div
						class="col-span-3 flex flex-col items-center justify-center py-20 text-neutral-400"
					>
						<p>Loading obligations…</p>
					</div>
				} @else {
					<div
						class="col-span-3 flex flex-col items-center justify-center py-20 text-center"
					>
						<div class="bg-blue-50 rounded-full p-6 mb-5">
							<svg class="w-10 text-blue-400" wallet-icon></svg>
						</div>
						<h4 class="text-lg font-bold mb-2">No outstanding obligations</h4>
						<p class="text-neutral-400 max-w-sm">
							You're all caught up. Loans you borrow will appear here so you can track
							balances and log repayments.
						</p>
					</div>
				}
			}
		</div>
	`,
})
export class ObligationsListComponent {
	obligations = input.required<any[]>();
	isLoading = input.required<boolean>();
	selectedRecord = input<any>(null);

	cardSelect = output<any>();
	logRepayment = output<LoanBorrowed>();
	edit = output<LoanBorrowed>();
}
