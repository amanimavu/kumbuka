import { Component, inject, input, output, signal, Signal } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { LocalstorageService } from '@app/shared/services/localstorage.service';
import { ArrowRightIcon } from 'kumbuka-icons';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

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
})
export class RegistrationForm {
	signUpForm: FormGroup;
	formSubmitted: boolean = false;
	private fb = inject(FormBuilder);
	isLoading = signal(false);
	authService = inject(AuthService);
	localstorage = inject(LocalstorageService);
	router = inject(Router);
	submitted = output<typeof this.signUpForm>();

	countdown = input.required<{
		count: Signal<number>;
		start: (duration?: number) => void;
	}>();

	constructor() {
		this.signUpForm = this.fb.group(
			{
				fullName: ['', [Validators.required]],
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

	onSubmit() {
		this.formSubmitted = true;
		this.submitted.emit(this.signUpForm);
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
