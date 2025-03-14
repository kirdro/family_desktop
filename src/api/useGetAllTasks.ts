import { useQuery } from '@tanstack/react-query';
import { getRequest } from '@/tools/request';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useGeneralStore } from '@/store/useGeneralStore';
import { GENERAL, TASKS, TEAM } from '@/constants';
import { HOST } from '@/host';
import { useEffect } from 'react';

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
	const { data, isLoading, error, status, refetch } =  useQuery({
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
		enabled
	});

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

	return {
		data,
		isLoading,
		error,
		status,
		refetch,
	};
};