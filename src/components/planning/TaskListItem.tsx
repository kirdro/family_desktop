// TaskListItem.tsx
import React from 'react';
import { Checkbox, Typography, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Task } from '../../store/tasksLocalStore';

const { Text, Paragraph } = Typography;

interface TaskListItemProps {
	task: Task;
	onToggleComplete: (taskId: string, completed: boolean) => void;
	onEdit: (taskId: string) => void;
	onDelete: (taskId: string) => void;
}

const TaskContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 12px 16px;
	background: #2a2a2a;
	border-radius: 4px;
	margin-bottom: 8px;
`;

const TaskContent = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	flex: 1;
`;

const TaskTitle = styled(Text)`
	font-size: 16px;
	${(props) => props.delete && 'text-decoration: line-through;'}
`;

const TaskDescription = styled(Paragraph)`
	margin-top: 4px;
	margin-bottom: 0;
	color: #8c8c8c;
`;

const TaskListItem: React.FC<TaskListItemProps> = ({
	task,
	onToggleComplete,
	onEdit,
	onDelete,
}) => {
	return (
		<TaskContainer>
			<TaskContent>
				<Checkbox
					checked={task.completed}
					onChange={(e) =>
						onToggleComplete(task.id, e.target.checked)
					}
				/>
				<div style={{ flex: 1 }}>
					<TaskTitle delete={task.completed} strong>
						{task.title}
					</TaskTitle>
					{task.description && (
						<TaskDescription ellipsis={{ rows: 2 }}>
							{task.description}
						</TaskDescription>
					)}
				</div>
			</TaskContent>

			<Space>
				<Tooltip title='Редактировать задачу'>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => onEdit(task.id)}
					/>
				</Tooltip>
				<Tooltip title='Удалить задачу'>
					<Button
						type='link'
						danger
						icon={<DeleteOutlined />}
						onClick={() => onDelete(task.id)}
					/>
				</Tooltip>
			</Space>
		</TaskContainer>
	);
};

export default TaskListItem;
