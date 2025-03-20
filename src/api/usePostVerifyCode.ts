import { useMutation } from '@tanstack/react-query';

import { HOST } from '../../host';
import { useGeneralStore } from '../store/useGeneralStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { IVerifyTokenRes } from '../types';
import { postRequest } from '../tools/request';
import { secureStorage } from '../utils/token-storage';
import { EMAIL, TOKEN_STORAGE } from '../constants';
import toast from 'react-hot-toast';

// filepath: /home/kirill/projects/family_expo/hooks/api/usePostVerifyCode.ts

interface VerifyCodeData {
	email: string;
	code: string;
}

export const usePostVerifyCode = () => {
	const { updateGeneralStore } = useGeneralStore();
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
