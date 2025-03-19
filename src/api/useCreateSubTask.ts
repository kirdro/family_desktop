import { useMutation } from '@tanstack/react-query';
import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { IParamsCreateSubTask } from '../types';
import { postRequest } from '../tools/request';
import { queryClient } from '../lib/queryClient';
import { GENERAL, TASKS } from '../constants';
import { HOST } from '../../host';

export const usePostCreateSubTask = () => {
	const { getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/subtask/create`;
	};

	const { token } = getGeneralStore();
	const result = useMutation({
		mutationFn: (data: IParamsCreateSubTask) => {
			return postRequest({
				url: getUrl(),
				data,
				token,
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

	return result;
};
