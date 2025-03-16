import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { useGeneralStore } from '../store/useGeneralStore.ts';
import { GENERAL, TASK_STATS } from '../constants';
import { HOST } from '../../host.ts';
import { getRequest } from '../tools/request.ts';

export const useGetTaskStatistics = (email: string) => {
	const { getGeneralStore, updateGeneralStore } = useGeneralStore();

	const { token } = getGeneralStore();
	const queryKey = [GENERAL, TASK_STATS, email];

	const getUrl = (): string => {
		return `${HOST}/tasks/statistics/${email}`;
	};

	const enabled = Boolean(token) && Boolean(email);
	const { data, isLoading, error, status, refetch } = useQuery({
		queryKey,
		queryFn: () => {
			return getRequest({
				url: getUrl(),
				token: token,
			});
		},
		enabled,
	});

	useEffect(() => {
		if (data) {
			if ('error' in data) {
				updateGeneralStore({
					taskStats: [],
				});
			} else {
				updateGeneralStore({
					taskStats: data.data,
				});
			}
		}
	}, [data, updateGeneralStore, error]);

	return {
		data,
		isLoading,
		error,
		status,
		refetch,
	};
};
