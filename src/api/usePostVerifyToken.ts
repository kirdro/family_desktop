import { useMutation } from '@tanstack/react-query';
import { HOST } from '../../host';
import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { IVerifyTokenRes } from '../types';
import { postRequest } from '../tools/request';
import { secureStorage } from '../utils/token-storage';
import { EMAIL, TOKEN_STORAGE } from '../constants';

interface VerifyTokenData {
	token: string;
	email: string;
}

export const usePostVerifyToken = () => {
	const { updateGeneralStore } = useGeneralStore();
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
							read: false,
							timestamp: String(new Date()),
							title: 'response.status',
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
							read: false,
							timestamp: String(new Date()),
							title: 'response.status',
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
