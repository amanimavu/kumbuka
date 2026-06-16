import { Component, inject, OnInit, signal, computed, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CopyIcon } from 'kumbuka-icons';
import { UserManagementService } from './user-management.service';
import { AppUser, UserRole } from './user.types';
import { DeleteIcon } from 'kumbuka-icons';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';

interface RoleOption {
	label: string;
	value: UserRole | 'all';
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
		ConfirmDialogModule,
		FormsModule,
		RouterLink,
		DeleteIcon,
		TooltipModule,
		AvatarModule,
		SkeletonModule,
		CopyIcon,
	],
	providers: [ConfirmationService],
	template: `
		<p-card>
			<p-table
				[rows]="10"
				[value]="isLoading() ? [1, 2, 3] : users()"
				[rowHover]="true"
				[paginator]="true"
				selectionMode="single"
				styleClass="p-datatable-sm"
				[rowsPerPageOptions]="[10, 20, 50]"
			>
				<ng-template #header>
					<tr>
						<th>Full Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Actions</th>
					</tr>
				</ng-template>
				<ng-template #body let-user>
					<tr>
						@if (!isLoading()) {
							<td class="flex gap-2">
								<p-avatar
									[label]="user?.initials ?? null"
									shape="circle"
									class="text-sm!"
									[style.backgroundColor]="user.avatarColor"
								/>
								{{ user.fullName }}
							</td>
							<td>
								<div class="flex items-center">
									{{ user.email }}
									<button size="small" pButton [text]="true">
										<svg class="w-4" copy-icon></svg>
									</button>
								</div>
							</td>
							<td>{{ user.phoneNumber }}</td>
							<td>
								<button
									severity="danger"
									#deleteBtn
									[text]="true"
									pButton
									size="small"
									(click)="
										recordDelete.emit({
											target: deleteBtn,
											user: user.id,
										})
									"
								>
									<svg class="w-4" delete-icon></svg>
								</button>
							</td>
						} @else {
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
							<td><p-skeleton /></td>
						}
					</tr>
				</ng-template>
				<ng-template #emptymessage>
					@if (!isLoading() && users().length === 0) {
						<tr>
							<td colspan="6" class="text-center text-neutral-500 py-6">
								No users found.
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
	private readonly colors = ['#5D87FF80', '#FFAE1F80', '#FA896B80', '#13DEB980', '#763EBD80'];
	recordDelete = output<{ target: EventTarget; user: number }>();

	deleteRecord = output();

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

	private router = inject(Router);

	_users = signal<AppUser[]>([]);
	isLoading = signal(false);
	roleFilter: UserRole | 'all' = 'all';

	roleOptions: RoleOption[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Users', value: 'user' },
		{ label: 'Admins', value: 'admin' },
	];

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

	confirmDelete(user: AppUser) {
		this.confirmationService.confirm({
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
