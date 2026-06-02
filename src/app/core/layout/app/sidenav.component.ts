import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { AuthService } from '../../services/auth.service';
import { KumbukaBrand } from '@shared/brand/logo.component';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardIcon, LogoutIcon, WalletIcon, MoneyIcon } from '@assets/icons';

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
		<p-dialog
			header="Request loan"
			[(visible)]="visible"
			[modal]="true"
			[style]="{ width: '25rem' }"
			[dismissableMask]="true"
		>
			<form>
				<div class="flex flex-col mb-4 gap-1">
					<label for="phoneNumber">Phone Number</label>
					<input placeholder="07XXX" id="phoneNumber" type="text" pInputText />
				</div>
				<div class="flex flex-col mb-4 gap-1">
					<label for="amount">Amount</label>
					<p-inputnumber placeholder="7600" id="amount" inputId="integeronly" />
				</div>
				<div class="flex flex-col mb-4 gap-1">
					<label for="">Due date</label>
					<p-datepicker
						[minDate]="minDate"
						appendTo="body"
						[iconDisplay]="'input'"
						[showIcon]="true"
						inputId="icondisplay"
						dateFormat="dd M yy"
						placeholder="dd Mmm yyyy"
						pInputMask="99 aaa 9999"
						[showButtonBar]="true"
					/>
				</div>
				<p-button fluid>REQUEST</p-button>
			</form>
		</p-dialog>
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
						pTooltip="Ledger"
						tooltipPosition="right"
					>
						<svg class="w-8" wallet-icon></svg>
					</a>
				</div>
				<div class="flex flex-col items-center gap-6">
					<button
						pButton
						class="bg-[#e64a33]! hover:bg-[#ff6b42]! border-0! w-[80%] aspect-square rounded-full!"
						pTooltip="Request loan"
						tooltipPosition="right"
						(click)="handleClick()"
					>
						<svg class="w-7" money-icon></svg>
					</button>
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
		MoneyIcon,
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
	],
})
export class SideNavBar implements OnInit {
	primaryMenuItems: MenuItem[] | undefined;
	router = inject(Router);
	authService = inject(AuthService);
	visible = signal(false);

	minDate: Date | undefined;

	handleClick() {
		this.visible.set(true);
	}

	logOut() {
		this.authService.logout();
		this.router.navigate(['/auth/login']);
	}

	ngOnInit() {
		this.primaryMenuItems = [{ icon: '<svg class="w-8" dashboard-icon></svg>' }];
		let today = new Date();
		let date = today.getDate();
		this.minDate = new Date();
		this.minDate.setDate(date);
	}
}
