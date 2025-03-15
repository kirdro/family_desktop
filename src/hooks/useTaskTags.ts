// src/hooks/useTaskTags.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import {
	STORE_KEYS,
	TaskTag,
	Task,
	TagType,
	generateInitialData,
} from '../store/tasksLocalStore';
import { useGeneralStore } from '../store/useGeneralStore';

export const useTaskTags = () => {
	const queryClient = useQueryClient();
	const { generalStore } = useGeneralStore();

	// Получение всех тегов
	const fetchTags = () => {
		// Инициализируем хранилище, если нужно
		const existingTags = queryClient.getQueryData<TaskTag[]>(
			STORE_KEYS.tags,
		);

		if (!existingTags) {
			const { tags } = generateInitialData(
				generalStore.user,
				generalStore.team,
			);
			queryClient.setQueryData(STORE_KEYS.tags, tags);
			return tags;
		}

		return existingTags;
	};

	// Получение отдельного тега
	const fetchTag = (id: string) => {
		const tags = queryClient.getQueryData<TaskTag[]>(STORE_KEYS.tags) || [];
		const tag = tags.find((tag) => tag.id === id);

		if (!tag) {
			throw new Error(`Tag with id ${id} not found`);
		}

		return tag;
	};

	// Создание нового тега
	const createNewTag = (tagData: Partial<TaskTag>) => {
		// Получаем текущие теги
		const tags = queryClient.getQueryData<TaskTag[]>(STORE_KEYS.tags) || [];

		// Проверяем, существует ли тег с таким же именем
		const existingTag = tags.find((tag) => tag.name === tagData.name);
		if (existingTag) {
			throw new Error(`Tag with name "${tagData.name}" already exists`);
		}

		// Создаем новый тег
		const newTag: TaskTag = {
			id: uuidv4(),
			name: tagData.name || 'Новый тег',
			color: tagData.color || '#000000',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			teamId: generalStore.team?.id || 1,
			description: tagData.description,
			icon: tagData.icon,
			type: tagData.type || TagType.GENERAL,
		};

		// Сохраняем обновленные теги в кэше
		queryClient.setQueryData(STORE_KEYS.tags, [...tags, newTag]);

		return newTag;
	};

	// Обновление тега
	const updateExistingTag = ({
		id,
		...data
	}: { id: string } & Partial<TaskTag>) => {
		// Получаем текущие теги
		const tags = queryClient.getQueryData<TaskTag[]>(STORE_KEYS.tags) || [];

		// Находим тег для обновления
		const tagIndex = tags.findIndex((tag) => tag.id === id);

		if (tagIndex === -1) {
			throw new Error(`Tag with id ${id} not found`);
		}

		// Проверяем, существует ли другой тег с таким же именем
		if (data.name) {
			const existingTag = tags.find(
				(tag) => tag.name === data.name && tag.id !== id,
			);
			if (existingTag) {
				throw new Error(`Tag with name "${data.name}" already exists`);
			}
		}

		// Обновляем тег
		const updatedTag = {
			...tags[tagIndex],
			...data,
			updatedAt: new Date().toISOString(),
		};

		// Обновляем тег в списке
		const updatedTags = [...tags];
		updatedTags[tagIndex] = updatedTag;

		// Сохраняем обновленные теги в кэше
		queryClient.setQueryData(STORE_KEYS.tags, updatedTags);

		// Обновляем теги во всех задачах и подзадачах
		updateTagsInTasksAndSubtasks(id, updatedTag);

		return updatedTag;
	};

	// Вспомогательная функция для обновления тегов в задачах и подзадачах
	const updateTagsInTasksAndSubtasks = (
		tagId: string,
		updatedTag: TaskTag,
	) => {
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		const updatedTasks = tasks.map((task) => {
			// Обновляем теги в задаче
			const updatedTaskTags = task.tags.map((tag) =>
				tag.id === tagId ? updatedTag : tag,
			);

			// Обновляем теги в подзадачах
			const updatedSubTasks = task.subTasks.map((subTask) => {
				const updatedSubTaskTags = subTask.tags.map((tag) =>
					tag.id === tagId ? updatedTag : tag,
				);

				return {
					...subTask,
					tags: updatedSubTaskTags,
				};
			});

			return {
				...task,
				tags: updatedTaskTags,
				subTasks: updatedSubTasks,
			};
		});

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);
	};

	// Удаление тега
	const removeTag = (id: string) => {
		// Получаем текущие теги
		const tags = queryClient.getQueryData<TaskTag[]>(STORE_KEYS.tags) || [];

		// Фильтруем теги, исключая удаляемый
		const updatedTags = tags.filter((tag) => tag.id !== id);

		// Сохраняем обновленные теги в кэше
		queryClient.setQueryData(STORE_KEYS.tags, updatedTags);

		// Удаляем тег из всех задач и подзадач
		removeTagFromTasksAndSubtasks(id);

		return id;
	};

	// Вспомогательная функция для удаления тега из задач и подзадач
	const removeTagFromTasksAndSubtasks = (tagId: string) => {
		const tasks = queryClient.getQueryData<Task[]>(STORE_KEYS.tasks) || [];

		const updatedTasks = tasks.map((task) => {
			// Удаляем тег из задачи
			const updatedTaskTags = task.tags.filter((tag) => tag.id !== tagId);

			// Удаляем тег из подзадач
			const updatedSubTasks = task.subTasks.map((subTask) => {
				const updatedSubTaskTags = subTask.tags.filter(
					(tag) => tag.id !== tagId,
				);

				return {
					...subTask,
					tags: updatedSubTaskTags,
				};
			});

			return {
				...task,
				tags: updatedTaskTags,
				subTasks: updatedSubTasks,
			};
		});

		// Сохраняем обновленные задачи в кэше
		queryClient.setQueryData(STORE_KEYS.tasks, updatedTasks);
	};

	// Импортируем функцию генерации начальных данных из хранилища

	// Мутация для создания тега
	const createTagMutation = useMutation({
		mutationFn: createNewTag,
		onSuccess: (data) => {
			message.success('Тег успешно создан');
		},
		onError: (error: any) => {
			console.error('Error creating tag:', error);
			message.error('Не удалось создать тег: ' + error.message);
		},
	});

	// Мутация для обновления тега
	const updateTagMutation = useMutation({
		mutationFn: updateExistingTag,
		onSuccess: (data) => {
			message.success('Тег успешно обновлен');
		},
		onError: (error: any) => {
			console.error('Error updating tag:', error);
			message.error('Не удалось обновить тег: ' + error.message);
		},
	});

	// Мутация для удаления тега
	const deleteTagMutation = useMutation({
		mutationFn: removeTag,
		onSuccess: (id) => {
			message.success('Тег успешно удален');
		},
		onError: (error: any) => {
			console.error('Error deleting tag:', error);
			message.error('Не удалось удалить тег');
		},
	});

	// Хук для получения списка тегов
	const useTagsQuery = (options = {}) => {
		return useQuery({
			queryKey: STORE_KEYS.tags,
			queryFn: fetchTags,
			...options,
		});
	};

	// Хук для получения отдельного тега
	const useTagQuery = (id: string, options = {}) => {
		return useQuery({
			queryKey: [...STORE_KEYS.tags, id],
			queryFn: () => fetchTag(id),
			enabled: !!id,
			...options,
		});
	};

	// Возвращаем функции и хуки для использования в компонентах
	return {
		// Функции для прямого вызова
		getTags: fetchTags,
		getTag: fetchTag,
		createTag: createTagMutation.mutateAsync,
		updateTag: updateTagMutation.mutateAsync,
		deleteTag: deleteTagMutation.mutateAsync,

		// Хуки для компонентов
		useTags: useTagsQuery,
		useTag: useTagQuery,

		// Состояние мутаций
		isCreating: createTagMutation.isPending,
		isUpdating: updateTagMutation.isPending,
		isDeleting: deleteTagMutation.isPending,
	};
};
