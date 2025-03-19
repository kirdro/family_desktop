// import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AxiosError } from 'axios';

export interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

export interface IKeyString<T> {
	[key: string]: T;
}

export interface IRequestArgs {
	url: string;
	token?: string | null;
	data?: unknown;
	responseType?:
		| 'json'
		| 'arraybuffer'
		| 'blob'
		| 'document'
		| 'text'
		| 'stream'
		| undefined;
	onError?: (error: AxiosError) => void;
	headers?: Record<string, string>;
}

export interface IUser {
	createdAt: Date;
	email: string;
	emailVerified: null;
	id: string;
	image: string | null;
	manyId: number | null;
	name: string | null;
	password: '';
	role: string;
	teamId: number | null;
	updatedAt: Date;
	verified: true;
}

export interface IVerifyTokenRes {
	success: boolean;
	token: string;
	user: IUser;
}

export interface IWallet {
	id: number;
	count: number;
	teamId: number;
	Transaction: unknown[];
	RublesDebit: unknown[];
}
export interface ITeam {
	createdAt: Date;
	id: number;
	name: string;
	updatedAt: Date;
	members: IUser[];
}

// Task interfaces
export interface IParamsCreateTask {
	title: string;
	description?: string;
	tags: string[];
	priority: Priority;
	email: string;
	emailAssigns: string[];
	status: Status;
}

export interface IParamsUpdateTask {
	taskId: string;
	title?: string;
	description?: string;
	emailAssigns?: string[];
	priority?: Priority;
	status?: Status;
	tags?: string[];
	startDate?: Date | null;
	endDate?: Date | null;
	completedAt?: Date | null;
	completed?: boolean;
}

export interface IParamsDeleteTask {
	taskId: string;
	email: string;
}

// SubTask interfaces
export interface IParamsCreateSubTask {
	title: string;
	taskId: string;
	email: string;
	emailAssigns: string[];
	description?: string;
	priority?: Priority;
	tags?: string[];
}

export interface IParamsUpdateSubTask {
	subTaskId: string;
	title?: string;
	description?: string;
	emailAssigns?: string[];
	priority?: Priority;
	status?: Status;
	tags?: string[];
	startDate?: Date | null;
	endDate?: Date | null;
	completedAt?: Date | null;
	completed?: boolean;
}

export interface IParamsDeleteSubTask {
	subTaskId: string;
	email: string;
}

// Comment interfaces
export interface IParamsCreateComment {
	text: string;
	taskId?: string;
	subTaskId?: string;
	parentId?: string;
	email: string;
}

export interface IParamsUpdateComment {
	commentId: string;
	text: string;
	email: string;
}

export interface IParamsDeleteComment {
	commentId: string;
	email: string;
}

// Tag interfaces
export interface IParamsCreateTag {
	name: string;
	color?: string;
	description?: string;
	icon?: string;
	type?: TagType;
	email: string;
}

export interface IParamsUpdateTag {
	tagId: string;
	name?: string;
	color?: string;
	description?: string;
	icon?: string;
	type?: TagType;
	email: string;
}

export interface IParamsDeleteTag {
	tagId: string;
	email: string;
}

// Response interfaces
export interface ITaskResponse {
	status: string;
	message: string;
	data: unknown;
}

export interface ITask {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	startDate?: Date;
	endDate?: Date;
	completedAt?: Date;
	authorId: string;
	priority: Priority;
	status: Status;
	teamId: number;
	author: IUser;
	assignees: IUser[];
	subTasks: ISubTask[];
	comments: IComment[];
	tags: ITag[];
	team: ITeam;
}

export interface ISubTask {
	id: string;
	title: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
	startDate?: Date;
	endDate?: Date;
	completedAt?: Date;
	taskId: string;
	authorId: string;
	priority: Priority;
	status: Status;
	author: IUser;
	assignees: IUser[];
	comments: IComment[];
	tags: ITag[];
	description?: string;
}

export interface IComment {
	id: string;
	text: string;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	taskId?: string;
	subTaskId?: string;
	parentId?: string;
	author: IUser;
	replies: IComment[];
}

export interface ITag {
	id: string;
	name: string;
	color: string;
	description?: string;
	icon?: string;
	type: TagType;
	createdAt: Date;
	updatedAt: Date;
	teamId: number;
}

export interface ITeam {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

// Statistics interfaces
export interface ITaskStatistics {
	taskStats: {
		status: Status;
		_count: number;
	}[];
	userStats: {
		id: string;
		name?: string;
		email?: string;
		_count: {
			assignedTasks: number;
			assignedSubTasks: number;
		};
	}[];
	tagStats: {
		id: string;
		name: string;
		_count: {
			tasks: number;
			subTasks: number;
		};
	}[];
}

// Filter interfaces
export interface ITaskFilters {
	status?: Status;
	priority?: Priority;
	tagIds?: string[];
	assigneeEmails?: string[];
	startDate?: Date;
	endDate?: Date;
	completed?: boolean;
}

// Enum types (если не импортируются из Prisma)
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

export enum TagType {
	GENERAL = 'GENERAL',
	PRIORITY = 'PRIORITY',
	STATUS = 'STATUS',
	CATEGORY = 'CATEGORY',
	CUSTOM = 'CUSTOM',
}

// Pagination interfaces
export interface IPaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface IParamsDeleteSubTask {
	subTaskId: string;
	email: string;
}

// Возможный ответ от сервера
export interface IDeleteSubTaskResponse {
	success: boolean;
	message: string;
	data?: {
		id: string;
		deletedAt: Date;
	};
}
export interface BuildingPlan {
	id: string;
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	status: 'draft' | 'active' | 'completed' | 'cancelled';
	priority: 'low' | 'medium' | 'high';
	assignees: string[];
	attachments: string[];
	tasks: string[];
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
}
