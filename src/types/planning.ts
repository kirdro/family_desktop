// src/types/planning.ts
import { ITask, ITeam, IUser } from './index';

export enum PlanStatus {
	NEW = 'NEW',
	IN_PROGRESS = 'IN_PROGRESS',
	ON_HOLD = 'ON_HOLD',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export enum PlanPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export interface PlanFile {
	id: string;
	name: string;
	url: string;
	size: number;
	type: string;
	uploadedAt: string;
	uploadedBy: IUser;
	uploadedById: string;
	planId: string;
}

export interface PlanComment {
	id: string;
	text: string;
	createdAt: string;
	updatedAt: string;
	author: IUser;
	authorId: string;
	planId: string;
	parentId?: string;
	parentComment?: PlanComment;
	replies: PlanComment[];
}

export interface Plan {
	id: string;
	title: string;
	description?: string;
	startDate: string;
	endDate: string;
	status: PlanStatus;
	priority: PlanPriority;
	createdAt: string;
	updatedAt: string;
	author: IUser;
	authorId: string;
	assignees: IUser[];
	files: PlanFile[];
	team: ITeam;
	teamId: number;
	completedAt?: string;
	cancelledAt?: string;
	progress: number;
	tasks: ITask[];
	comments: PlanComment[];
}

export type TPlanFormData = Omit<
	Plan,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'author'
	| 'team'
	| 'files'
	| 'tasks'
	| 'comments'
> & {
	authorId: string;
	teamId: number;
	assigneeIds: string[];
};
