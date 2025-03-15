import { useMutation } from '@tanstack/react-query';

import { HOST } from '../../host';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { useNotificationStore } from '../store/useNotificationStore.ts';
import { IVerifyTokenRes } from '../types';
import { postRequest } from '../tools/request.ts';
import { secureStorage } from '../utils/token-storage.ts';
import { EMAIL, TOKEN_STORAGE } from '../constants';

// filepath: /home/kirill/projects/family_expo/hooks/api/usePostVerifyCode.ts

interface VerifyCodeData {
	email: string;
	code: string;
}

interface VerifyCodeResponse {
	success: boolean;
	// Add other response fields if needed
}

export const usePostVerifyCode = () => {
	const { updateGeneralStore, getGeneralStore } = useGeneralStore();
	const { updateNotificationStore, getNotificationStore } =
		useNotificationStore();

	const getUrl = (): string => {
		return `${HOST}/auth/verify`;
	};

	const result = useMutation<IVerifyTokenRes, Error, VerifyCodeData>({
		mutationFn: (data: VerifyCodeData) =>
			postRequest({
				url: getUrl(),
				data,
			}),
		onSuccess: (response) => {
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
			updateGeneralStore({
				token: response.token,
				user: response.user,
			});
			secureStorage.save(TOKEN_STORAGE, response.token);
			secureStorage.save(EMAIL, response.user.email);
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
