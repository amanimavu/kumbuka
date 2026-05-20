import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { SettingsIcon, NotificationIcon } from '../../../../assets/icons';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NavigationEnd, Router, RouterLink, TitleStrategy } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
	selector: 'header',
	styles: `
		:host {
			position: fixed;
			width: 100%;
			z-index: 20;
		}
	`,
	template: `<p-toolbar class="rounded-none! pl-28!">
		<ng-template #start
			><h2 class="font-semibold text-xl text-neutral-400">{{ pageTitle() }}</h2></ng-template
		>
		<!-- <ng-template #center></ng-template> -->
		<ng-template #end>
			<div class="flex gap-4">
				<button pButton text="true">
					<svg class="w-7 text-neutral-400" notification-icon></svg>
				</button>
				<a
					routerLink="/app/settings"
					fragment="account"
					text="true"
					pButton
					pTooltip="Settings"
					tooltipPosition="left"
				>
					<svg class="w-7 text-neutral-400" settings-icon></svg>
				</a>
				<!-- <button link pButton text="true"></button> -->
			</div>
		</ng-template>
	</p-toolbar>`,
	standalone: true,
	imports: [
		ToolbarModule,
		InputTextModule,
		SettingsIcon,
		NotificationIcon,
		TooltipModule,
		ButtonModule,
		IconFieldModule,
		InputIconModule,
		RouterLink,
	],
})
export class Header {
	private router = inject(Router);
	private titleStrategy = inject(TitleStrategy);

	pageTitle = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.titleStrategy.buildTitle(this.router.routerState.snapshot)),
			startWith(this.titleStrategy.buildTitle(this.router.routerState.snapshot)), // Set initial value
		),
	);
}
