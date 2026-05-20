import { Component, inject } from '@angular/core';
import { KumbukaBrand } from '../../../shared/brand/logo.component';
import { DashboardIcon, LogoutIcon, WalletIcon } from '../../../../assets/icons';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
	template: `<div
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
					routerLink="/app/profile"
					pButton
					[text]="true"
					pTooltip="Profile"
					tooltipPosition="right"
				>
					<p-avatar label="P" shape="circle" />
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
	</div>`,
	standalone: true,
	imports: [
		KumbukaBrand,
		DashboardIcon,
		AvatarModule,
		LogoutIcon,
		ButtonModule,
		TooltipModule,
		RouterLink,
		WalletIcon,
		RouterLinkActive,
	],
})
export class SideNavBar {
	primaryMenuItems: MenuItem[] | undefined;
	router = inject(Router);
	authService = inject(AuthService);

	logOut() {
		this.authService.logout();
		this.router.navigate(['/auth/login']);
	}

	ngOnInit() {
		this.primaryMenuItems = [{ icon: '<svg class="w-8" dashboard-icon></svg>' }];
	}
}
