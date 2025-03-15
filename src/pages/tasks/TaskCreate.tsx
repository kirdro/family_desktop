// src/pages/tasks/TaskCreate.tsx
import React from 'react';
import { Typography, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './TasksStyles.module.css';
import TaskForm from './TaskForm.tsx';

const { Title, Text } = Typography;

const TaskCreate: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Получаем начальные данные из state, если они переданы
	const initialData = location.state || {};

	return (
		<div className={styles.tasksListPage}>
			<div className={styles.pageHeader}>
				<div>
					<Title level={2}>Создание новой задачи</Title>
					<Text type='secondary'>
						Заполните информацию о задаче и добавьте подзадачи
					</Text>
				</div>
			</div>

			<TaskForm initialData={initialData} />
		</div>
	);
};

export default TaskCreate;
