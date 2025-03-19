// src/hooks/useGlobalLoading.ts
import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

/**
 * Хук для автоматического управления глобальным спиннером
 * @param isLoading Состояние загрузки
 * @param message Сообщение, отображаемое во время загрузки
 */
export const useGlobalLoading = (isLoading: boolean, message?: string) => {
	const { showLoading, hideLoading } = useLoading();

	useEffect(() => {
		if (isLoading) {
			showLoading(message);
		} else {
			hideLoading();
		}

		// Скрываем спиннер при размонтировании компонента
		return () => {
			hideLoading();
		};
	}, [isLoading, message, showLoading, hideLoading]);
};
