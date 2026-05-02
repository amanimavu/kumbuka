import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { ArrowRightIcon, KumbukaLogo } from '../../../assets/icons';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputOtpModule } from 'primeng/inputotp';
import { RouterLink } from '@angular/router';

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
	],
	templateUrl: './login.html',
})
export class LoginPage {}
