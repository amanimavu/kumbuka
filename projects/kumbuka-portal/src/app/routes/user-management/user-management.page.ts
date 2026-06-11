import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { PlusIcon } from 'kumbuka-icons';
import { UserManagementService } from './user-management.service';
import { AppUser, UserRole } from './user.types';

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
		PlusIcon,
		DatePipe,
	],
	providers: [ConfirmationService],
	template: `
		<p-toast />
		<p-confirmdialog />
		<p-card>
			<div class="flex justify-between items-center mb-4">
				<div class="flex items-center gap-3">
					<label class="font-medium text-neutral-600">Filter:</label>
					<p-select
						[options]="roleOptions"
						[(ngModel)]="roleFilter"
						optionLabel="label"
						optionValue="value"
						styleClass="w-40"
					/>
				</div>
				<a routerLink="/admin/add-user" pButton severity="primary">
					<svg class="w-5" add-icon></svg>
					<span pButtonLabel>Add User</span>
				</a>
			</div>
			<p-table
				[value]="filteredUsers()"
				[loading]="isLoading()"
				[paginator]="true"
				[rows]="10"
				[rowsPerPageOptions]="[10, 20, 50]"
				styleClass="p-datatable-sm"
			>
				<ng-template #header>
					<tr>
						<th>Full Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Role</th>
						<th>Created</th>
						<th>Actions</th>
					</tr>
				</ng-template>
				<ng-template #body let-user>
					<tr>
						<td>{{ user.fullName }}</td>
						<td>{{ user.email }}</td>
						<td>{{ user.phoneNumber }}</td>
						<td>
							<p-tag
								[value]="user.role"
								[severity]="user.role === 'admin' ? 'warn' : 'info'"
							/>
						</td>
						<td>{{ user.createdAt | date: 'mediumDate' }}</td>
						<td>
							<button
								pButton
								severity="danger"
								[text]="true"
								pTooltip="Delete user"
								(click)="confirmDelete(user)"
							>
								Delete
							</button>
						</td>
					</tr>
				</ng-template>
				<ng-template #emptymessage>
					<tr>
						<td colspan="6" class="text-center text-neutral-500 py-6">
							No users found.
						</td>
					</tr>
				</ng-template>
			</p-table>
		</p-card>
	`,
})
export class UserManagementPage implements OnInit {
	private service = inject(UserManagementService);
	private messageService = inject(MessageService);
	private confirmationService = inject(ConfirmationService);
	private router = inject(Router);

	users = signal<AppUser[]>([]);
	isLoading = signal(false);
	roleFilter: UserRole | 'all' = 'all';

	roleOptions: RoleOption[] = [
		{ label: 'All', value: 'all' },
		{ label: 'Users', value: 'user' },
		{ label: 'Admins', value: 'admin' },
	];

	filteredUsers = computed(() => {
		const all = this.users();
		if (this.roleFilter === 'all') return all;
		return all.filter((u) => u.role === this.roleFilter);
	});

	ngOnInit() {
		this.loadUsers();
	}

	loadUsers() {
		this.isLoading.set(true);
		this.service.list().subscribe({
			next: (data) => {
				this.users.set(data);
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
				this.users.update((list) => list.filter((u) => u.id !== user.id));
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
