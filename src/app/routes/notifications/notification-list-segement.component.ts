import { Component, input } from '@angular/core';
import { GroupedNotification } from './notifications.page';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';

@Component({
	selector: 'notification-list-segment',
	template: `
		@if (notificationSegment()?.length) {
			<div class="flex items-center gap-4 text-sm font-semibold mt-6 mb-2">
				<span class="text-neutral-400">{{ segment()?.toUpperCase() }}</span>
				<p-divider />
			</div>
			@for (notification of notificationSegment(); track notification.id) {
				<p-card class="mb-4">
					<div class="flex justify-between items-baseline">
						<h3 class="font-bold">{{ notification.title }}</h3>
						<span class="text-xs text-neutral-400">{{
							notification.formattedTime
						}}</span>
					</div>
					<p class="text-sm text-neutral-500 mt-2">{{ notification.message }}</p>
				</p-card>
			}
		}
	`,
	imports: [DividerModule, CardModule],
})
export class NotificationListSegment {
	notificationSegment = input<GroupedNotification[]>();
	segment = input<string>();
}
