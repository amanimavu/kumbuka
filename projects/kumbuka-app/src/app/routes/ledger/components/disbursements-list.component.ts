import { Component, effect, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FolderOpenIcon, DeleteIcon } from 'kumbuka-icons';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
	selector: 'app-disbursements-list',
	imports: [
		TableModule,
		CardModule,
		AvatarModule,
		ButtonModule,
		AccordionModule,
		DatePipe,
		DecimalPipe,
		FolderOpenIcon,
		DeleteIcon,
		SkeletonModule,
	],
	template: `
		<!-- Collapsible card list: below lg -->
		<div class="block lg:hidden mt-5">
			<h3 class="text-xl font-bold mb-5">Disbursements</h3>
			@if (!isLoading() && disbursements().length) {
				<p-accordion [multiple]="true">
					@for (disbursement of disbursements(); track disbursement.id) {
						<p-accordion-panel class="mb-4" [value]="disbursement.id">
							<p-accordion-header class="items-start! sm:items-center!">
								<div
									class="flex flex-1 flex-col items-start gap-2.5 sm:flex-row sm:justify-between sm:items-center sm:gap-3 pr-2"
								>
									<div class="flex gap-2 items-center">
										<p-avatar
											[label]="disbursement?.initials ?? ''"
											shape="circle"
											class="text-sm!"
											[style.backgroundColor]="disbursement.avatarColor"
										/>
										<span class="font-bold">{{ disbursement.borrower }}</span>
									</div>
									<span
										class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
										[style.color]="disbursement.status.color.label"
										[style.backgroundColor]="
											disbursement.status.color.background
										"
									>
										{{ disbursement.status.label }}
									</span>
								</div>
							</p-accordion-header>
							<p-accordion-content>
								<div class="mb-6">
									<div class="flex justify-between">
										<span class="text-neutral-400">Amount lent (KSH)</span>
										<span class="font-semibold">{{
											disbursement.amount.lent | number: '1.0-0' : 'en-US'
										}}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-neutral-400">Balance (KSH)</span>
										<span class="font-semibold">{{
											disbursement.amount.balance | number: '1.0-0' : 'en-US'
										}}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-neutral-400">Due date</span>
										<span class="font-semibold">{{
											disbursement.dueDate | date: 'mediumDate'
										}}</span>
									</div>
								</div>
								<button
									class="w-full mb-3"
									pButton
									severity="secondary"
									(click)="rowSelect.emit({ data: disbursement })"
								>
									<svg class="w-6" folder-open-icon></svg>
									<span class="self-start">View Payment History</span>
								</button>
								<div class="grid grid-cols-2 gap-3">
									<p-button
										label="RECORD PAYMENT"
										[size]="'small'"
										styleClass="w-full"
										(click)="recordPayment.emit(disbursement)"
									/>
									<p-button
										label="EDIT"
										[size]="'small'"
										variant="outlined"
										styleClass="w-full"
										(click)="edit.emit(disbursement)"
									/>
								</div>
								<button
									class="w-full mt-3"
									severity="danger"
									#mDeleteBtn
									outlined
									pButton
									(click)="
										recordDelete.emit({
											target: mDeleteBtn,
											disbursement: disbursement.id,
										})
									"
								>
									<svg class="w-4" delete-icon></svg>
									<span class="self-start">Delete</span>
								</button>
							</p-accordion-content>
						</p-accordion-panel>
					}
				</p-accordion>
			} @else if (isLoading()) {
				<div class="flex flex-col items-center justify-center py-20 text-neutral-400">
					<p>Loading disbursements…</p>
				</div>
			} @else {
				<div
					class="text-neutral-500 font-medium flex flex-col items-center text-center py-20"
				>
					<svg class="w-15 m-2" folder-open-icon></svg>
					<span class="text-xl">No records</span>
				</div>
			}
		</div>

		<!-- Table: lg and up -->
		<p-card class="mt-5 hidden! lg:block!">
			<p-table
				[scrollable]="true"
				[rowHover]="true"
				selectionMode="single"
				dataKey="id"
				(onRowSelect)="rowSelect.emit($event)"
				[selection]="selectedRecord()"
				[scrollHeight]="tableHeight()"
				[value]="isLoading() ? [1, 2, 3] : disbursements()"
				[tableStyle]="{ 'min-width': '50vw' }"
			>
				<ng-template #caption>
					<div class="flex items-center justify-between">
						<span class="text-xl font-bold">Disbursements</span>
					</div>
				</ng-template>
				<ng-template #header>
					<tr>
						<th style="min-width:200px" pFrozenColumn>BORROWER</th>
						<th style="min-width:200px">AMT LENT (KSH)</th>
						<th style="min-width:200px">BAL (KSH)</th>
						<th style="min-width:200px">DUE DATE</th>
						<th>STATUS</th>
						<th>ACTIONS</th>
					</tr>
				</ng-template>
				<ng-template #body let-disbursement>
					<tr [pSelectableRow]="disbursement">
						@if (!isLoading()) {
							<td pFrozenColumn>
								<div class="flex gap-2 items-center">
									<p-avatar
										[label]="disbursement?.initials ?? ''"
										shape="circle"
										class="text-sm!"
										[style.backgroundColor]="disbursement.avatarColor"
									/>
									{{ disbursement.borrower }}
								</div>
							</td>
							<td>{{ disbursement.amount.lent | number: '1.0-0' : 'en-US' }}</td>
							<td>{{ disbursement.amount.balance | number: '1.0-0' : 'en-US' }}</td>
							<td>{{ disbursement.dueDate | date: 'mediumDate' }}</td>
							<td>
								<span
									class="rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
									[style.color]="disbursement.status.color.label"
									[style.backgroundColor]="disbursement.status.color.background"
								>
									{{ disbursement.status.label }}
								</span>
							</td>
							<td>
								<div class="flex gap-2">
									<p-button
										label="RECORD PAYMENT"
										[size]="'small'"
										styleClass="text-nowrap shrink-0"
										(click)="
											recordPayment.emit(disbursement);
											$event.stopPropagation()
										"
									/>
									<p-button
										label="EDIT"
										[size]="'small'"
										variant="outlined"
										(click)="edit.emit(disbursement); $event.stopPropagation()"
									/>
									<button
										severity="danger"
										#deleteBtn
										outlined
										pButton
										(click)="
											recordDelete.emit({
												target: deleteBtn,
												disbursement: disbursement.id,
											})
										"
										class="self-start"
									>
										<svg class="w-4.5" delete-icon></svg>
									</button>
								</div>
							</td>
						} @else {
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
						}
					</tr>
				</ng-template>
				<ng-template #emptymessage>
					@if (!isLoading() && disbursements().length === 0) {
						<tr>
							<td colspan="6">
								<div
									class="text-neutral-500 font-medium flex flex-col items-center text-center"
								>
									<svg class="w-15 m-2" folder-open-icon></svg>
									<span class="text-xl">No records</span>
								</div>
							</td>
						</tr>
					}
				</ng-template>
			</p-table>
		</p-card>
	`,
})
export class DisbursementsListComponent {
	disbursements = input.required<any[]>();
	isLoading = input.required<boolean>();
	selectedRecord = input<any>(null);
	tableHeight = input<string>('400px');

	rowSelect = output<any>();
	recordPayment = output<any>();
	recordDelete = output<{ target: EventTarget; disbursement: number }>();
	edit = output<any>();

	constructor() {
		effect(() => {
			console.log(this.isLoading());
		});
	}
}
