import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SendIcon, ArrowLeftIcon, KumbukaLogo } from '../../../assets/icons';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-forget-password',
	imports: [
		Card,
		InputTextModule,
		ButtonModule,
		SendIcon,
		ArrowLeftIcon,
		RouterLink,
		KumbukaLogo,
	],
	templateUrl: './forget-password.html',
	styleUrl: './forget-password.css',
})
export class ForgetPasswordPage {}
