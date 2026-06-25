import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { Component, inject } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { AutoFocusModule } from 'primeng/autofocus';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { Router, RouterLink } from '@angular/router';
import { ArrowRightIcon, KumbukaLogo, MailIcon } from 'kumbuka-icons';
import { AuthService } from '../../core/services/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

type FormType = 'password' | 'password-less';
type LoginStep = 'get-otp' | 'login';

@Component({
	selector: 'login',
	styleUrl: 'login.css',
	styles: `
		.p-divider-content {
			background-color: black !important;
		}
	`,
	imports: [
		CardModule,
		ButtonModule,
		InputTextModule,
		TabsModule,
		ArrowRightIcon,
		PasswordModule,
		DividerModule,
		KumbukaLogo,
		InputOtpModule,
		RouterLink,
		ReactiveFormsModule,
		MessageModule,
		ToastModule,
		AutoFocusModule,
		IconFieldModule,
		MailIcon,
		InputIconModule,
	],
	templateUrl: './login.html',
})
export class LoginPage {
	private fb = inject(FormBuilder);
	messageService = inject(MessageService);
	private authService = inject(AuthService);
	private router = inject(Router);
	PasswordLoginForm: FormGroup;
	PasswordlessLoginForm: FormGroup;
	formSubmitted: boolean = false;
	isLoading: boolean = false;
	step: LoginStep = 'login';

	changeLoginStep(step: LoginStep) {
		this.step = step;
		console.log(this.step);
	}

	constructor() {
		this.PasswordLoginForm = this.fb.group({
			password: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
		});

		this.PasswordlessLoginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			otp: [
				'',
				[Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]*$')],
			],
		});
	}

	getOtp() {
		this.changeLoginStep('login');
	}

	login(form: FormGroup<any>) {
		this.formSubmitted = true;
		const formIsValid = form.valid;

		if (formIsValid) {
			this.isLoading = true;
			const credentials = form.getRawValue();

			this.authService.login(credentials).subscribe({
				next: (res) => {
					this.authService.storeResponseData(res, ['token', 'refreshToken', 'email']);
					this.isLoading = false;
					this.formSubmitted = false;
					this.router.navigate(['/app/dashboard']);
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
		}
	}

	onSubmit(formType: FormType) {
		console.log('submitting');
		console.log(this.step);
		const form = formType === 'password' ? this.PasswordLoginForm : this.PasswordlessLoginForm;

		if (this.step === 'login') {
			this.login(form);
		} else {
			this.getOtp();
		}
	}

	isInvalid(controlName: string, formType: FormType) {
		const form = formType === 'password' ? this.PasswordLoginForm : this.PasswordlessLoginForm;
		const control = form.get(controlName);
		return control?.invalid && (control.touched || this.formSubmitted);
	}

	getErrorMessage(controlName: string, formType: FormType): string {
		const form = formType === 'password' ? this.PasswordLoginForm : this.PasswordlessLoginForm;
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
		if (control.hasError('minlength')) {
			const requiredLength = control.errors['minlength'].requiredLength;
			return `Must be at least ${requiredLength} characters.`;
		}
		if (control.hasError('pattern')) {
			return 'Only numeric characters are allowed.';
		}
		return 'Invalid input.';
	}
}
