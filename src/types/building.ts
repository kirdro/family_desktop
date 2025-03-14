

export interface BuildingPlan {
	id: string;
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	status: PlanStatus;
	priority: PlanPriority;
	assignees: PlanAssignee[];
	attachments: string[];
	tasks: string[];
	createdAt: Date;
	updatedAt: Date;
	createdBy: string;
	files: PlanFile[];
}



export enum PlanStatus {
	NEW = 'NEW',
	IN_PROGRESS = 'IN_PROGRESS',
	ON_HOLD = 'ON_HOLD',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED'
}

// Приоритеты плана
export enum PlanPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH'
}

// Интерфейс для файла
export interface PlanFile {
	id: string;
	name: string;
	url: string;
	size: number;
	type: string;
	uploadedAt: Date;
	uploadedBy: string;
}

// Интерфейс для исполнителя
export interface PlanAssignee {
	id: string;
	name?: string;
	image?: string;
	role?: string;
	email: string;
}

// Основной интерфейс для данных плана
export interface PlanFormData {
	title: string;
	description: string;
	startDate: Date;
	endDate: Date;
	priority: PlanPriority;
	status: PlanStatus;
	assignees: PlanAssignee[];
	files: PlanFile[];
}

