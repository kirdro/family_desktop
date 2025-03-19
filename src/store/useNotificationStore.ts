// import { camelToSnakeCase } from 'src/settings';

import { useStore } from './useStore';
import { NotificationState } from '../types/notification';

const STORE_KEY = `NOTIFICATION_STORE_KEY`;

export const initialState = {
	notifications: [] as NotificationState['notifications'],
};

export type StoreType = typeof initialState;

export function useNotificationStore(externalState?: StoreType) {
	const {
		store: notificationStore,
		getStore: getNotificationStore,
		updateStore: updateNotificationStore,
	} = useStore<StoreType>([STORE_KEY], externalState || { ...initialState });

	return { notificationStore, getNotificationStore, updateNotificationStore };
}
