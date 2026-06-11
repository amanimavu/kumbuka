import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { KumbukaBrand } from 'kumbuka-brand';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserIcon, LogoutIcon, PlusIcon } from 'kumbuka-icons';
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
						routerLink="/admin/user-management"
						routerLinkActive="active"
						pButton
						[text]="true"
						pTooltip="User Management"
						tooltipPosition="right"
					>
						<svg class="w-8" user-icon></svg>
					</a>
					<a
						routerLink="/admin/add-user"
						routerLinkActive="active"
						pButton
						[text]="true"
						pTooltip="Add User"
						tooltipPosition="right"
					>
						<svg class="w-8" add-icon></svg>
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
		ButtonModule,
		KumbukaBrand,
		TooltipModule,
		UserIcon,
		PlusIcon,
		RouterLinkActive,
	],
})
export class SideNavBar {
	router = inject(Router);
	authService = inject(AuthService);
	messageService = inject(MessageService);

	logOut() {
		this.authService.logout();
		this.router.navigate(['/auth/login']);
	}
}
