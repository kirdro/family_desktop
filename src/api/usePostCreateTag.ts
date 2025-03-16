import { useMutation } from '@tanstack/react-query';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { HOST } from '../../host.ts';
import { IParamsCreateTag } from '../types';
import { postRequest } from '../tools/request.ts';
import { queryClient } from '../lib/queryClient.ts';
import { GENERAL, TAGS_TASK } from '../constants';

export const useCreateTag = () => {
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/tag/create`;
	};

	const { token } = getGeneralStore();

	const { data, isPending, mutate, status, mutateAsync } = useMutation({
		mutationFn: async (data: IParamsCreateTag) => {
			return await postRequest({
				url: getUrl(),
				data,
				token,
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, TAGS_TASK] });
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
