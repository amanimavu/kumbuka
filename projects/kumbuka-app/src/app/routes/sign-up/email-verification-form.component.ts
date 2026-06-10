import { Component, inject, input, Signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LocalstorageService } from '@app/shared/services/localstorage.service';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

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
