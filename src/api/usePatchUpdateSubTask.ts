import { useMutation, useQueryClient } from '@tanstack/react-query';
import {useGeneralStore} from "../store/useGeneralStore.ts";
import {useNotificationStore} from "../store/useNotificationStore.ts";
import {HOST} from "../../host.ts";
import {IParamsUpdateSubTask} from "../types";
import {patchRequest} from "../tools/request.ts";
import {queryClient} from "../lib/queryClient.ts";
import {GENERAL, TASK_STATS, TASKS} from "../constants";


export const usePatchUpdateSubTask = () => {
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/tasks/subtask/update`;
	};

	const { token } = getGeneralStore();

	const { data, isPending, mutate, status, mutateAsync } =  useMutation({
		mutationFn: (data: IParamsUpdateSubTask) => {
			return patchRequest({
				url: getUrl(),
				data,
				token
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, TASKS] });
			queryClient.invalidateQueries({ queryKey: [GENERAL, TASK_STATS] });
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