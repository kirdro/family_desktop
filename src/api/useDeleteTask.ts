import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGeneralStore } from '@/store/useGeneralStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { IParamsDeleteTask } from '@/interfaces';
import { deleteRequest } from '@/tools/request';
import { queryClient } from '@/lib/query';
import { GENERAL, TASKS } from '@/constants';
import { HOST } from '@/host';

export const useDeleteTask = () => {
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { token } = getGeneralStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/delete`;
	};
	const { data, isPending, mutate, status, mutateAsync } =  useMutation({
		mutationFn: (data: IParamsDeleteTask) => {
			return deleteRequest({
				url: getUrl(),
				data,
				token
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, TASKS] });
			console.log('response', response);

			updateNotificationStore({
				notifications: [
					...getNotificationStore().notifications,
					{
						id: Math.random().toString(36).substr(2, 9),
						message: 'Delete task success',
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

	return {
		data,
		isPending,
		mutate,
		status,
		mutateAsync,
	};
};