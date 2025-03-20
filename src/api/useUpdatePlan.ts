import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { HOST } from '../../host';
import { useMutation } from '@tanstack/react-query';
import { putRequest } from '../tools/request';
import { queryClient } from '../lib/queryClient';
import { GENERAL, PLANS } from '../constants';
import toast from 'react-hot-toast';
import { IReqUpdatePlan } from '../types/planning';

export const useUpdatePlan = (planId: string) => {
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/plans/${planId}`;
	};

	const { token } = getGeneralStore();

	const result = useMutation({
		mutationFn: (data: IReqUpdatePlan) => {
			return putRequest({
				url: getUrl(),
				data,
				token,
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, PLANS] });
			console.log('response', response);
			toast.success('Code verification successful', {
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
						message: 'Code verification successful',
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
