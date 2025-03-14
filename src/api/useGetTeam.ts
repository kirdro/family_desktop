import { useQuery } from '@tanstack/react-query';
import { useGeneralStore } from '@/store/useGeneralStore';
import { GENERAL, TEAM } from '@/constants';
import { useEffect } from 'react';
import { HOST } from '@/host';
import { getRequest } from '@/tools/request';
import { ITeam } from '@/interfaces';
import { useNotificationStore } from '@/store/useNotificationStore';

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

	return {
		data,
		isLoading,
		error,
		status,
		refetch,
	};
};
