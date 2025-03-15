// src/hooks/useSubTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { STORE_KEYS, SubTask, Task } from '../store/tasksLocalStore';
import { useGeneralStore } from '../store/useGeneralStore';

export const useSubTasks = () => {
	const queryClient = useQueryClient();
	const { generalStore } = useGeneralStore();

	// Получение подзадач для конкретной задачи
	const fetchSubTasks = (taskId: string) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Находим нужную задачу
		const task = tasks.find((task) => task.id === taskId);

		if (!task) {
			return [];
		}

		return task.subTasks;
	};

	// Получение отдельной подзадачи
	const fetchSubTask = (subTaskId: string) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем подзадачу во всех задачах
		for (const task of tasks) {
			const subTask = task.subTasks.find(
				(subTask) => subTask.id === subTaskId,
			);
			if (subTask) {
				return subTask;
			}
		}

		throw new Error(`SubTask with id ${subTaskId} not found`);
	};

	// Создание новой подзадачи
	const createNewSubTask = (
		subTaskData: { taskId: string } & Partial<SubTask>,
	) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Находим задачу, к которой нужно добавить подзадачу
		const taskIndex = tasks.findIndex(
			(task) => task.id === subTaskData.taskId,
		);

		if (taskIndex === -1) {
			throw new Error(`Task with id ${subTaskData.taskId} not found`);
		}

		// Создаем новую подзадачу
		const newSubTask: SubTask = {
			id: uuidv4(),
			title: subTaskData.title || 'Новая подзадача',
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			startDate: subTaskData.startDate,
			endDate: subTaskData.endDate,
			description: subTaskData.description || '',
			taskId: subTaskData.taskId,
			authorId: generalStore.user?.id || 'user-1',
			assignees: [],
			comments: [],
			tags: [],
			priority: subTaskData.priority || 'MEDIUM',
			status: subTaskData.status || 'TODO',
		};

		// Если указаны ID тегов, ищем их объекты
		if (subTaskData.tagIds && subTaskData.tagIds.length > 0) {
			const tags = queryClient.getQueryData(STORE_KEYS.tags) || [];
			newSubTask.tags = tags.filter((tag) =>
				subTaskData.tagIds.includes(tag.id),
			);
		}

		// Если указаны ID исполнителей, ищем их объекты
		if (subTaskData.assigneeIds && subTaskData.assigneeIds.length > 0) {
			// В реальном приложении здесь будет логика поиска пользователей
			const users = queryClient.getQueryData(STORE_KEYS.users) || [];
			newSubTask.assignees = users.filter((user) =>
				subTaskData.assigneeIds.includes(user.id),
			);
		}

		// Добавляем подзадачу к задаче
		const updatedTasks = [...tasks];
		updatedTasks[taskIndex].subTasks.push(newSubTask);

		// Обновляем время изменения родительской задачи
		updatedTasks[taskIndex].updatedAt = new Date().toISOString();

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

		return newSubTask;
	};

	// Обновление подзадачи
	const updateExistingSubTask = ({
		id,
		...data
	}: { id: string } & Partial<SubTask>) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем подзадачу во всех задачах
		for (let i = 0; i < tasks.length; i++) {
			const subTaskIndex = tasks[i].subTasks.findIndex(
				(subTask) => subTask.id === id,
			);

			if (subTaskIndex !== -1) {
				// Обновляем подзадачу
				const updatedSubTask = {
					...tasks[i].subTasks[subTaskIndex],
					...data,
					updatedAt: new Date().toISOString(),
				};

				// Если указаны ID тегов, ищем их объекты
				if (data.tagIds && data.tagIds.length >= 0) {
					const tags =
						queryClient.getQueryData(STORE_KEYS.tags) || [];
					updatedSubTask.tags = tags.filter((tag) =>
						data.tagIds.includes(tag.id),
					);
				}

				// Если указаны ID исполнителей, ищем их объекты
				if (data.assigneeIds && data.assigneeIds.length >= 0) {
					// В реальном приложении здесь будет логика поиска пользователей
					const users =
						queryClient.getQueryData(STORE_KEYS.users) || [];
					updatedSubTask.assignees = users.filter((user) =>
						data.assigneeIds.includes(user.id),
					);
				}

				// Обновляем подзадачу в списке
				const updatedTasks = [...tasks];
				updatedTasks[i].subTasks[subTaskIndex] = updatedSubTask;

				// Обновляем время изменения родительской задачи
				updatedTasks[i].updatedAt = new Date().toISOString();

				// Сохраняем обновленные задачи в кэше
				queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

				return updatedSubTask;
			}
		}

		throw new Error(`SubTask with id ${id} not found`);
	};

	// Удаление подзадачи
	const removeSubTask = (id: string) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем подзадачу во всех задачах
		for (let i = 0; i < tasks.length; i++) {
			const subTaskIndex = tasks[i].subTasks.findIndex(
				(subTask) => subTask.id === id,
			);

			if (subTaskIndex !== -1) {
				// Удаляем подзадачу из списка
				const updatedTasks = [...tasks];
				updatedTasks[i].subTasks.splice(subTaskIndex, 1);

				// Обновляем время изменения родительской задачи
				updatedTasks[i].updatedAt = new Date().toISOString();

				// Сохраняем обновленные задачи в кэше
				queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

				return id;
			}
		}

		throw new Error(`SubTask with id ${id} not found`);
	};

	// Переключение состояния выполнения подзадачи
	const toggleCompletion = (id: string, completed: boolean) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем подзадачу во всех задачах
		for (let i = 0; i < tasks.length; i++) {
			const subTaskIndex = tasks[i].subTasks.findIndex(
				(subTask) => subTask.id === id,
			);

			if (subTaskIndex !== -1) {
				// Обновляем состояние выполнения подзадачи
				const updatedTasks = [...tasks];
				updatedTasks[i].subTasks[subTaskIndex].completed = completed;
				updatedTasks[i].subTasks[subTaskIndex].completedAt =
					completed ? new Date().toISOString() : undefined;
				updatedTasks[i].subTasks[subTaskIndex].updatedAt =
					new Date().toISOString();

				// Обновляем время изменения родительской задачи
				updatedTasks[i].updatedAt = new Date().toISOString();

				// Сохраняем обновленные задачи в кэше
				queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

				return updatedTasks[i].subTasks[subTaskIndex];
			}
		}

		throw new Error(`SubTask with id ${id} not found`);
	};

	// Мутация для создания подзадачи
	const createSubTaskMutation = useMutation({
		mutationFn: createNewSubTask,
		onSuccess: (data) => {
			message.success('Подзадача успешно создана');
		},
		onError: (error: any) => {
			console.error('Error creating subtask:', error);
			message.error('Не удалось создать подзадачу');
		},
	});

	// Мутация для обновления подзадачи
	const updateSubTaskMutation = useMutation({
		mutationFn: updateExistingSubTask,
		onSuccess: (data) => {
			message.success('Подзадача успешно обновлена');
		},
		onError: (error: any) => {
			console.error('Error updating subtask:', error);
			message.error('Не удалось обновить подзадачу');
		},
	});

	// Мутация для удаления подзадачи
	const deleteSubTaskMutation = useMutation({
		mutationFn: removeSubTask,
		onSuccess: (id) => {
			message.success('Подзадача успешно удалена');
		},
		onError: (error: any) => {
			console.error('Error deleting subtask:', error);
			message.error('Не удалось удалить подзадачу');
		},
	});

	// Мутация для переключения выполнения подзадачи
	const toggleCompletionMutation = useMutation({
		mutationFn: toggleCompletion,
		onSuccess: (data) => {
			const status = data.completed ? 'завершена' : 'возобновлена';
			message.success(`Подзадача ${status}`);
		},
		onError: (error: any) => {
			console.error('Error toggling subtask completion:', error);
			message.error('Не удалось изменить статус подзадачи');
		},
	});

	// Хук для получения списка подзадач
	const useSubTasksQuery = (taskId: string, options = {}) => {
		return useQuery({
			queryKey: [...STORE_KEYS.tasks, taskId, 'subtasks'],
			queryFn: () => fetchSubTasks(taskId),
			enabled: !!taskId,
			...options,
		});
	};

	// Хук для получения отдельной подзадачи
	const useSubTaskQuery = (id: string, options = {}) => {
		return useQuery({
			queryKey: [...STORE_KEYS.tasks, 'subtask', id],
			queryFn: () => fetchSubTask(id),
			enabled: !!id,
			...options,
		});
	};

	// Возвращаем функции и хуки для использования в компонентах
	return {
		// Функции для прямого вызова
		getSubTasks: fetchSubTasks,
		getSubTask: fetchSubTask,
		createSubTask: createSubTaskMutation.mutateAsync,
		updateSubTask: updateSubTaskMutation.mutateAsync,
		deleteSubTask: deleteSubTaskMutation.mutateAsync,
		toggleSubTaskCompletion: toggleCompletionMutation.mutateAsync,

		// Хуки для компонентов
		useSubTasks: useSubTasksQuery,
		useSubTask: useSubTaskQuery,

		// Состояние мутаций
		isCreating: createSubTaskMutation.isPending,
		isUpdating: updateSubTaskMutation.isPending,
		isDeleting: deleteSubTaskMutation.isPending,
		isTogglingCompletion: toggleCompletionMutation.isPending,
	};
};
