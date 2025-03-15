import { useMutation } from '@tanstack/react-query';
import { HOST } from '../../host';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { IVerifyTokenRes } from '../types';
import { postRequest } from '../tools/request.ts';
import { secureStorage } from '../utils/token-storage.ts';
import { EMAIL, TOKEN_STORAGE } from '../constants';

interface VerifyTokenData {
	token: string;
	email: string;
}

export const usePostVerifyToken = () => {
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/auth/verify_token`;
	};

	const result = useMutation<IVerifyTokenRes, Error, VerifyTokenData>({
		mutationFn: (data: VerifyTokenData) =>
			postRequest({
				url: getUrl(),
				data,
			}),
		onSuccess: (response) => {
			if (response.success) {
				updateNotificationStore({
					notifications: [
						...getNotificationStore().notifications,
						{
							id: Math.random().toString(36).substr(2, 9),
							message: 'Token verification successful',
							type: 'success',
						},
					],
				});
				updateGeneralStore({
					token: response.token,
					user: response.user,
				});
				secureStorage.save(TOKEN_STORAGE, response.token);
				secureStorage.save(EMAIL, response.user.email);
			} else {
				updateNotificationStore({
					notifications: [
						...getNotificationStore().notifications,
						{
							id: Math.random().toString(36).substr(2, 9),
							message: 'Token verification failed',
							type: 'error',
						},
					],
				});
				secureStorage.remove(TOKEN_STORAGE);
				secureStorage.remove(EMAIL);
			}
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
