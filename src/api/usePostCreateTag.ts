import { useMutation } from '@tanstack/react-query';
import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { HOST } from '../../host';
import { IParamsCreateTag } from '../types';
import { postRequest } from '../tools/request';
import { queryClient } from '../lib/queryClient';
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
						read: false,
						timestamp: String(new Date()),
						title: response.status,
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
