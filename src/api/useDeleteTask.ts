import { useMutation } from '@tanstack/react-query';
import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { HOST } from '../../host';
import { IParamsDeleteTask } from '../types';
import { deleteRequest } from '../tools/request';
import { queryClient } from '../lib/queryClient';
import { GENERAL, TASKS } from '../constants';
import toast from 'react-hot-toast';

export const useDeleteTask = () => {
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { token } = getGeneralStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/delete`;
	};
	const { data, isPending, mutate, status, mutateAsync } = useMutation({
		mutationFn: (data: IParamsDeleteTask) => {
			return deleteRequest({
				url: getUrl(),
				data,
				token,
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, TASKS] });
			console.log('response', response);
			toast.success('Delete task success', {
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

	return {
		data,
		isPending,
		mutate,
		status,
		mutateAsync,
	};
};
