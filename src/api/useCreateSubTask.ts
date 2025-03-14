import { useMutation } from '@tanstack/react-query';
import {useGeneralStore} from "../store/useGeneralStore.ts";
import {useNotificationStore} from "../store/useNotificationStore.ts";
import {IParamsCreateSubTask} from "../types";
import {postRequest} from "../tools/request.ts";
import {queryClient} from "../lib/queryClient.ts";


export const usePostCreateSubTask = () => {
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/subtask/create`;
	};

	const { token } = getGeneralStore();
	const { data, isPending, mutate, status, mutateAsync } =  useMutation({
		mutationFn: (data: IParamsCreateSubTask) => {
			return postRequest({
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