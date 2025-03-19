import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useGeneralStore } from '../store/useGeneralStore';
import { HOST } from '../../host';
import { getRequest } from '../tools/request';

export const useGetTaskDetails = (taskId: string) => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();
	const { token } = getGeneralStore();

	const enabled = Boolean(token) && Boolean(taskId);
	const getUrl = (): string => {
		return `${HOST}/tasks/detail_task/${taskId}`;
	};

	const { data, isLoading, error, status, refetch } = useQuery({
		queryKey: ['task', taskId],
		queryFn: async () => {
			return await getRequest({
				url: getUrl(),
				token: token,
				onError: (error) => {
					updateNotificationStore({
						notifications: [
							...getNotificationStore().notifications,
							{
								id: Math.random().toString(36).substr(2, 9),
								message: error.message,
								type: 'error',
								read: false,
								timestamp: String(new Date()),
								title: error.message,
							},
						],
					});
				},
			});
		},
		enabled: enabled,
	});

	useEffect(() => {
		if (data) {
			// if ('error' in data) {
			// 	updateGeneralStore({
			// 		team: null,
			// 	});
			// } else {
			// 	updateGeneralStore({
			// 		team: data,
			// 	});
			// }
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
