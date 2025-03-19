import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useGeneralStore } from '../store/useGeneralStore';
import { GENERAL, TAGS_TASK } from '../constants';
import { HOST } from '../../host';
import { getRequest } from '../tools/request';
import { useGlobalLoading } from '../hooks/useGlobalLoading';

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
								read: false,
								timestamp: String(new Date()),
								title: error.message,
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
					taskTags: [],
				});
			} else {
				updateGeneralStore({
					taskTags: data.data,
				});
			}
		}
	}, [data, updateGeneralStore, error]);
	useGlobalLoading(isLoading, 'Загрузка tasks tags данных...');
	return result;
};
