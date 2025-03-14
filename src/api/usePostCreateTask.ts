import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '@/tools/request';
import { HOST } from '@/host';
import { useNotificationStore } from '@/store/useNotificationStore';
import { IParamsCreateTask } from '@/interfaces';
import { useGeneralStore } from '@/store/useGeneralStore';
import { GENERAL, TASKS } from '@/constants';

export const usePostCreateTask = () => {
	const queryClient = useQueryClient();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();
	const { token } = getGeneralStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/create`;
	};

	const { data, isPending, mutate, status, mutateAsync } = useMutation({
		mutationFn: (data: IParamsCreateTask) => {
			return postRequest({
				url: getUrl(),
				data,
				token
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, TASKS] });
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

	return {
		data,
		isPending,
		mutate,
		status,
		mutateAsync,
	};
};
