import { Tag } from 'antd';
import { IPriorityMap } from '../../types/tasks';

export const getPriorityTag = (priority: string) => {
	const priorityMap: IPriorityMap = {
		LOW: { color: 'green', text: 'Низкий' },
		MEDIUM: { color: 'blue', text: 'Средний' },
		HIGH: { color: 'orange', text: 'Высокий' },
		URGENT: { color: 'red', text: 'Срочный' },
	};

	const { color, text } = priorityMap[priority] || {
		color: 'default',
		text: priority,
	};

	return <Tag color={color}>{text}</Tag>;
};
