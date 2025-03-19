// src/components/tasks/TaskStatusDropdown.tsx
import React from 'react';
import { Select, Tag } from 'antd';
import styles from '../../pages/tasks/TasksStyles.module.css';
import { Status } from '../../types';

interface TaskStatusDropdownProps {
	value: Status;
	onChange: (value: Status) => void;
	disabled?: boolean;
}

const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({
	value,
	onChange,
	disabled = false,
}) => {
	const statusOptions = [
		{ value: 'TODO', label: 'К выполнению', color: 'default' },
		{ value: 'IN_PROGRESS', label: 'В процессе', color: 'processing' },
		{ value: 'REVIEW', label: 'На проверке', color: 'warning' },
		{ value: 'DONE', label: 'Выполнено', color: 'success' },
		{ value: 'ARCHIVED', label: 'Архив', color: 'default' },
	];

	// Находим текущий статус
	const currentStatus =
		statusOptions.find((option) => option.value === value) ||
		statusOptions[0];

	return (
		<Select
			value={value}
			onChange={onChange}
			disabled={disabled}
			className={styles.statusDropdown}
			popupClassName={styles.statusDropdownPopup}
			suffixIcon={null} // Убираем стандартную иконку
		>
			{statusOptions.map((option) => (
				<Select.Option key={option.value} value={option.value}>
					<Tag color={option.color}>{option.label}</Tag>
				</Select.Option>
			))}
		</Select>
	);
};

export default TaskStatusDropdown;
