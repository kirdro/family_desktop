// src/store/tasksLocalStore.ts
import dayjs from 'dayjs';

// Типы данных, соответствующие вашей схеме Prisma
export interface Task {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
	startDate?: string;
	endDate?: string;
	completedAt?: string;
	authorId: string;
	assignees: User[];
	subTasks: SubTask[];
	comments: Comment[];
	teamId: number;
	tags: TaskTag[];
	priority: Priority;
	status: Status;
	planId?: string;
}

export interface SubTask {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
	startDate?: string;
	endDate?: string;
	completedAt?: string;
	description?: string;
	taskId: string;
	authorId: string;
	assignees: User[];
	comments: Comment[];
	tags: TaskTag[];
	priority: Priority;
	status: Status;
}

export interface TaskTag {
	id: string;
	name: string;
	color: string;
	createdAt: string;
	updatedAt: string;
	teamId: number;
	description?: string;
	icon?: string;
	type: TagType;
}

export interface Comment {
	id: string;
	text: string;
	createdAt: string;
	updatedAt: string;
	authorId: string;
	author: User;
	taskId?: string;
	subTaskId?: string;
	parentId?: string;
	replies: Comment[];
}

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: string;
}

export enum TagType {
	GENERAL = 'GENERAL',
	PRIORITY = 'PRIORITY',
	STATUS = 'STATUS',
	CATEGORY = 'CATEGORY',
	CUSTOM = 'CUSTOM',
}

export enum Priority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	URGENT = 'URGENT',
}

export enum Status {
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	REVIEW = 'REVIEW',
	DONE = 'DONE',
	ARCHIVED = 'ARCHIVED',
}

// Ключи для React Query
export const STORE_KEYS = {
	tasks: ['tasks'],
	tags: ['tags'],
	comments: ['comments'],
	users: ['users'],
};

// Генерация некоторых начальных данных для тестирования
export const generateInitialData = (user?: User | null, team?: any) => {
	// Создаем текущего пользователя, если не предоставлен
	const currentUser: User = user || {
		id: 'user-1',
		name: 'Текущий пользователь',
		email: 'user@example.com',
		role: 'admin',
	};

	// Создаем команду, если не предоставлена
	const currentTeam = team || {
		id: 1,
		name: 'Команда разработки',
	};

	// Создаем несколько пользователей
	const users: User[] = [
		currentUser,
		{
			id: 'user-2',
			name: 'Алексей Иванов',
			email: 'alex@example.com',
			avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=1',
			role: 'developer',
		},
		{
			id: 'user-3',
			name: 'Мария Петрова',
			email: 'maria@example.com',
			avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&id=2',
			role: 'manager',
		},
	];

	// Создаем теги
	const tags: TaskTag[] = [
		{
			id: 'tag-1',
			name: 'Баг',
			color: '#ff4d4f',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			teamId: currentTeam.id,
			type: TagType.GENERAL,
		},
		{
			id: 'tag-2',
			name: 'Улучшение',
			color: '#52c41a',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			teamId: currentTeam.id,
			type: TagType.GENERAL,
		},
		{
			id: 'tag-3',
			name: 'Фронтенд',
			color: '#1890ff',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			teamId: currentTeam.id,
			type: TagType.CATEGORY,
		},
	];

	// Создаем задачи
	const tasks: Task[] = [
		{
			id: 'task-1',
			title: 'Разработать дашборд',
			description: 'Создать дашборд с графиками и статистикой',
			completed: false,
			createdAt: dayjs().subtract(5, 'day').toISOString(),
			updatedAt: dayjs().subtract(3, 'day').toISOString(),
			startDate: dayjs().subtract(2, 'day').toISOString(),
			endDate: dayjs().add(7, 'day').toISOString(),
			authorId: currentUser.id,
			assignees: [users[0], users[1]],
			subTasks: [],
			comments: [],
			teamId: currentTeam.id,
			tags: [tags[2]],
			priority: Priority.HIGH,
			status: Status.IN_PROGRESS,
		},
		{
			id: 'task-2',
			title: 'Исправить ошибку авторизации',
			description:
				'При неверном вводе пароля система не выдает сообщение об ошибке',
			completed: false,
			createdAt: dayjs().subtract(3, 'day').toISOString(),
			updatedAt: dayjs().subtract(1, 'day').toISOString(),
			authorId: currentUser.id,
			assignees: [users[1]],
			subTasks: [],
			comments: [],
			teamId: currentTeam.id,
			tags: [tags[0], tags[2]],
			priority: Priority.URGENT,
			status: Status.TODO,
		},
	];

	// Создаем подзадачи
	const subTasks: SubTask[] = [
		{
			id: 'subtask-1',
			title: 'Спроектировать интерфейс дашборда',
			completed: true,
			createdAt: dayjs().subtract(5, 'day').toISOString(),
			updatedAt: dayjs().subtract(4, 'day').toISOString(),
			completedAt: dayjs().subtract(1, 'day').toISOString(),
			taskId: 'task-1',
			authorId: currentUser.id,
			assignees: [users[0]],
			comments: [],
			tags: [tags[2]],
			priority: Priority.MEDIUM,
			status: Status.DONE,
		},
		{
			id: 'subtask-2',
			title: 'Реализовать графики с использованием Recharts',
			completed: false,
			createdAt: dayjs().subtract(4, 'day').toISOString(),
			updatedAt: dayjs().subtract(2, 'day').toISOString(),
			taskId: 'task-1',
			authorId: currentUser.id,
			assignees: [users[0], users[1]],
			comments: [],
			tags: [tags[2]],
			priority: Priority.HIGH,
			status: Status.IN_PROGRESS,
		},
	];

	// Добавляем подзадачи к задаче
	tasks[0].subTasks = subTasks;

	// Создаем комментарии
	const comments: Comment[] = [
		{
			id: 'comment-1',
			text: 'Я начал работать над этой задачей',
			createdAt: dayjs().subtract(3, 'day').toISOString(),
			updatedAt: dayjs().subtract(3, 'day').toISOString(),
			authorId: users[1].id,
			author: users[1],
			taskId: 'task-1',
			replies: [],
		},
		{
			id: 'comment-2',
			text: 'Интерфейс готов, перехожу к реализации графиков',
			createdAt: dayjs().subtract(1, 'day').toISOString(),
			updatedAt: dayjs().subtract(1, 'day').toISOString(),
			authorId: users[1].id,
			author: users[1],
			taskId: 'task-1',
			replies: [],
		},
	];

	// Добавляем комментарии к задаче
	tasks[0].comments = comments;

	return { tasks, tags, users, currentUser, currentTeam };
};
