// hooks/tasks/useDeleteSubTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { IParamsDeleteSubTask } from '../types';
import { HOST } from '../../host';
import { deleteRequest } from '../tools/request';
import { GENERAL, TASKS } from '../constants';
import toast from 'react-hot-toast';

export const useDeleteSubTask = () => {
	const queryClient = useQueryClient();
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { token } = getGeneralStore();
	const getUrl = (): string => {
		return `${HOST}/tasks/subtask/delete`;
	};
	const result = useMutation({
		mutationFn: ({ subTaskId, email }: IParamsDeleteSubTask) => {
			return deleteRequest({
				url: getUrl(),
				data: { subTaskId, email },
				token,
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [GENERAL, TASKS],
			});
			toast.success('delete success', {
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
						message: 'delete success',
						type: 'success',
						read: false,
						timestamp: String(new Date()),
						title: '',
					},
				],
			});
		},

		onError: (error) => {
			// Откатываем к предыдущему состоянию в случае ошибки
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

		onSettled: () => {
			// Всегда обновляем кеш после завершения мутации
			queryClient.invalidateQueries({
				queryKey: [GENERAL, TASKS],
			});
		},
	});

	return result;
};
