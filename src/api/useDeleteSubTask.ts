// hooks/tasks/useDeleteSubTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IParamsDeleteSubTask, IDeleteSubTaskResponse } from '@/interfaces';
import { deleteRequest } from '@/tools/request';
import { GENERAL, SUB_TASKS, TASKS } from '@/constants';
import { useGeneralStore } from '@/store/useGeneralStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { HOST } from '@/host';


export const useDeleteSubTask = () => {
	const queryClient = useQueryClient();
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { token } = getGeneralStore();
	const getUrl = (): string => {
		return `${HOST}/tasks/subtask/delete`;
	};
	const { data, isPending, mutate, status, mutateAsync } =  useMutation({
		mutationFn: ({ subTaskId, email }:IParamsDeleteSubTask) => {

			return  deleteRequest({
				url: getUrl(),
				data: { subTaskId, email },
				token
			});
		},



		onSuccess: (response, variables) => {
			queryClient.invalidateQueries({
				queryKey: [GENERAL, TASKS]
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

		onError: (error, variables, context) => {
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
				queryKey: [GENERAL, TASKS]
			});
		}
	});


	return {
		data,
		isPending,
		mutate,
		status,
		mutateAsync,
	};
};