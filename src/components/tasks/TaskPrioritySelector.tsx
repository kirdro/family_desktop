// src/components/tasks/TaskPrioritySelector.tsx
import React from 'react';
import { Select, Tag } from 'antd';
import styles from '../../pages/tasks/TasksStyles.module.css';

interface TaskPrioritySelectorProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

const TaskPrioritySelector: React.FC<TaskPrioritySelectorProps> = ({
	value,
	onChange,
	disabled = false,
}) => {
	const priorityOptions = [
		{ value: 'LOW', label: 'Низкий', color: 'green' },
		{ value: 'MEDIUM', label: 'Средний', color: 'blue' },
		{ value: 'HIGH', label: 'Высокий', color: 'orange' },
		{ value: 'URGENT', label: 'Срочный', color: 'red' },
	];

	// Находим текущий приоритет
	const currentPriority =
		priorityOptions.find((option) => option.value === value) ||
		priorityOptions[1];

	return (
		<Select
			value={value}
			onChange={onChange}
			disabled={disabled}
			className={styles.prioritySelector}
			popupClassName={styles.prioritySelectorPopup}
			suffixIcon={null} // Убираем стандартную иконку
		>
			{priorityOptions.map((option) => (
				<Select.Option key={option.value} value={option.value}>
					<Tag color={option.color}>{option.label}</Tag>
				</Select.Option>
			))}
		</Select>
	);
};

export default TaskPrioritySelector;
