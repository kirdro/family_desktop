import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { GENERAL, TASKS } from '../constants';
import { HOST } from '../../host.ts';
import { getRequest } from '../tools/request.ts';
import { useGlobalLoading } from '../hooks/useGlobalLoading.ts';

export const useGetAllTasks = (email: string) => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token } = getGeneralStore();
	const queryKey = [GENERAL, TASKS, email];
	const enabled = Boolean(token) && Boolean(email);

	const getUrl = (): string => {
		return `${HOST}/tasks/all/${email}`;
	};
	const result = useQuery({
		queryKey,
		queryFn: async () => {
			return await getRequest({
				url: getUrl(),
				token,
				onError: (error) => {
					updateNotificationStore({
						notifications: [
							...getNotificationStore().notifications,
							{
								id: Math.random().toString(36).substr(2, 9),
								message: error.message,
								type: 'error',
							},
						],
					});
				},
			});
		},
		enabled,
	});

	const { data, error, isLoading } = result;

	useEffect(() => {
		if (data) {
			if ('error' in data) {
				updateGeneralStore({
					tasks: [],
				});
			} else {
				updateGeneralStore({
					tasks: data.data,
				});
			}
		}
	}, [data, updateGeneralStore, error]);
	useGlobalLoading(isLoading, 'Загрузка tasks данных...');
	return result;
};
