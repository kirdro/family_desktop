// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import {
	STORE_KEYS,
	Task,
	generateInitialData,
} from '../store/tasksLocalStore';
import { useGeneralStore } from '../store/useGeneralStore';

export const useTasks = () => {
	const queryClient = useQueryClient();
	const { generalStore } = useGeneralStore();

	// Инициализация локального хранилища при первом вызове
	const initializeStore = () => {
		const existingTasks = queryClient.getQueryData<Task[]>(
			STORE_KEYS.tasks,
		);

		// Если данных нет, сгенерируем начальные данные
		if (!existingTasks) {
			const { tasks, tags } = generateInitialData(
				generalStore.user,
				generalStore.team,
			);

			// Сохраняем начальные данные в кэше React Query
			queryClient.setQueryData(STORE_KEYS.tasks, tasks);
			queryClient.setQueryData(STORE_KEYS.tags, tags);
		}
	};

	// Получение всех задач
	const fetchTasks = () => {
		// Инициализируем хранилище при необходимости
		initializeStore();

		// Возвращаем данные из кэша
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];
		return { tasks };
	};

	// Получение отдельной задачи
	const fetchTask = (id: string) => {
		// Инициализируем хранилище при необходимости
		initializeStore();

		// Находим задачу в кэше
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];
		const task = tasks.find((task) => task.id === id);

		if (!task) {
			throw new Error(`Task with id ${id} not found`);
		}

		return task;
	};

	// Создание новой задачи
	const createNewTask = (taskData: Partial<Task>) => {
		// Инициализируем хранилище при необходимости
		initializeStore();

		// Получаем текущие задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Создаем новую задачу
		const newTask: Task = {
			id: uuidv4(),
			title: taskData.title || 'Новая задача',
			description: taskData.description || '',
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			startDate: taskData.startDate,
			endDate: taskData.endDate,
			authorId: generalStore.user?.id || 'user-1',
			assignees: [],
			subTasks: [],
			comments: [],
			teamId: generalStore.team?.id || 1,
			tags: [],
			priority: taskData.priority || 'MEDIUM',
			status: taskData.status || 'TODO',
			planId: taskData.planId,
		};

		// Если указаны ID тегов, ищем их объекты
		if (taskData.tagIds && taskData.tagIds.length > 0) {
			const tags = queryClient.getQueryData(STORE_KEYS.tags) || [];
			newTask.tags = tags.filter((tag) =>
				taskData.tagIds.includes(tag.id),
			);
		}

		// Если указаны ID исполнителей, ищем их объекты
		if (taskData.assigneeIds && taskData.assigneeIds.length > 0) {
			// В реальном приложении здесь будет логика поиска пользователей
			// Для простоты, мы пока оставим массив пустым
			newTask.assignees = [];
		}

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, [...tasks, newTask]);

		return newTask;
	};

	// Обновление задачи
	const updateExistingTask = ({
		id,
		...data
	}: { id: string } & Partial<Task>) => {
		// Получаем текущие задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Находим задачу для обновления
		const taskIndex = tasks.findIndex((task) => task.id === id);

		if (taskIndex === -1) {
			throw new Error(`Task with id ${id} not found`);
		}

		// Обновляем задачу
		const updatedTask = {
			...tasks[taskIndex],
			...data,
			updatedAt: new Date().toISOString(),
		};

		// Если указаны ID тегов, ищем их объекты
		// Если указаны ID тегов, ищем их объекты
		if (data.tagIds && data.tagIds.length >= 0) {
			const tags = queryClient.getQueryData(STORE_KEYS.tags) || [];
			updatedTask.tags = tags.filter((tag) =>
				data.tagIds.includes(tag.id),
			);
		}

		// Если указаны ID исполнителей, ищем их объекты
		if (data.assigneeIds && data.assigneeIds.length >= 0) {
			// В реальном приложении здесь будет логика поиска пользователей
			const users = queryClient.getQueryData(STORE_KEYS.users) || [];
			updatedTask.assignees = users.filter((user) =>
				data.assigneeIds.includes(user.id),
			);
		}

		// Обновляем задачу в списке
		const updatedTasks = [...tasks];
		updatedTasks[taskIndex] = updatedTask;

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

		return updatedTask;
	};

	// Удаление задачи
	const removeTask = (id: string) => {
		// Получаем текущие задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Фильтруем задачи, исключая удаляемую
		const updatedTasks = tasks.filter((task) => task.id !== id);

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

		return id;
	};

	// Мутация для создания задачи
	const createTaskMutation = useMutation({
		mutationFn: createNewTask,
		onSuccess: (data) => {
			message.success('Задача успешно создана');
		},
		onError: (error: any) => {
			console.error('Error creating task:', error);
			message.error('Не удалось создать задачу');
		},
	});

	// Мутация для обновления задачи
	const updateTaskMutation = useMutation({
		mutationFn: updateExistingTask,
		onSuccess: (data) => {
			message.success('Задача успешно обновлена');
		},
		onError: (error: any) => {
			console.error('Error updating task:', error);
			message.error('Не удалось обновить задачу');
		},
	});

	// Мутация для удаления задачи
	const deleteTaskMutation = useMutation({
		mutationFn: removeTask,
		onSuccess: (id) => {
			message.success('Задача успешно удалена');
		},
		onError: (error: any) => {
			console.error('Error deleting task:', error);
			message.error('Не удалось удалить задачу');
		},
	});

	// Хук для получения списка задач
	const useTasksQuery = (options = {}) => {
		return useQuery({
			queryKey: STORE_KEYS.tasks,
			queryFn: fetchTasks,
			...options,
		});
	};

	// Хук для получения отдельной задачи
	const useTaskQuery = (id: string, options = {}) => {
		return useQuery({
			queryKey: [...STORE_KEYS.tasks, id],
			queryFn: () => fetchTask(id),
			enabled: !!id,
			...options,
		});
	};

	// Возвращаем функции и хуки для использования в компонентах
	return {
		// Функции для прямого вызова
		fetchTasks,
		getTask: fetchTask,
		createTask: createTaskMutation.mutateAsync,
		updateTask: updateTaskMutation.mutateAsync,
		deleteTask: deleteTaskMutation.mutateAsync,

		// Хуки для компонентов
		useTasks: useTasksQuery,
		useTask: useTaskQuery,

		// Состояние мутаций
		isCreating: createTaskMutation.isPending,
		isUpdating: updateTaskMutation.isPending,
		isDeleting: deleteTaskMutation.isPending,

		// Данные из текущего запроса
		data: useTasksQuery().data,
		isLoading: useTasksQuery().isLoading,
		isError: useTasksQuery().isError,
	};
};
