// src/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// Типы данных (те же, что и в компоненте Dashboard)
export interface DashboardData {
	stats: {
		totalTasks: number;
		completedTasks: number;
		pendingTasks: number;
		totalTeamMembers: number;
		taskCompletion: number;
		tasksThisWeek: number;
		tasksGrowth: number;
	};
	// ...остальные интерфейсы
}

export function useDashboardData(timeRange: 'week' | 'month' | 'year') {
	return useQuery<DashboardData>({
		queryKey: ['dashboard', timeRange],
		queryFn: async () => {
			try {
				// Когда API будет готово, раскомментируйте эти строки и закомментируйте getMockDashboardData
				const response = await apiClient.get(
					`/dashboard?timeRange=${timeRange}`,
				);
				return response.data;

				// Для разработки и тестирования используем моковые данные
				// return getMockDashboardData(timeRange);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
				throw error;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 минут кеширования
	});
}
