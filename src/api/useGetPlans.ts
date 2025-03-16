import { useNotificationStore } from '../store/useNotificationStore.ts';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { GENERAL, PLANS } from '../constants';
import { HOST } from '../../host.ts';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../tools/request.ts';
import { useEffect } from 'react';
import { useGlobalLoading } from '../hooks/useGlobalLoading.ts';

export const useGetPlans = (email: string | null) => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token } = getGeneralStore();
	const queryKey = [GENERAL, PLANS, email];
	const enabled = Boolean(token) && Boolean(email);

	const getUrl = (): string => {
		return `${HOST}/plans?email=${email}`;
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
					plans: [],
				});
			} else {
				updateGeneralStore({
					plans: data.data,
				});
			}
		}
	}, [data, updateGeneralStore, error]);
	useGlobalLoading(isLoading, 'Загрузка plans данных...');
	return result;
};
