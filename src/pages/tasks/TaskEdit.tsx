// src/pages/tasks/TaskEdit.tsx
import React from 'react';
import { Typography } from 'antd';
import { useParams, useLocation } from 'react-router-dom';
import styles from './TasksStyles.module.css';
import TaskForm from './TaskForm';

const { Title, Text } = Typography;

const TaskEdit: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();

	return (
		<div className={styles.tasksListPage}>
			<div className={styles.pageHeader}>
				<div>
					<Title level={2}>Редактирование задачи</Title>
					<Text type='secondary'>
						Изменение информации о задаче и подзадачах
					</Text>
				</div>
			</div>

			<TaskForm isEditMode />
		</div>
	);
};

export default TaskEdit;
