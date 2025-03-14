import { useQuery } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useGeneralStore } from '@/store/useGeneralStore';
import { GENERAL, TAGS_TASK, TEAM } from '@/constants';
import { HOST } from '@/host';
import { getRequest } from '@/tools/request';
import { useEffect } from 'react';

export const useGetTeamTags = (email: string) => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token } = getGeneralStore();
	const queryKey = [GENERAL, TAGS_TASK, email];

	const getUrl = (): string => {
		return `${HOST}/tasks/tags/${email}`;
	};

	const enabled = Boolean(token) && Boolean(email);

	const { data, isLoading, error, status, refetch } = useQuery({
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
					taskTags: [],
				});
			} else {
				updateGeneralStore({
					taskTags: data.data,
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