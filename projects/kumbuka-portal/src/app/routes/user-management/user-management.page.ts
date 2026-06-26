import { AppUser } from './user.types';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DeleteIcon } from 'kumbuka-icons';
import { Password } from 'primeng/password';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule, NgForm } from '@angular/forms';
import { CopyIcon, LockResetIcon } from 'kumbuka-icons';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserManagementService } from './user-management.service';
import { Component, inject, OnInit, signal, computed, output } from '@angular/core';

export class PassReset {
	constructor(
		public password?: string,
		public confirmPassword?: string,
	) {}
}

@Component({
	selector: 'user-management',
	imports: [
		TableModule,
		ButtonModule,
		CardModule,
		TagModule,
		SelectModule,
		ToastModule,
		TooltipModule,
		FormsModule,
		DeleteIcon,
		TooltipModule,
		AvatarModule,
		SkeletonModule,
		CopyIcon,
		BadgeModule,
		ConfirmPopupModule,
		LockResetIcon,
		DialogModule,
		Password,
	],
	providers: [ConfirmationService],
	template: `
		<p-dialog
			[header]="'Reset Password for ' + userBeingReset()?.fullName"
			[modal]="true"
			[(visible)]="passResetDialogueIsOpen"
			[style]="{ width: '30rem' }"
		>
			<form
				id="resetPassForm"
				#resetPassForm="ngForm"
				(ngSubmit)="sendPassResetRequest(resetPassForm, userBeingReset()?.id)"
			>
				<div class="flex flex-col gap-4 mb-4">
					<label for="username" class="font-semibold">New Password</label>
					<div class="flex flex-col gap-1">
						<p-password
							id="password"
							name="password"
							[toggleMask]="true"
							class="[&>input]:w-full"
							autocomplete="off"
							[(ngModel)]="passReset.password"
							#password="ngModel"
							autocomplete="new-password"
							[invalid]="
								password.invalid && (password.touched || resetPassForm.submitted)
							"
							required
						/>
						@if (password.invalid && (password.touched || resetPassForm.submitted)) {
							<p class="text-xs text-red-500">Password is required</p>
						}
					</div>
				</div>
				<div class="flex flex-col gap-4 mb-4">
					<label for="username" class="font-semibold">Confirm New Password</label>
					<p-password
						id="confirmPassword"
						name="confirmPassword"
						[toggleMask]="true"
						class="[&>input]:w-full"
						autocomplete="off"
						[(ngModel)]="passReset.confirmPassword"
						#confirmPassword="ngModel"
						autocomplete="new-password"
						[invalid]="
							(confirmPassword.invalid || confirmPassword.value !== password.value) &&
							(confirmPassword.touched || resetPassForm.submitted)
						"
						required
					/>
				</div>
				<div class="flex justify-end gap-2">
					<p-button
						label="Cancel"
						severity="secondary"
						(click)="cancelPassReset(resetPassForm)"
					/>
					<p-button
						[loading]="loading()"
						label="Save"
						type="submit"
						form="resetPassForm"
					/>
				</div>
			</form>
		</p-dialog>
		<p-card>
			<p-confirmpopup />
			<p-table
				[rows]="10"
				[(selection)]="selectedProduct"
				[value]="isLoading() ? [1, 2, 3] : users()"
				[paginator]="users().length > 0 ? true : false"
				selectionMode="single"
				size="small"
				dataKey="id"
				(onRowSelect)="onRowSelect($event)"
				[rowsPerPageOptions]="[10, 20, 50]"
				[scrollable]="true"
			>
				<ng-template #header>
					<tr>
						<th pFrozenColumn class="min-w-52">Full Name</th>
						<th>Email</th>
						<th class="min-w-40">Phone</th>
						<th class="min-w-32">Loans Lent</th>
						<th class="min-w-36">Loans Borrowed</th>
						<th>Actions</th>
					</tr>
				</ng-template>
				<ng-template #body let-user>
					@if (!isLoading()) {
						<tr [pSelectableRow]="user">
							<td class="flex gap-2" pFrozenColumn>
								<p-avatar
									[label]="user?.initials ?? null"
									shape="circle"
									class="text-sm!"
									[style.backgroundColor]="user.avatarColor"
								/>
								{{ user.fullName }}
							</td>
							<td>
								<div class="flex gap-2 items-center">
									<span>{{ user.email }}</span>
									<button
										(click)="
											$event.stopPropagation(); handleEmailCopy(user.email)
										"
										size="small"
										pButton
										[text]="true"
									>
										<svg class="w-4" copy-icon></svg>
									</button>
								</div>
							</td>
							<td>{{ user.phoneNumber }}</td>
							<td>
								<p-badge [value]="user.loansLent" />
							</td>
							<td>
								<p-badge [value]="user.loansBorrowed" />
							</td>

							<td>
								<div class="flex gap-1">
									<button
										pTooltip="Delete"
										tooltipPosition="bottom"
										severity="danger"
										#deleteBtn
										[text]="true"
										pButton
										size="small"
										(click)="
											$event.stopPropagation(); confirmDelete($event, user)
										"
									>
										<svg class="w-4" delete-icon></svg>
									</button>
									<button
										pTooltip="Reset password"
										tooltipPosition="bottom"
										severity="help"
										#passResetBtn
										[text]="true"
										pButton
										size="small"
										(click)="$event.stopPropagation(); resetUserPass(user)"
									>
										<svg class="w-4" lock-reset-icon></svg>
									</button>
								</div>
							</td>
						</tr>
					} @else {
						<tr>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
						</tr>
					}
				</ng-template>
				<ng-template #emptymessage>
					@if (!isLoading() && users().length === 0) {
						<tr>
							<td colspan="6">
								<div
									class="text-neutral-500 font-medium flex flex-col items-center text-center"
								>
									<svg class="w-10 m-2" folder-open-icon></svg>
									<span class="text-xl">No users records</span>
								</div>
							</td>
						</tr>
					}
				</ng-template>
			</p-table>
		</p-card>
	`,
})
export class UserManagementPage implements OnInit {
	private service = inject(UserManagementService);
	private messageService = inject(MessageService);
	private confirmationService = inject(ConfirmationService);
	passResetDialogueIsOpen = signal(false);
	userBeingReset = signal<AppUser | null>(null);
	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];
	passReset = new PassReset();
	loading = signal(false);

	deleteRecord = output();
	selectedProduct!: any;

	cancelPassReset(form: NgForm) {
		form.resetForm();
		this.passResetDialogueIsOpen.set(false);
	}

	resetUserPass(user: AppUser) {
		this.passResetDialogueIsOpen.set(true);
		this.userBeingReset.set(user);
	}

	sendPassResetRequest(form: NgForm, userId?: number) {
		if (userId) {
			const payload = { password: form.value.password };
			this.loading.set(true);
			this.service.resetPassword(userId, payload).subscribe({
				next: (res) => {
					this.loading.set(false);
					form.resetForm();
					this.passResetDialogueIsOpen.set(false);

					this.messageService.add({
						severity: 'info',
						summary: 'Success',
						detail: res.message,
					});
				},
				error: (err: Error) => {
					this.loading.set(false);

					this.messageService.add({
						severity: 'error',
						summary: 'Failure',
						detail: err.message,
					});
				},
			});
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
		return matches?.join('').toUpperCase();
	}

	handleEmailCopy(email: string) {
		navigator.clipboard.writeText(email);
		this.messageService.add({
			severity: 'info',
			summary: `${email}`,
			detail: `copied`,
		});
	}

	private router = inject(Router);

	_users = signal<AppUser[]>([]);
	isLoading = signal(false);

	users = computed<any[]>(() => {
		return this._users().map((user) => {
			const avatarColor = this.getAvatarColor(`${user.fullName}#${user.id}`);
			const initials = UserManagementPage.getInitials(user.fullName);
			return {
				...user,
				avatarColor,
				initials,
			};
		});
	});

	ngOnInit() {
		this.loadUsers();
	}

	loadUsers() {
		this.isLoading.set(true);
		this.service.list().subscribe({
			next: (data) => {
				this._users.set(data);
				this.isLoading.set(false);
			},
			error: (err: Error) => {
				this.isLoading.set(false);
				this.messageService.add({
					severity: 'error',
					summary: 'Load failed',
					detail: err.message,
				});
			},
		});
	}

	onRowSelect(event: any) {
		const user = event.data;
		this.router.navigate(['/admin/user-details', user.id]);
	}

	confirmDelete(event: Event, user: AppUser) {
		this.confirmationService.confirm({
			target: event.currentTarget as EventTarget,
			message: `Delete ${user.fullName}? This cannot be undone.`,
			header: 'Confirm Delete',
			accept: () => this.deleteUser(user),
		});
	}

	private deleteUser(user: AppUser) {
		this.service.delete(user.id).subscribe({
			next: () => {
				this._users.update((list) => list.filter((u) => u.id !== user.id));
				this.messageService.add({
					severity: 'success',
					summary: 'Deleted',
					detail: `${user.fullName} removed.`,
				});
			},
			error: (err: Error) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Delete failed',
					detail: err.message,
				});
			},
		});
	}
}
