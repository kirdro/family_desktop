import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGeneralStore } from '@/store/useGeneralStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { HOST } from '@/host';
import { IParamsCreateComment } from '@/interfaces';
import { postRequest } from '@/tools/request';
import { queryClient } from '@/lib/query';
import { GENERAL, TASKS } from '@/constants';

export const usePostCreateComment = () => {
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/comment/create`;
	};

	const { token } = getGeneralStore();

	const { data, isPending, mutate, status, mutateAsync } =  useMutation({
		mutationFn: async (data: IParamsCreateComment) => {
			return await postRequest({
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