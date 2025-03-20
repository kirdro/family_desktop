// src/pages/tasks/TaskEdit.tsx
import React from 'react';
import { Typography } from 'antd';
import { useParams, useLocation } from 'react-router-dom';
import styles from './TasksStyles.module.css';
import TaskForm from './TaskForm';
import { useGeneralStore } from '../../store/useGeneralStore';

const { Title, Text } = Typography;

const TaskEdit: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const { getGeneralStore } = useGeneralStore();

	const { tasks } = getGeneralStore();

	const task = tasks.find((task) => task.id === id);

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

			<TaskForm isEditMode initialData={task} />
		</div>
	);
};

export default TaskEdit;
