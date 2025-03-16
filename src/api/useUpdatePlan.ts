import { useGeneralStore } from '../store/useGeneralStore.ts';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { HOST } from '../../host.ts';
import { useMutation } from '@tanstack/react-query';
import { putRequest } from '../tools/request.ts';
import { queryClient } from '../lib/queryClient.ts';
import { GENERAL, PLANS } from '../constants';

export const useUpdatePlan = (planId: string) => {
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/plans/${planId}`;
	};

	const { token } = getGeneralStore();

	const result = useMutation({
		mutationFn: (data: unknown) => {
			return putRequest({
				url: getUrl(),
				data,
				token,
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, PLANS] });
			console.log('response', response);

			updateNotificationStore({
				notifications: [
					...getNotificationStore().notifications,
					{
						id: Math.random().toString(36).substr(2, 9),
						message: 'Code verification successful',
						type: 'success',
					},
				],
			});
		},
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

	return result;
};
