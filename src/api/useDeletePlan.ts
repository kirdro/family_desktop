import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { HOST } from '../../host';
import { useMutation } from '@tanstack/react-query';
import { deleteRequest } from '../tools/request';
import { queryClient } from '../lib/queryClient';
import { GENERAL, PLANS } from '../constants';
import toast from 'react-hot-toast';

export const useDeletePlan = () => {
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { token } = getGeneralStore();

	const result = useMutation({
		mutationFn: (planId: string) => {
			const getUrl = (): string => {
				return `${HOST}/plans/${planId}`;
			};
			return deleteRequest({
				url: getUrl(),
				token,
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, PLANS] });

			console.log('response', response);
			toast.success('Delete plan success', {
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
						message: 'Delete task success',
						type: 'success',
						read: false,
						timestamp: String(new Date()),
						title: response.status,
					},
				],
			});
		},
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

	return result;
};
