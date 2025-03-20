import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from 'axios';
import { HOST } from '../../host';
import { useGeneralStore } from '../store/useGeneralStore';
import toast from 'react-hot-toast';

interface IUploadResponse {
	url: string;
}

export const usePostUploadFile = () => {
	const { getGeneralStore } = useGeneralStore();
	const { token } = getGeneralStore();

	const getUrl = (): string => {
		return `${HOST}/s3`;
	};

	const mutationFn = async (file: File) => {
		const formData = new FormData();
		formData.append('file', file);

		const response = await axios.post(getUrl(), formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				token: token,
			},
		});

		return response.data;
	};

	const { mutate, isPending, data, status, mutateAsync } = useMutation<
		IUploadResponse,
		unknown,
		File,
		unknown
	>({
		mutationFn,
		onSuccess: () => {
			toast.success('Файл успешно загружен', {
				style: {
					borderRadius: '10px',
					background: '#333',
					color: '#fff',
				},
			});
		},
		onError: (error) => {
			const myError = error as AxiosError;
			toast.error(myError.message, {
				style: {
					borderRadius: '10px',
					background: '#333',
					color: '#fff',
				},
			});
		},
	});

	return { mutate, isPending, data, status, mutateAsync };
};
