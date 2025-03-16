import { useMutation } from '@tanstack/react-query';
import { HOST } from '../../host';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { postRequest } from '../tools/request.ts';

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
			updateNotificationStore({
				notifications: [
					...getNotificationStore().notifications,
					{
						id: Math.random().toString(36).substr(2, 9),
						message: response.message,
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

	return result;
};
