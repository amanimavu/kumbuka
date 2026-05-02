import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Password } from 'primeng/password';
import { ArrowLeftIcon, KumbukaLogo, ArrowRightIcon } from '../../../assets/icons';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-reset-password',
	imports: [Card, Password, ButtonModule, ArrowLeftIcon, RouterLink, KumbukaLogo, ArrowRightIcon],
	templateUrl: 'reset-password.html',
	styleUrl: 'reset-password.css',
})
export class ResetPasswordPage {}
