import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { filter, map, startWith } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, TitleStrategy } from '@angular/router';

@Component({
	selector: 'header',
	styles: `
		:host {
			position: fixed;
			width: 100%;
			z-index: 20;
		}
	`,
	template: `
		<p-toolbar class="rounded-none! pl-28!">
			<ng-template #start>
				<h2 class="font-semibold text-xl text-neutral-400">
					{{ pageTitle() }}
				</h2>
			</ng-template>
			<ng-template #end>
				<div class="flex gap-4">
					<button pButton [text]="true" pTooltip="Profile" tooltipPosition="left">
						<p-avatar label="A" shape="circle" />
					</button>
				</div>
			</ng-template>
		</p-toolbar>
	`,
	standalone: true,
	imports: [
		ToolbarModule,
		InputTextModule,
		TooltipModule,
		ButtonModule,
		IconFieldModule,
		InputIconModule,
		AvatarModule,
		ToastModule,
	],
})
export class Header {
	private router = inject(Router);
	private titleStrategy = inject(TitleStrategy);

	pageTitle = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.titleStrategy.buildTitle(this.router.routerState.snapshot)),
			startWith(this.titleStrategy.buildTitle(this.router.routerState.snapshot)),
		),
	);
}
