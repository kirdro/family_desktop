import { useMutation } from '@tanstack/react-query';
import { HOST } from '../../host';
import { useNotificationStore } from '../store/useNotificationStore';
import { postRequest } from '../tools/request';
import toast from 'react-hot-toast';

interface LoginData {
	email: string;
}

interface LoginResponse {
	message: string;
	// Add other response fields if needed
}

export const usePostLogin = () => {
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/auth/login`;
	};

	const result = useMutation<LoginResponse, Error, LoginData>({
		mutationFn: (data: LoginData) =>
			postRequest({
				url: getUrl(),
				data,
			}),
		onSuccess: (response) => {
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
						message: response.message,
						type: 'success',
						read: false,
						timestamp: String(new Date()),
						title: 'response.status',
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
};
