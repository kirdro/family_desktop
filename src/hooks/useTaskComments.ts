// src/hooks/useTaskComments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { STORE_KEYS, Comment, Task } from '../store/tasksLocalStore';
import { useGeneralStore } from '../store/useGeneralStore';

export const useTaskComments = () => {
	const queryClient = useQueryClient();
	const { generalStore } = useGeneralStore();

	// Получение комментариев для задачи или подзадачи
	const fetchComments = (taskId: string, subTaskId?: string) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Находим нужную задачу
		const task = tasks.find((task) => task.id === taskId);

		if (!task) {
			return [];
		}

		if (subTaskId) {
			// Ищем подзадачу
			const subTask = task.subTasks.find(
				(subTask) => subTask.id === subTaskId,
			);
			return subTask ? subTask.comments : [];
		} else {
			return task.comments;
		}
	};

	// Получение отдельного комментария
	// Получение отдельного комментария
	const fetchComment = (commentId: string) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем комментарий во всех задачах и подзадачах
		for (const task of tasks) {
			// Ищем в комментариях задачи
			const taskComment = task.comments.find(
				(comment) => comment.id === commentId,
			);
			if (taskComment) {
				return taskComment;
			}

			// Ищем в комментариях подзадач
			for (const subTask of task.subTasks) {
				const subTaskComment = subTask.comments.find(
					(comment) => comment.id === commentId,
				);
				if (subTaskComment) {
					return subTaskComment;
				}
			}
		}

		throw new Error(`Comment with id ${commentId} not found`);
	};

	// Создание нового комментария
	const createNewComment = (commentData: {
		taskId: string;
		subTaskId?: string;
		text: string;
	}) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Находим задачу, к которой нужно добавить комментарий
		const taskIndex = tasks.findIndex(
			(task) => task.id === commentData.taskId,
		);

		if (taskIndex === -1) {
			throw new Error(`Task with id ${commentData.taskId} not found`);
		}

		// Текущий пользователь
		const currentUser = generalStore.user || {
			id: 'user-1',
			name: 'Текущий пользователь',
			email: 'user@example.com',
			role: 'admin',
		};

		// Создаем новый комментарий
		const newComment: Comment = {
			id: uuidv4(),
			text: commentData.text,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			authorId: currentUser.id,
			author: currentUser,
			taskId: commentData.taskId,
			subTaskId: commentData.subTaskId,
			replies: [],
		};

		// Обновляем список задач
		const updatedTasks = [...tasks];

		if (commentData.subTaskId) {
			// Ищем подзадачу
			const subTaskIndex = updatedTasks[taskIndex].subTasks.findIndex(
				(subTask) => subTask.id === commentData.subTaskId,
			);

			if (subTaskIndex === -1) {
				throw new Error(
					`SubTask with id ${commentData.subTaskId} not found`,
				);
			}

			// Добавляем комментарий к подзадаче
			updatedTasks[taskIndex].subTasks[subTaskIndex].comments.push(
				newComment,
			);
		} else {
			// Добавляем комментарий к задаче
			updatedTasks[taskIndex].comments.push(newComment);
		}

		// Обновляем время изменения задачи
		updatedTasks[taskIndex].updatedAt = new Date().toISOString();

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

		return newComment;
	};

	// Обновление комментария
	const updateExistingComment = ({
		id,
		text,
	}: {
		id: string;
		text: string;
	}) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем комментарий во всех задачах и подзадачах
		for (let i = 0; i < tasks.length; i++) {
			// Ищем в комментариях задачи
			const taskCommentIndex = tasks[i].comments.findIndex(
				(comment) => comment.id === id,
			);
			if (taskCommentIndex !== -1) {
				// Обновляем комментарий
				const updatedTasks = [...tasks];
				updatedTasks[i].comments[taskCommentIndex] = {
					...updatedTasks[i].comments[taskCommentIndex],
					text,
					updatedAt: new Date().toISOString(),
				};

				// Обновляем время изменения задачи
				updatedTasks[i].updatedAt = new Date().toISOString();

				// Сохраняем обновленные задачи в кэше
				queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

				return updatedTasks[i].comments[taskCommentIndex];
			}

			// Ищем в комментариях подзадач
			for (let j = 0; j < tasks[i].subTasks.length; j++) {
				const subTaskCommentIndex = tasks[i].subTasks[
					j
				].comments.findIndex((comment) => comment.id === id);
				if (subTaskCommentIndex !== -1) {
					// Обновляем комментарий
					const updatedTasks = [...tasks];
					updatedTasks[i].subTasks[j].comments[subTaskCommentIndex] =
						{
							...updatedTasks[i].subTasks[j].comments[
								subTaskCommentIndex
							],
							text,
							updatedAt: new Date().toISOString(),
						};

					// Обновляем время изменения задачи
					updatedTasks[i].updatedAt = new Date().toISOString();

					// Сохраняем обновленные задачи в кэше
					queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

					return updatedTasks[i].subTasks[j].comments[
						subTaskCommentIndex
					];
				}
			}
		}

		throw new Error(`Comment with id ${id} not found`);
	};

	// Удаление комментария
	const removeComment = (id: string) => {
		// Получаем все задачи
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		// Ищем комментарий во всех задачах и подзадачах
		for (let i = 0; i < tasks.length; i++) {
			// Ищем в комментариях задачи
			const taskCommentIndex = tasks[i].comments.findIndex(
				(comment) => comment.id === id,
			);
			if (taskCommentIndex !== -1) {
				// Удаляем комментарий
				const updatedTasks = [...tasks];
				updatedTasks[i].comments.splice(taskCommentIndex, 1);

				// Обновляем время изменения задачи
				updatedTasks[i].updatedAt = new Date().toISOString();

				// Сохраняем обновленные задачи в кэше
				queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

				return id;
			}

			// Ищем в комментариях подзадач
			for (let j = 0; j < tasks[i].subTasks.length; j++) {
				const subTaskCommentIndex = tasks[i].subTasks[
					j
				].comments.findIndex((comment) => comment.id === id);
				if (subTaskCommentIndex !== -1) {
					// Удаляем комментарий
					const updatedTasks = [...tasks];
					updatedTasks[i].subTasks[j].comments.splice(
						subTaskCommentIndex,
						1,
					);

					// Обновляем время изменения задачи
					updatedTasks[i].updatedAt = new Date().toISOString();

					// Сохраняем обновленные задачи в кэше
					queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);

					return id;
				}
			}
		}

		throw new Error(`Comment with id ${id} not found`);
	};

	// Мутация для создания комментария
	const createCommentMutation = useMutation({
		mutationFn: createNewComment,
		onSuccess: (data) => {
			message.success('Комментарий добавлен');
		},
		onError: (error: any) => {
			console.error('Error creating comment:', error);
			message.error('Не удалось добавить комментарий');
		},
	});

	// Мутация для обновления комментария
	const updateCommentMutation = useMutation({
		mutationFn: updateExistingComment,
		onSuccess: (data) => {
			message.success('Комментарий обновлен');
		},
		onError: (error: any) => {
			console.error('Error updating comment:', error);
			message.error('Не удалось обновить комментарий');
		},
	});

	// Мутация для удаления комментария
	const deleteCommentMutation = useMutation({
		mutationFn: removeComment,
		onSuccess: (id) => {
			message.success('Комментарий удален');
		},
		onError: (error: any) => {
			console.error('Error deleting comment:', error);
			message.error('Не удалось удалить комментарий');
		},
	});

	// Хук для получения списка комментариев
	const useCommentsQuery = (
		taskId: string,
		subTaskId?: string,
		options = {},
	) => {
		return useQuery({
			queryKey:
				subTaskId ?
					[
						...STORE_KEYS.tasks,
						taskId,
						'subtasks',
						subTaskId,
						'comments',
					]
				:	[...STORE_KEYS.tasks, taskId, 'comments'],
			queryFn: () => fetchComments(taskId, subTaskId),
			enabled: !!taskId,
			...options,
		});
	};

	// Хук для получения отдельного комментария
	const useCommentQuery = (id: string, options = {}) => {
		return useQuery({
			queryKey: [...STORE_KEYS.comments, id],
			queryFn: () => fetchComment(id),
			enabled: !!id,
			...options,
		});
	};

	// Возвращаем функции и хуки для использования в компонентах
	return {
		// Функции для прямого вызова
		getComments: fetchComments,
		getComment: fetchComment,
		addComment: createCommentMutation.mutateAsync,
		updateComment: updateCommentMutation.mutateAsync,
		deleteComment: deleteCommentMutation.mutateAsync,

		// Хуки для компонентов
		useComments: useCommentsQuery,
		useComment: useCommentQuery,

		// Состояние мутаций
		isAdding: createCommentMutation.isPending,
		isUpdating: updateCommentMutation.isPending,
		isDeleting: deleteCommentMutation.isPending,
	};
};
