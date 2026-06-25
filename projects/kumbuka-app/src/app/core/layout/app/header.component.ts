import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { filter, map, startWith } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '@env/environment';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { toSignal } from '@angular/core/rxjs-interop';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { PopoverModule } from 'primeng/popover';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { SettingsIcon, NotificationIcon, LinkIcon, ReviewIcon } from 'kumbuka-icons';
import { NavigationEnd, Router, RouterLink, TitleStrategy } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { KumbukaBrand } from 'kumbuka-brand';

export type NotificationType =
	| 'loan_approved'
	| 'payment_received'
	| 'system_maintenance'
	| 'security_alert';

export interface AppNotification {
	id: number;
	title: string;
	message: string;
	type: NotificationType;
}

@Component({
	selector: 'header',
	styles: `
		:host {
			position: fixed;
			width: 100%;
			z-index: 20;
		}
	`,
	template: ` <p-toolbar class="rounded-none! pl-4! md:pl-28!">
		<ng-template #start
			><h2 class="font-semibold text-xl text-neutral-400">
				{{ pageTitle() }}
			</h2></ng-template
		>
		<!-- <ng-template #center></ng-template> -->
		<ng-template #end>
			<kumbuka-brand variant="logo-only" class="md:hidden" />
			<div class="hidden">
				<div class="flex gap-4">
					<div
						class="group flex flex-row-reverse items-center rounded-full transition-all duration-300 hover:bg-neutral-100/30"
					>
						<button
							class="rounded-full! w-15 shrink-0 z-10"
							pButton
							[text]="true"
							pTooltip="Share"
							tooltipPosition="right"
							(click)="handleCopyText()"
						>
							<svg
								class="w-7 text-neutral-400 transition-colors group-hover:text-neutral-600"
								link-icon
							></svg>
						</button>
						<div
							class="max-w-0 overflow-hidden transition-all duration-500 ease-in-out opacity-0 group-hover:max-w-75 group-hover:pl-5 group-hover:opacity-100 pr-2"
						>
							<span class="text-sm text-neutral-500 whitespace-nowrap select-all">{{
								shareUrl
							}}</span>
						</div>
					</div>
					<button
						pButton
						text="true"
						pTooltip="Notifications"
						tooltipPosition="left"
						(click)="notificationsPopover.toggle($event)"
					>
						<p-overlaybadge [value]="notifications().length.toString()" severity="info">
							<svg class="w-7 text-neutral-400" notification-icon></svg>
						</p-overlaybadge>
					</button>
					<p-popover #notificationsPopover styleClass="notifications-popover">
						<div class="flex flex-col gap-3 w-72">
							<div class="font-semibold text-neutral-600 mx-4 mt-3">
								Notifications
							</div>
							<p-divider class="m-0!" />
							<div class="mx-3 mb-3">
								<div class="flex flex-col gap-2">
									@for (
										notification of notifications().slice(0, 3);
										track notification.id
									) {
										<div
											class="flex flex-col p-2 hover:bg-neutral-50 rounded cursor-pointer transition-colors"
										>
											<div class="flex justify-between">
												<span
													class="text-sm font-semibold text-neutral-700"
													>{{ notification.title }}</span
												>
												@if (notification.type === 'payment_received') {
													<button
														[text]="true"
														[outlined]="true"
														pButton
														class="px-1! py-0.5!"
													>
														<svg class="w-4" review-icon></svg>
													</button>
												}
											</div>
											<span class="text-xs text-neutral-500">{{
												notification.message
											}}</span>
										</div>
									}
								</div>
								<p-button
									label="View more"
									routerLink="/app/notifications"
									[fluid]="true"
									class="text-sm! [&>button]:mt-2"
									variant="outlined"
								></p-button>
							</div>
						</div>
					</p-popover>
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
					<button
						routerLink="/app/profile"
						pButton
						[text]="true"
						pTooltip="Profile"
						tooltipPosition="left"
					>
						<p-avatar label="P" shape="circle" />
					</button>
				</div>
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
		AvatarModule,
		LinkIcon,
		ToastModule,
		OverlayBadgeModule,
		DividerModule,
		PopoverModule,
		ReviewIcon,
		KumbukaBrand,
	],
})
export class Header {
	private router = inject(Router);
	private titleStrategy = inject(TitleStrategy);
	shareUrl = environment.baseUrl;
	private messageService = inject(MessageService);

	pageTitle = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.titleStrategy.buildTitle(this.router.routerState.snapshot)),
			startWith(this.titleStrategy.buildTitle(this.router.routerState.snapshot)), // Set initial value
		),
	);

	notifications = signal<AppNotification[]>([
		{
			id: 1,
			title: 'Loan Approved',
			message: 'Your loan request of 7600 has been approved.',
			type: 'loan_approved',
		},
		{
			id: 2,
			title: 'Payment Received',
			message: 'We received your payment of 2000.',
			type: 'payment_received',
		},
		{
			id: 3,
			title: 'System Maintenance',
			message: 'Scheduled maintenance on Sunday at 2 AM.',
			type: 'system_maintenance',
		},
		{
			id: 4,
			title: 'Security Alert',
			message: 'New login detected from an unknown device.',
			type: 'security_alert',
		},
	]);

	handleCopyText() {
		navigator.clipboard.writeText(this.shareUrl);
		this.messageService.add({
			severity: 'info',
			summary: 'Info',
			detail: `${this.shareUrl} copied to clipboard`,
		});
	}
}
