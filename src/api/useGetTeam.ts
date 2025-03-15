import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { GENERAL, TEAM } from '../constants';
import { HOST } from '../../host.ts';
import { ITeam } from '../types';
import { getRequest } from '../tools/request.ts';
import { useGlobalLoading } from '../hooks/useGlobalLoading.ts';

export const useGetTeam = (email: string) => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token } = getGeneralStore();
	const queryKey = [GENERAL, TEAM, email];

	const getUrl = (): string => {
		return `${HOST}/team/${email}`;
	};

	const enabled = Boolean(token) && Boolean(email);
	const { data, isLoading, error, status, refetch } = useQuery<ITeam, Error>({
		queryKey: queryKey,
		queryFn: () =>
			getRequest({
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
							},
						],
					});
				},
			}),
		enabled: enabled,
	});

	useEffect(() => {
		if (data) {
			if ('error' in data) {
				updateGeneralStore({
					team: null,
				});
			} else {
				updateGeneralStore({
					team: data,
				});
			}
		}
	}, [data, updateGeneralStore, error]);
	useGlobalLoading(isLoading, 'Загрузка team данных...');
	return {
		data,
		isLoading,
		error,
		status,
		refetch,
	};
};
