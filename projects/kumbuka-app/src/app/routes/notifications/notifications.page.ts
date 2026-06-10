import { Component, computed, effect, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MOCK_NOTIFICATIONS } from './notification-data';
import { NotificationListSegment } from './notification-list-segement.component';

class CustomDate extends Date {
	private static monthsOfTheYear = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	private static getDateBoundaries() {
		const now = new Date();
		const day = now.getDate();
		const month = now.getMonth();
		const year = now.getFullYear();
		const startOfToday = new Date(year, month, day);
		const endOfToday = new Date(year, month, day, 23, 59, 59);
		const startOfYesterday = new Date(year, month, day - 1);

		return { startOfToday, endOfToday, startOfYesterday };
	}

	get isToday() {
		const datetime = this;
		const { startOfToday, endOfToday } = CustomDate.getDateBoundaries();
		if (datetime >= startOfToday && datetime <= endOfToday) {
			return true;
		}
		return false;
	}

	get isYesterday() {
		const datetime = this;
		const { startOfToday, startOfYesterday } = CustomDate.getDateBoundaries();
		if (datetime >= startOfYesterday && datetime <= startOfToday) {
			return true;
		}
		return false;
	}

	format() {
		const now = new Date();
		if (this.isToday) {
			const timeDifference = now.getTime() - this.getTime();
			const seconds = Math.floor(timeDifference / 1000);
			const minutes = Math.floor(seconds / 60);
			console.log('seconds', seconds);

			if (seconds < 60) {
				return seconds <= 0 ? 'Just now' : `${seconds} seconds ago`;
			} else if (minutes < 60) {
				return `${minutes} minutes ago`;
			}
			return 'today';
		}
		if (this.isYesterday) {
			return 'yesterday';
		}
		const monthIndex = this.getMonth();
		const month = CustomDate.monthsOfTheYear[monthIndex];
		const day = `${this.getDate()}`.padStart(2, '0');
		const year = this.getFullYear();
		const hours = this.getHours();
		const minutes = this.getMinutes();
		const suffix = hours < 12 ? 'am' : 'pm';

		return `${day} ${month}, ${year} - ${hours}:${minutes} ${suffix}`;
	}
}

export type NotificationCategory = 'PAYMENT' | 'REQUEST' | 'ALERT' | 'SYSTEM';
export type NotificationStatus = 'READ' | 'UNREAD';
export type GroupedNotification = { formattedTime: string } & NotificationItem;
type GroupedNotifications = {
	earlier: GroupedNotification[];
	today: GroupedNotification[];
	yesterday: GroupedNotification[];
};

export interface NotificationItem {
	id: string;
	title: string;
	message: string;
	category: NotificationCategory;
	status: NotificationStatus;
	createdAt: string;
	metaLabel?: string;
}

@Component({
	selector: 'app-notifications',
	imports: [ChipModule, DividerModule, CardModule, NotificationListSegment],
	templateUrl: './notifications.html',
	styleUrl: './notifications.css',
})
export class NotificationsPage {
	filters = ['Payments & Verification', 'Loan Requests', 'System'];
	selectedChips = signal<string[]>([]);
	private _notifications = signal(MOCK_NOTIFICATIONS);
	notifications = computed(() => {
		const groupedNotifications: GroupedNotifications = {
			today: [],
			yesterday: [],
			earlier: [],
		};

		// get formatted time and group the notification appropriately
		this._notifications().forEach((notification) => {
			let creationTime: string | CustomDate = notification.createdAt;
			creationTime = new CustomDate(creationTime);
			const formattedTime = creationTime.format();
			const notificationWithExtras = {
				...notification,
				formattedTime,
			} as GroupedNotification;

			if (creationTime.isToday) {
				groupedNotifications.today.push(notificationWithExtras);
			} else if (creationTime.isYesterday) {
				groupedNotifications.yesterday.push(notificationWithExtras);
			} else {
				groupedNotifications.earlier.push(notificationWithExtras);
			}
		});
		return Object.entries(groupedNotifications);
	});

	handleChipSelection(filter: string) {
		this.selectedChips.update((prev) => {
			const selectedChips = [...prev];
			if (prev.includes(filter)) {
				const indexOfChip = prev.findIndex((x) => x === filter);
				selectedChips.splice(indexOfChip, 1);
				return selectedChips;
			}
			return [...prev, filter];
		});
	}

	constructor() {
		effect(() => {
			console.log(this.selectedChips());
			const datetime = new CustomDate(2026, 5, 5, 12, 4, 23);
			console.log(datetime);
			console.log(datetime.isToday);
			console.log(datetime.isYesterday);
		});
	}
}
