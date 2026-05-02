import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ArrowRightIcon } from '../../../assets/icons';
import { DividerModule } from 'primeng/divider';
import { KumbukaBrand } from '../../shared/brand/logo.component';
import { PasswordModule } from 'primeng/password';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'sign-up',
	templateUrl: './sign-up.html',
	imports: [
		CardModule,
		TabsModule,
		FormsModule,
		InputTextModule,
		CheckboxModule,
		ButtonModule,
		ArrowRightIcon,
		DividerModule,
		KumbukaBrand,
		PasswordModule,
		RouterLink,
	],
})
export class SigUpPage {}
