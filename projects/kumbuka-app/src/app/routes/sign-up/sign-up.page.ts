import { FormGroup } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { useCountdown } from '@shared/utils/counter';
import { AuthService } from '@core/services/auth.service';
import { KumbukaBrand } from 'kumbuka-brand';
import { Component, inject, model, signal } from '@angular/core';
import { RegistrationForm } from './registration-form.component';
import { LocalstorageService } from '@shared/services/localstorage.service';
import { EmailVerificationForm } from './email-verification-form.component';
import type { RegistrationRequestPayload } from '@core/services/auth.service';

type Step = 'registration' | 'email_verification';

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
	step = model<Step>('registration');

	countdown = useCountdown(60); // autoStart = false
	authService = inject(AuthService);
	messageService = inject(MessageService);
	localstorage = inject(LocalstorageService);
	router = inject(Router);
	isLoading = signal(false);

	register(form: FormGroup) {
		this.isLoading.set(true);
		const formIsValid = form.valid;

		if (formIsValid) {
			const payload = form.getRawValue() as RegistrationRequestPayload;
			console.log('PAYLOAD', payload);
			this.authService.register({ ...payload }).subscribe({
				next: (res) => {
					this.isLoading.set(false);

					this.messageService.add({
						severity: 'success',
						summary: 'Success',
						detail: res.message,
						life: 3000,
					});

					this.authService.storeResponseData(res, ['token', 'refreshToken', 'email']);
					// this.step.set('email_verification');
					// this.countdown().start(); // Start the countdown manually
					this.router.navigate(['/app']);
				},
				error: (err: Error) => {
					this.isLoading.set(false);
					this.messageService.add({
						severity: 'error',
						summary: 'Failed',
						detail: err.message ?? 'Registration failed',
					});
				},
			});
		}
	}
}
