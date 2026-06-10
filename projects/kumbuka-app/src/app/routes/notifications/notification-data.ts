import { NotificationItem } from './notifications.page';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
	{
		id: 'notif_01',
		title: 'New Payment!',
		message: 'Sarah Wanjiru logged a repayment of 5,000 KES.',
		category: 'PAYMENT',
		status: 'UNREAD',
		// Set to 2 minutes ago relative to current context (June 4, 2026, 09:50 AM)
		createdAt: '2026-06-04T14:34:36.572Z',
	},
	{
		id: 'notif_02',
		title: 'Request Accepted',
		message: 'John Njau accepted your lending agreement for 12,000 KES.',
		category: 'REQUEST',
		status: 'READ',
		// Set to Yesterday at 4:30 PM
		createdAt: '2026-06-03T16:30:00Z',
	},
	{
		id: 'notif_03',
		title: 'Overdue Alert',
		message: 'Marcus Holloway has missed the agreed repayment date by 3 days.',
		category: 'ALERT',
		status: 'READ',
		// Set to Yesterday at 9:00 AM
		createdAt: '2026-06-03T09:00:00Z',
		metaLabel: 'Watchdog System Notification',
	},
	{
		id: 'notif_04',
		title: 'KYC Verified',
		message: 'Your profile verification is complete. You can now request higher loan limits.',
		category: 'SYSTEM',
		status: 'READ',
		// Set to May 28, 2026, 11:20 AM (Earlier bucket)
		createdAt: '2026-05-28T11:20:00Z',
	},
];
