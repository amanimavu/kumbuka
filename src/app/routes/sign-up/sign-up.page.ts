import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	NgForm,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { JsonPipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ArrowRightIcon } from '@assets/icons';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
// import { IconFieldModule } from 'primeng/iconfield';
import { useCountdown } from '@shared/utils/counter';
import { AuthService } from '@core/services/auth.service';
import { KumbukaBrand } from '@shared/brand/logo.component';
import type { RegistrationPayload } from '@core/services/auth.service';
import { LocalstorageService } from '@shared/services/localstorage.service';
import { Component, inject, input, model, Signal, signal } from '@angular/core';

type Step = 'registration' | 'email_verification';
class EmailVerification {
	constructor(
		public email: string,
		public otp: string,
	) {}
}

@Component({
	selector: 'email-verification-form',
	styles: `
		input.ng-dirty + small {
			display: none;
		}

		button[type='submit'][disabled] {
			cursor: not-allowed;
		}
	`,
	templateUrl: 'email-verification-form.html',
	standalone: true,
	imports: [FormsModule, InputOtpModule, ButtonModule, InputTextModule, MessageModule],
})
export class EmailVerificationForm {
	countdown = input.required<{
		count: Signal<number>;
		start: (duration?: number) => void;
	}>();
	localstorage = inject(LocalstorageService);
	email = this.localstorage.get('email');

	get count() {
		return this.countdown().count;
	}

	model = new EmailVerification(this.email, '');
	onSubmit(form: NgForm) {
		console.log(form.submitted);
		const payload = form.value;
	}
	resendCode() {
		if (this.count() === 0) {
			// TODO: Add your logic to trigger the API call to resend the OTP here
			this.countdown().start(); // Resets and restarts the counter
		}
	}
}

@Component({
	templateUrl: 'registration-form.html',
	selector: 'registration-form',
	imports: [
		ReactiveFormsModule,
		InputTextModule,
		ArrowRightIcon,
		PasswordModule,
		CheckboxModule,
		DividerModule,
		ButtonModule,
		RouterLink,
		MessageModule,
	],
	standalone: true,
})
export class RegistrationForm {
	signUpForm: FormGroup;
	formSubmitted: boolean = false;
	messageService = inject(MessageService);
	private fb = inject(FormBuilder);
	isLoading = signal(false);
	authService = inject(AuthService);
	localstorage = inject(LocalstorageService);
	router = inject(Router);

	countdown = input.required<{
		count: Signal<number>;
		start: (duration?: number) => void;
	}>();
	step = model<Step>('registration');

	constructor() {
		this.signUpForm = this.fb.group(
			{
				name: ['', [Validators.required]],
				email: ['', [Validators.required, Validators.email]],
				phoneNumber: ['', [Validators.required]],
				password: ['', [Validators.required, this.createPasswordStrengthValidator()]],
				confirmPassword: ['', Validators.required],
			},
			{ validators: this.passwordMatchValidator },
		);
	}

	isInvalid(controlName: string) {
		const form = this.signUpForm;
		const control = form.get(controlName);
		return control?.invalid && (control.touched || this.formSubmitted);
	}

	getErrorMessage(controlName: string): string {
		const form = this.signUpForm;
		const control = form.get(controlName);

		if (!control || !control.errors) return '';

		if (control.hasError('required')) {
			const label =
				controlName === 'otp'
					? 'OTP'
					: controlName.charAt(0).toUpperCase() + controlName.slice(1);
			return `${label} is required.`;
		}
		if (control.hasError('email')) {
			return 'Please enter a valid email address.';
		}
		if (control.hasError('passwordMismatch')) {
			return 'Passwords do not match.';
		}
		if (control.hasError('passwordStrength')) {
			return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
		}

		return 'Invalid input.';
	}

	register(form: FormGroup) {
		this.formSubmitted = true;
		this.isLoading.set(true);
		const formIsValid = form.valid;

		if (formIsValid) {
			const payload = form.getRawValue() as RegistrationPayload;
			console.log('PAYLOAD', payload);
			this.authService.register({ ...payload, role: 'BORROWER' }).subscribe({
				next: (res) => {
					this.isLoading.set(false);
					this.formSubmitted = false;

					console.log(res);
					this.messageService.add({
						severity: 'success',
						summary: 'Success',
						detail: res as string,
						life: 3000,
					});

					this.localstorage.set('email', payload.email);
					// this.step.set('email_verification');
					// this.countdown().start(); // Start the countdown manually
					this.router.navigate(['/auth/login']);
				},
				error: (err: Error) => {
					this.isLoading.set(false);
					this.formSubmitted = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Failed',
						detail: err.message ?? 'Registration failed',
					});
				},
			});
		}
	}

	onSubmit() {
		this.register(this.signUpForm);
	}

	createPasswordStrengthValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;

			if (!value) {
				return null;
			}

			const hasUpperCase = /[A-Z]+/.test(value);

			const hasLowerCase = /[a-z]+/.test(value);

			const hasNumeric = /[0-9]+/.test(value);

			const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

			if (!passwordValid) {
				return { passwordStrength: { hasLowerCase, hasUpperCase, hasNumeric } };
			}
			return null;
		};
	}

	passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		const password = control.get('password');
		const confirmPassword = control.get('confirmPassword');

		if (!password || !confirmPassword) return null;

		if (password.value !== confirmPassword.value) {
			confirmPassword.setErrors({
				...(confirmPassword.errors || {}),
				passwordMismatch: true,
			});
			return { passwordMismatch: true };
		} else if (confirmPassword.hasError('passwordMismatch')) {
			const errors = { ...confirmPassword.errors };
			delete errors['passwordMismatch'];
			confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
		}
		return null;
	};
}

@Component({
	selector: 'sign-up',
	templateUrl: './sign-up.html',
	imports: [
		CardModule,
		TabsModule,
		KumbukaBrand,
		ToastModule,
		EmailVerificationForm,
		RegistrationForm,
	],
})
export class SigUpPage {
	filled = 'filled' as const;

	step = signal<Step>('registration');
	countdown = useCountdown(60); // autoStart = false
}
