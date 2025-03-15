// src/pages/tasks/TaskEdit.tsx
import React from 'react';
import { Typography, Card } from 'antd';
import TaskForm from '../../components/tasks/TaskForm';
import { useParams, useLocation } from 'react-router-dom';
import styles from './TasksStyles.module.css';

const { Title, Text } = Typography;

const TaskEdit: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();

	// Получаем активную вкладку из state, если она передана
	const activeTab = location.state?.activeTab;

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

			<TaskForm isEditMode activeTab={activeTab} />
		</div>
	);
};

export default TaskEdit;
