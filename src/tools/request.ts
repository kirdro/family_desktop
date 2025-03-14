import { getHeaders } from './getHeaders';
import axios, { AxiosError } from 'axios';
import {IRequestArgs} from "../types";

/**
 * Get запрос.
 * @param args Аргументы для запроса на сервер.
 */
export const getRequest = async (args: IRequestArgs) => {
	const { url, token } = args;

	const headers = getHeaders(token || '', 'app/client');

	try {
		const response = await axios({
			method: 'get',
			url,
			headers,
			responseType: 'json',
		});

		return response.data;
	} catch (error) {
		const myError = error as AxiosError;
		if (args.onError) {
			args.onError(myError);
		}

		await Promise.reject(new Error(myError.message));
	}
};

/**
 * Post запрос.
 * @param args Аргументы для запроса на сервер.
 */
export const postRequest = async (args: IRequestArgs) => {
	const { url, token, data, responseType = 'json' } = args;
	if (!data) return;

	// try {
	const headers = getHeaders(token || '', 'app/client');
	const response = await axios({
		method: 'POST',
		url,
		responseType,
		data,
		headers,
		// headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" },
	});

	return response.data;
	// } catch (error) {}
};

/**
 * PATCH запрос.
 * @param args Аргументы для запроса на сервер.
 */
export const patchRequest = async (args: IRequestArgs) => {
	const { url, token, data, responseType = 'json' } = args;
	if (!data) return;

	try {
		const headers = getHeaders(token || '');
		const response = await axios({
			method: 'PATCH',
			url,
			responseType,
			data,
			headers,
		});

		return response.data;
	} catch (error) {
		return error;
	}
};

/**
 * DELETE запрос.
 * @param args Аргументы для запроса на сервер
 */
export const deleteRequest = async (args: IRequestArgs) => {
	const { url, token, data } = args;

	try {
		const headers = getHeaders(token || '');
		const response = await axios({ method: 'DELETE', url, headers, data });

		return response.data;
	} catch (error) {}
};

/**
 * Получение изображения из локального файла.
 *
 * @param url Локальная Blob ссылка на картинку.
 */
export const getLocalBlobImage = async (url: string) => {
	try {
		const response = await axios({
			method: 'get',
			url,
			responseType: 'blob',
			headers: getHeaders(),
		});
		return response.data;
	} catch (error) {}
};

/**
 * Получение изображения из локального файла.
 *
 * @param url Локальная Blob ссылка на картинку.
 */
// export const getLocalBase64Image = async (url: string, type?: string) => {
//     try {
//         let result;
//         await axios({
//             method: 'get',
//             url,
//             responseType: 'blob',
//             headers: getHeaders(),
//         })
//             .then((response) => {
//                 return new File([response.data], `${response.data.type.replace(`${type || 'image'}/`, '')}`, {
//                     type: response.data.type,
//                 });
//             })
//             .then(async (file) => {
//                 result = await convertBase64(file);
//             });
//         return result;
//     } catch (error) {
//         handleError(error as AxiosError);
//     }
// };
