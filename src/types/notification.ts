export type NotificationType = 'success' | 'error' | 'info';

export type Notification = {
	id: string;
	message: string;
	type: NotificationType;
	duration?: number;
	read: boolean;
	timestamp: string;
	title: string;
};

export type NotificationState = {
	notifications: Notification[];
};
