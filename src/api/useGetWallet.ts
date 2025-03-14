import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../../tools/request';
import { HOST } from '../../host';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useGeneralStore } from '@/store/useGeneralStore';
import { GENERAL, WALLET } from '@/constants';
import { useEffect } from 'react';
import { IWallet } from '@/interfaces';

export const useGetWallet = (email: string) => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token } = getGeneralStore();
	const queryKey = [GENERAL, WALLET, email];

	const getUrl = (): string => {
		return `${HOST}/many/get_many/${email}`;
	};
	const enabled = Boolean(token) && Boolean(email);
	const { data, isLoading, error, status, refetch } = useQuery<
		IWallet,
		Error
	>({
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
					wallet: null,
				});
			} else {
				updateGeneralStore({
					wallet: data,
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
