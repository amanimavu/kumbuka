import { Component, inject } from '@angular/core';
import { KumbukaBrand } from '../../../shared/brand/logo.component';
import { DashboardIcon, LogoutIcon } from '../../../../assets/icons';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterLink } from '@angular/router';

@Component({
	selector: 'sidebar',
	styles: `
		:host {
			display: content;
		}
	`,
	template: `<div
		class="w-20 h-full fixed left-0 border-r border-neutral-300 bg-white flex flex-col items-center p-4 z-30"
	>
		<kumbuka-brand variant="logo-only" />
		<div class="mt-9 flex flex-col items-center grow justify-between">
			<div>
				<a
					routerLink="/app/dashboard"
					pButton
					[text]="true"
					pTooltip="Dashboard"
					tooltipPosition="right"
				>
					<svg class="w-8" dashboard-icon></svg>
				</a>
			</div>
			<div class="flex flex-col items-center gap-6">
				<button pButton [text]="true" pTooltip="Profile" tooltipPosition="right">
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
	],
})
export class SideNavBar {
	primaryMenuItems: MenuItem[] | undefined;
	router = inject(Router);

	logOut() {
		this.router.navigate(['/auth/login']);
	}

	ngOnInit() {
		this.primaryMenuItems = [{ icon: '<svg class="w-8" dashboard-icon></svg>' }];
	}
}
