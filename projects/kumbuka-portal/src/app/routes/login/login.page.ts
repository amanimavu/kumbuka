import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ArrowRightIcon, KumbukaLogo } from 'kumbuka-icons';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AutoFocusModule } from 'primeng/autofocus';
import { AuthService } from '@app/core/services/auth.service';

@Component({
	selector: 'login',
	imports: [
		CardModule,
		ButtonModule,
		InputTextModule,
		ArrowRightIcon,
		PasswordModule,
		KumbukaLogo,
		ReactiveFormsModule,
		MessageModule,
		ToastModule,
		AutoFocusModule,
	],
	templateUrl: './login.html',
})
export class LoginPage {
	private fb = inject(FormBuilder);
	messageService = inject(MessageService);
	private authService = inject(AuthService);
	private router = inject(Router);
	loginForm: FormGroup;
	formSubmitted = false;
	isLoading = false;

	constructor() {
		this.loginForm = this.fb.group({
			password: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
		});
	}

	onSubmit() {
		this.isLoading = true;
		this.formSubmitted = true;

		if (this.loginForm.valid) {
			const credentials = this.loginForm.getRawValue();

			this.authService.login(credentials).subscribe({
				next: (res) => {
					this.authService.storeResponseData(res, ['token', 'refreshToken', 'email']);
					this.isLoading = false;
					this.formSubmitted = false;
					this.router.navigate(['/admin/user-management']);
				},
				error: (err: Error) => {
					this.isLoading = false;
					this.formSubmitted = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Login Failed',
						detail: err.message,
					});
				},
			});
		} else {
			this.isLoading = false;
		}
	}

	isInvalid(controlName: string) {
		const control = this.loginForm.get(controlName);
		return control?.invalid && (control.touched || this.formSubmitted);
	}

	getErrorMessage(controlName: string): string {
		const control = this.loginForm.get(controlName);
		if (!control || !control.errors) return '';

		if (control.hasError('required')) {
			const label = controlName.charAt(0).toUpperCase() + controlName.slice(1);
			return `${label} is required.`;
		}
		if (control.hasError('email')) {
			return 'Please enter a valid email address.';
		}
		return 'Invalid input.';
	}
}
