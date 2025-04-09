import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '../store/useNotificationStore';
import { useGeneralStore } from '../store/useGeneralStore';
import { HOST } from '../../host';
import { IParamsCreateSalary } from '../types';
import { postRequest } from '../tools/request';
import { GENERAL, SALARY, TASKS } from '../constants';
import toast from 'react-hot-toast';

export const useCreateSalary = () => {
	const queryClient = useQueryClient();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();
	const { getGeneralStore } = useGeneralStore();
	const { token } = getGeneralStore();

	const getUrl = (): string => {
		return `${HOST}/salary-plan`;
	};

	const result = useMutation({
		mutationFn: (data: IParamsCreateSalary) => {
			return postRequest({
				url: getUrl(),
				data,
				token,
			});
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: [GENERAL, SALARY] });
			toast.success('Code verification successful', {
				style: {
					borderRadius: '10px',
					background: '#333',
					color: '#fff',
				},
			});
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
			toast.error(error.message, {
				style: {
					borderRadius: '10px',
					background: '#333',
					color: '#fff',
				},
			});
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
}