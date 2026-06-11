import { MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { KumbukaBrand } from 'kumbuka-brand';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardIcon, LogoutIcon, WalletIcon, MoneyIcon, LogIcon } from '@assets/icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';

@Component({
	selector: 'sidebar',
	styles: `
		:host {
			display: content;
		}

		.active {
			position: relative;
		}

		.active::before {
			content: '';
			display: block;
			position: absolute;
			width: 10%;
			left: 0%;
			height: 100%;
			background-color: #e64a33;
		}
	`,
	template: `
		<div
			class="w-20 h-full fixed left-0 border-r border-neutral-300 bg-white flex flex-col items-center p-4 z-30"
		>
			<kumbuka-brand variant="logo-only" />
			<div class="mt-9 flex flex-col items-center grow justify-between">
				<div class="flex flex-col gap-6">
					<a
						routerLink="/app/dashboard"
						routerLinkActive="active"
						pButton
						[text]="true"
						pTooltip="Dashboard"
						tooltipPosition="right"
					>
						<svg class="w-8" dashboard-icon></svg>
					</a>
					<a
						routerLink="/app/ledger"
						routerLinkActive="active"
						pButton
						[text]="true"
						pTooltip="Credit & Debts"
						tooltipPosition="right"
					>
						<svg class="w-8" wallet-icon></svg>
					</a>
				</div>
				<div class="flex flex-col items-center gap-6">
					<button
						pButton
						[text]="true"
						pTooltip="Logout"
						tooltipPosition="right"
						(click)="logOut()"
					>
						<svg class="w-7" logout-icon></svg>
					</button>
				</div>
			</div>
		</div>
	`,
	standalone: true,
	imports: [
		LogoutIcon,
		RouterLink,
		WalletIcon,
		AvatarModule,
		ButtonModule,
		DialogModule,
		KumbukaBrand,
		TooltipModule,
		DashboardIcon,
		InputMaskModule,
		InputTextModule,
		DatePickerModule,
		RouterLinkActive,
		InputNumberModule,
		ReactiveFormsModule,
	],
})
export class SideNavBar implements OnInit {
	primaryMenuItems: MenuItem[] | undefined;
	router = inject(Router);
	AuthService = inject(AuthService);
	messageService = inject(MessageService);
	visible = signal(false);
	isLoading = signal(false);

	private fb = inject(FormBuilder);
	loanRequestForm: FormGroup;

	minDate: Date | undefined;

	handleClick() {
		this.visible.set(true);
	}

	ngOnInit() {
		this.primaryMenuItems = [{ icon: '<svg class="w-8" dashboard-icon></svg>' }];
		let today = new Date();
		let date = today.getDate();
		this.minDate = new Date();
		this.minDate.setDate(date);
	}

	constructor() {
		this.loanRequestForm = this.fb.group({
			lenderPhone: ['', [Validators.required]],
			amount: ['', [Validators.required, Validators.min(1)]],
			dueDate: ['', [Validators.required]],
		});
	}

	logOut() {
		this.AuthService.logout();
		this.router.navigate(['/auth/login']);
	}

	onRequest() {
		this.isLoading.set(true);
		const form = this.loanRequestForm;
		const formIsValid = form.valid;

		if (formIsValid) {
			// const payload = form.getRawValue() as LenderRequestPayload;
			// console.log('PAYLOAD', payload);
			// this.LoanService.request({ ...payload }).subscribe({
			// 	next: (res) => {
			// 		this.isLoading.set(false);
			// 		this.messageService.add({
			// 			severity: 'success',
			// 			summary: 'Success',
			// 			detail: 'Loan request successful',
			// 			life: 3000,
			// 		});
			// 		// this.step.set('email_verification');
			// 		// this.countdown().start(); // Start the countdown manually
			// 		this.router.navigate(['/app']);
			// 	},
			// 	error: (err: Error) => {
			// 		this.isLoading.set(false);
			// 		this.messageService.add({
			// 			severity: 'error',
			// 			summary: 'Failed',
			// 			detail: err.message ?? 'Registration failed',
			// 		});
			// 	},
			// });
		}
	}
}
