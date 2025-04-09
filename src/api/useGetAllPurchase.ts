import { useNotificationStore } from '../store/useNotificationStore';
import { useGeneralStore } from '../store/useGeneralStore';
import { GENERAL, PURCHASES } from '../constants';
import { HOST } from '../../host';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../tools/request';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useGlobalLoading } from '../hooks/useGlobalLoading';

export const useGetAllPurchase = () => {

	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token, team } = getGeneralStore();
	const queryKey = [GENERAL, PURCHASES];
	const enabled = Boolean(token) && Boolean(team);

	const getUrl = (): string => {
		return `${HOST}/purchase/all/${team?.id}`;
	};
	const result = useQuery({
		queryKey,
		queryFn: async () => {
			return await getRequest({
				url: getUrl(),
				token,
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
			});
		},
		enabled,
	});

	const { data, error, isLoading } = result;

	useEffect(() => {
		if (data) {
			if ('error' in data) {
				updateGeneralStore({
					purchases: [],
				});
			} else {
				updateGeneralStore({
					purchases: data.data,
				});
			}
		}
	}, [data, updateGeneralStore, error]);
	useGlobalLoading(isLoading, 'Загрузка tasks данных...');
	return result;
}