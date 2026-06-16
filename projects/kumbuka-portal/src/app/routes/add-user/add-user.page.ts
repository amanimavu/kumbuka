import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserManagementService } from '@routes/user-management/user-management.service';
import { CreateUserPayload, UserRole } from '@routes/user-management/user.types';

interface RoleOption {
	label: string;
	value: UserRole;
}

@Component({
	selector: 'add-user',
	imports: [
		CardModule,
		ButtonModule,
		InputTextModule,
		PasswordModule,
		SelectModule,
		MessageModule,
		ToastModule,
		ReactiveFormsModule,
	],
	template: `
		<div class="max-w-2xl mx-auto">
			<p-card>
				<h3 class="text-xl font-semibold mb-4">Add User</h3>
				<form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
					<div class="flex flex-col gap-1">
						<label for="fullName">Full Name</label>
						<input
							id="fullName"
							formControlName="fullName"
							pInputText
							placeholder="John Doe"
						/>
						@if (isInvalid('fullName')) {
							<p-message severity="error" size="small" variant="simple">{{
								getErrorMessage('fullName')
							}}</p-message>
						}
					</div>

					<div class="flex flex-col gap-1">
						<label for="email">Email</label>
						<input
							id="email"
							formControlName="email"
							pInputText
							placeholder="user@example.com"
						/>
						@if (isInvalid('email')) {
							<p-message severity="error" size="small" variant="simple">{{
								getErrorMessage('email')
							}}</p-message>
						}
					</div>

					<div class="flex flex-col gap-1">
						<label for="phoneNumber">Phone Number</label>
						<input
							id="phoneNumber"
							formControlName="phoneNumber"
							pInputText
							placeholder="+254700000000"
						/>
						@if (isInvalid('phoneNumber')) {
							<p-message severity="error" size="small" variant="simple">{{
								getErrorMessage('phoneNumber')
							}}</p-message>
						}
					</div>

					<div class="flex flex-col gap-1">
						<label for="role">Role</label>
						<p-select
							inputId="role"
							formControlName="role"
							[options]="roleOptions"
							optionLabel="label"
							optionValue="value"
							placeholder="Select role"
						/>
						@if (isInvalid('role')) {
							<p-message severity="error" size="small" variant="simple">{{
								getErrorMessage('role')
							}}</p-message>
						}
					</div>

					<div class="flex flex-col gap-1">
						<label for="password">Password</label>
						<p-password
							inputId="password"
							formControlName="password"
							[feedback]="true"
							[toggleMask]="true"
							class="[&>input]:grow"
							placeholder="Initial password"
						/>
						@if (isInvalid('password')) {
							<p-message severity="error" size="small" variant="simple">{{
								getErrorMessage('password')
							}}</p-message>
						}
					</div>

					<div class="flex justify-end gap-3 mt-3">
						<button
							pButton
							type="button"
							severity="secondary"
							[outlined]="true"
							(click)="cancel()"
						>
							Cancel
						</button>
						<button pButton type="submit" [loading]="isLoading()">Create User</button>
					</div>
				</form>
			</p-card>
		</div>
	`,
})
export class AddUserPage {
	private fb = inject(FormBuilder);
	private service = inject(UserManagementService);
	private messageService = inject(MessageService);
	private router = inject(Router);

	formSubmitted = false;
	isLoading = signal(false);

	roleOptions: RoleOption[] = [
		{ label: 'User', value: 'user' },
		{ label: 'Admin', value: 'admin' },
	];

	form: FormGroup = this.fb.group({
		fullName: ['', [Validators.required, Validators.minLength(2)]],
		email: ['', [Validators.required, Validators.email]],
		phoneNumber: ['', [Validators.required]],
		role: ['user', [Validators.required]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	});

	onSubmit() {
		this.formSubmitted = true;
		if (this.form.invalid) return;

		this.isLoading.set(true);
		const payload = this.form.getRawValue() as CreateUserPayload;

		this.service.create(payload).subscribe({
			next: () => {
				this.isLoading.set(false);
				this.messageService.add({
					severity: 'success',
					summary: 'User created',
					detail: `${payload.fullName} added as ${payload.role}.`,
				});
				this.router.navigate(['/admin/user-management']);
			},
			error: (err: Error) => {
				this.isLoading.set(false);
				this.messageService.add({
					severity: 'error',
					summary: 'Create failed',
					detail: err.message,
				});
			},
		});
	}

	cancel() {
		this.router.navigate(['/admin/user-management']);
	}

	isInvalid(controlName: string) {
		const control = this.form.get(controlName);
		return control?.invalid && (control.touched || this.formSubmitted);
	}

	getErrorMessage(controlName: string): string {
		const control = this.form.get(controlName);
		if (!control || !control.errors) return '';

		if (control.hasError('required')) {
			return 'This field is required.';
		}
		if (control.hasError('email')) {
			return 'Please enter a valid email address.';
		}
		if (control.hasError('minlength')) {
			const requiredLength = control.errors['minlength'].requiredLength;
			return `Must be at least ${requiredLength} characters.`;
		}
		return 'Invalid input.';
	}
}
