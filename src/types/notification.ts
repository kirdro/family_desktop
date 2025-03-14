export type NotificationType = 'success' | 'error' | 'info';

export type Notification = {
	id: string;
	message: string;
	type: NotificationType;
	duration?: number;
};

export type NotificationState = {
	notifications: Notification[];
};
