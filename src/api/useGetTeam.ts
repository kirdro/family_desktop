import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useGeneralStore } from '../store/useGeneralStore';
import { GENERAL, TEAM } from '../constants';
import { HOST } from '../../host';
import { ITeam } from '../types';
import { getRequest } from '../tools/request';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import toast from 'react-hot-toast';

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
					toast.error(error.message, {
						style: {
							borderRadius: '10px',
							background: '#333',
							color: '#fff',
						},
					});
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
