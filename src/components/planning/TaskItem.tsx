import {
	TaskActions,
	TaskContent,
	TaskItem,
	TaskTitle,
} from '../../pages/plannings/styles';
import { Badge, Button, Checkbox, Space, Tooltip } from 'antd';
import { ITask, Status } from '../../types';
import TaskTags from '../tasks/TaskTags';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
	task: ITask;
	handleToggleTaskComplete: (taskId: string) => void;
	handleOpenTaskModal: (task: ITask) => void;
}

export const CustomTaskItem: FC<IProps> = (props) => {
	const { task, handleToggleTaskComplete, handleOpenTaskModal } = props;
	const navigate = useNavigate();

	return (
		<TaskItem>
			<TaskContent>
				<Checkbox
					checked={task.status === Status.DONE}
					onChange={() => handleToggleTaskComplete(task.id)}
				/>
				<TaskTitle
					delete={task.status === Status.DONE}
					onClick={() => handleOpenTaskModal(task)}
				>
					{task.title}
				</TaskTitle>

				{task.tags && task.tags.length > 0 && (
					<div
						style={{
							marginLeft: 12,
						}}
					>
						<TaskTags tags={task.tags} maxDisplay={2} />
					</div>
				)}
			</TaskContent>

			<TaskActions>
				<Space>
					<Badge
						count={task.subTasks?.length || 0}
						size='small'
						style={{
							backgroundColor:
								task.subTasks?.length ? '#76ABAE' : '#8c8c8c',
						}}
						showZero
					/>
					<Badge
						count={task.comments?.length || 0}
						size='small'
						style={{
							backgroundColor:
								task.comments?.length ? '#76ABAE' : '#8c8c8c',
						}}
						showZero
					/>
					<Tooltip title='Открыть задачу'>
						<Button
							type='text'
							size='small'
							icon={<EyeOutlined />}
							onClick={() => handleOpenTaskModal(task)}
						/>
					</Tooltip>
					<Tooltip title='Перейти к странице задачи'>
						<Button
							type='text'
							size='small'
							icon={<ArrowLeftOutlined />}
							onClick={() => navigate(`/admin/tasks/${task.id}`)}
						/>
					</Tooltip>
				</Space>
			</TaskActions>
		</TaskItem>
	);
};
