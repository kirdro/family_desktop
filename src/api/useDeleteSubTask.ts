// hooks/tasks/useDeleteSubTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { IParamsDeleteSubTask } from '../types';
import { HOST } from '../../host.ts';
import { deleteRequest } from '../tools/request.ts';
import { GENERAL, TASKS } from '../constants';

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

			updateNotificationStore({
				notifications: [
					...getNotificationStore().notifications,
					{
						id: Math.random().toString(36).substr(2, 9),
						message: 'delete success',
						type: 'success',
					},
				],
			});
		},

		onError: (error) => {
			// Откатываем к предыдущему состоянию в случае ошибки

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

		onSettled: () => {
			// Всегда обновляем кеш после завершения мутации
			queryClient.invalidateQueries({
				queryKey: [GENERAL, TASKS],
			});
		},
	});

	return result;
};
