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
import { DashboardIcon, LogoutIcon, WalletIcon, MoneyIcon, LogIcon } from 'kumbuka-icons';
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
			background-color: #e64a33;
			/* mobile (bottom bar): horizontal bar at the bottom */
			width: 100%;
			height: 4px;
			bottom: 0;
			left: 0;
		}

		@media (min-width: 768px) {
			.active::before {
				/* md+ (left rail): vertical stripe on the left */
				width: 10%;
				height: 100%;
				top: 0;
				bottom: auto;
				left: 0;
			}
		}
	`,
	template: `
		<div
			class="fixed bottom-0 left-0 w-full h-16 border-t border-neutral-300 bg-white flex flex-row items-center justify-around px-4 z-30 md:top-0 md:bottom-auto md:h-full md:w-20 md:flex-col md:justify-start md:border-t-0 md:border-r md:p-4"
		>
			<kumbuka-brand variant="logo-only" class="hidden md:block" />
			<div
				class="contents md:mt-9 md:flex md:flex-col md:items-center md:grow md:justify-between"
			>
				<div class="flex flex-row gap-6 md:flex-col">
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
