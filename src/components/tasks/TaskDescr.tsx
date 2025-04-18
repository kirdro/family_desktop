// src/components/tasks/TaskDescr.tsx

import styles from '../../pages/tasks/TasksStyles.module.css';
import { Divider, Typography } from 'antd';
import SubTaskList from './SubTaskList';
import { FC } from 'react';
import { ITask } from '../../types';
const { Text, Paragraph } = Typography;

interface IProps {
	task: ITask;
}

export const TaskDescr: FC<IProps> = (props) => {
	const { task } = props;

	return (
		<>
			<div className={styles.taskDescription}>
				{task.description ?
					<Paragraph>{task.description}</Paragraph>
				:	<Text type='secondary' italic>
						Нет описания
					</Text>
				}
			</div>

			<Divider orientation='left'>Подзадачи</Divider>

			<SubTaskList
				taskId={task.id}
				initialSubTasks={task.subTasks || []}
				onSubTaskUpdate={(updatedSubTask) => {
					// Обновляем список подзадач в состоянии
					// setTask((prev) => ({
					// 	...prev,
					// 	subTasks: prev.subTasks.map((st) =>
					// 		st.id === updatedSubTask.id ? updatedSubTask : st,
					// 	),
					// }));
				}}
				onSubTaskCreate={(newSubTask) => {
					// Добавляем новую подзадачу в состояние
					// setTask((prev) => ({
					// 	...prev,
					// 	subTasks: [...prev.subTasks, newSubTask],
					// }));
				}}
				onSubTaskDelete={(subTaskId) => {
					// Удаляем подзадачу из состояния
					// setTask((prev) => ({
					// 	...prev,
					// 	subTasks: prev.subTasks.filter(
					// 		(st) => st.id !== subTaskId,
					// 	),
					// }));
				}}
			/>
		</>
	);
};
