import { Component, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FolderOpenIcon } from '@assets/icons';

@Component({
	selector: 'app-disbursements-list',
	imports: [
		TableModule,
		CardModule,
		AvatarModule,
		ButtonModule,
		DatePipe,
		DecimalPipe,
		FolderOpenIcon,
	],
	template: `
		<p-card class="mt-5">
			<p-table
				[scrollable]="true"
				[rowHover]="true"
				selectionMode="single"
				dataKey="id"
				(onRowSelect)="rowSelect.emit($event)"
				[selection]="selectedRecord()"
				[scrollHeight]="tableHeight()"
				[value]="disbursements()"
				[tableStyle]="{ 'min-width': '50vw' }"
			>
				<ng-template #caption>
					<div class="flex items-center justify-between">
						<span class="text-xl font-bold">Disbursements</span>
					</div>
				</ng-template>
				<ng-template #header>
					<tr>
						<th>BORROWER</th>
						<th>AMOUNT (KSH)</th>
						<th>DUE DATE</th>
						<th>STATUS</th>
						<th>ACTIONS</th>
					</tr>
				</ng-template>
				<ng-template #body let-disbursement>
					<tr [pSelectableRow]="disbursement">
						<td>
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
									(click)="
										recordPayment.emit(disbursement); $event.stopPropagation()
									"
								/>
								<p-button
									label="EDIT"
									[size]="'small'"
									variant="outlined"
									(click)="edit.emit(disbursement); $event.stopPropagation()"
								/>
							</div>
						</td>
					</tr>
				</ng-template>
				<ng-template #emptymessage>
					@if (!isLoading() && disbursements().length === 0) {
						<tr>
							<td colspan="5">
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
	edit = output<any>();
}
