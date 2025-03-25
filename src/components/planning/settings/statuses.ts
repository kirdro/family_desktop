import { PlanPriority, PlanStatus } from '../../../types/planning';

export const statusColors = {
	[PlanStatus.NEW]: 'blue',
	[PlanStatus.IN_PROGRESS]: 'green',
	[PlanStatus.ON_HOLD]: 'orange',
	[PlanStatus.COMPLETED]: 'purple',
	[PlanStatus.CANCELLED]: 'red',
};

export const priorityColors = {
	[PlanPriority.LOW]: 'green',
	[PlanPriority.MEDIUM]: 'blue',
	[PlanPriority.HIGH]: 'red',
};

export const statusLabels = {
	[PlanStatus.NEW]: 'Новый',
	[PlanStatus.IN_PROGRESS]: 'В работе',
	[PlanStatus.ON_HOLD]: 'На паузе',
	[PlanStatus.COMPLETED]: 'Завершен',
	[PlanStatus.CANCELLED]: 'Отменен',
};

export const priorityLabels = {
	[PlanPriority.LOW]: 'Низкий',
	[PlanPriority.MEDIUM]: 'Средний',
	[PlanPriority.HIGH]: 'Высокий',
};
