import {
	CommentSection,
	DueDate,
	SubTaskItem,
	SubTaskList,
	TaskInfoItem,
	TaskModalContent,
	TaskModalHeader,
	TaskModalSection,
} from '../../pages/plannings/styles';
import {
	Avatar,
	Button,
	Checkbox,
	Divider,
	Empty,
	Form,
	Input,
	Space,
	Tooltip,
	Typography,
} from 'antd';
import TaskStatusDropdown from '../tasks/TaskStatusDropdown';
import TaskPrioritySelector from '../tasks/TaskPrioritySelector';
import UserAvatar from '../common/UserAvatar';
import dayjs from 'dayjs';
import TaskTags from '../tasks/TaskTags';
import { Comment } from '@ant-design/compatible';
import React, { FC } from 'react';
import { ITask, Status } from '../../types';
import { formatDate } from './tools/formatDate';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface IProps {
	task: ITask;
	handleTaskStatusChange: (taskId: string, newStatus: Status) => void;
	handleToggleSubtask: (
		taskId: string,
		subtaskId: string,
		completed: boolean,
	) => void;
	newComment: string;
	setNewComment: React.Dispatch<React.SetStateAction<string>>;
	handleAddComment: () => void;
}

export const TaskModal: FC<IProps> = (props) => {
	const {
		task,
		handleTaskStatusChange,
		handleToggleSubtask,
		newComment,
		setNewComment,
		handleAddComment,
	} = props;

	return (
		<TaskModalContent>
			<TaskModalHeader>
				<Space>
					<TaskStatusDropdown
						value={task.status}
						onChange={(newStatus) =>
							handleTaskStatusChange(task.id, newStatus)
						}
					/>
					<TaskPrioritySelector
						value={task.priority}
						onChange={(newPriority) => {
							// Здесь добавьте обработчик изменения приоритета задачи
						}}
					/>
				</Space>
			</TaskModalHeader>

			<TaskModalSection>
				<Divider orientation='left'>Описание</Divider>
				<Paragraph>
					{task.description || 'Описание отсутствует'}
				</Paragraph>
			</TaskModalSection>

			{task.subTasks && task.subTasks.length > 0 && (
				<TaskModalSection>
					<Divider orientation='left'>
						Подзадачи ({task.subTasks.length})
					</Divider>
					<SubTaskList>
						{task.subTasks.map((subtask) => (
							<SubTaskItem key={subtask.id}>
								<Checkbox
									checked={subtask.completed}
									onChange={(e) =>
										handleToggleSubtask(
											task.id,
											subtask.id,
											e.target.checked,
										)
									}
								/>
								<Text
									style={{
										marginLeft: 8,
										textDecoration:
											subtask.completed ? 'line-through'
											:	'none',
										color:
											subtask.completed ? '#8c8c8c' : (
												'inherit'
											),
									}}
								>
									{subtask.title}
								</Text>
							</SubTaskItem>
						))}
					</SubTaskList>
				</TaskModalSection>
			)}

			<TaskModalSection>
				<Divider orientation='left'>Информация</Divider>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<TaskInfoItem>
						<Text type='secondary'>Автор:</Text>
						<Space>
							<UserAvatar
								size='small'
								name={task.author?.name || ''}
								email={task.author?.email || ''}
								avatar={task.author?.image || ''}
							/>
							<Text>
								{task.author?.name || task.author?.email}
							</Text>
						</Space>
					</TaskInfoItem>

					<TaskInfoItem>
						<Text type='secondary'>Исполнители:</Text>
						<Space>
							{task.assignees && task.assignees.length > 0 ?
								<Avatar.Group maxCount={3}>
									{task.assignees.map((user) => (
										<Tooltip
											key={user.id}
											title={user.name || user.email}
										>
											<UserAvatar
												size='small'
												name={user.name || ''}
												email={user.email || ''}
												avatar={user.image || ''}
											/>
										</Tooltip>
									))}
								</Avatar.Group>
							:	<Text type='secondary'>Не назначены</Text>}
						</Space>
					</TaskInfoItem>

					<TaskInfoItem>
						<Text type='secondary'>Создана:</Text>
						<Text>{formatDate(task.createdAt)}</Text>
					</TaskInfoItem>

					<TaskInfoItem>
						<Text type='secondary'>Срок:</Text>
						<DueDate
							overdue={
								task.endDate &&
								dayjs(task.endDate).isBefore(dayjs())
							}
						>
							{formatDate(task.endDate) || 'Не установлен'}
							{task.endDate &&
								dayjs(task.endDate).isBefore(dayjs()) &&
								' (просрочена)'}
						</DueDate>
					</TaskInfoItem>

					{task.tags && task.tags.length > 0 && (
						<TaskInfoItem>
							<Text type='secondary'>Теги:</Text>
							<TaskTags tags={task.tags} maxDisplay={5} />
						</TaskInfoItem>
					)}
				</div>
			</TaskModalSection>

			<TaskModalSection>
				<Divider orientation='left'>
					Комментарии ({task.comments?.length || 0})
				</Divider>

				<Form.Item>
					<TextArea
						rows={2}
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder='Добавьте комментарий...'
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type='primary'
						onClick={handleAddComment}
						disabled={!newComment.trim()}
					>
						Добавить комментарий
					</Button>
				</Form.Item>

				<CommentSection>
					{task.comments && task.comments.length > 0 ?
						task.comments.map((comment) => (
							<Comment
								key={comment.id}
								author={
									comment.author?.name ||
									comment.author?.email
								}
								avatar={
									<UserAvatar
										size='small'
										name={comment.author?.name || ''}
										email={comment.author?.email || ''}
										avatar={comment.author?.image || ''}
									/>
								}
								content={comment.text}
								datetime={formatDate(comment.createdAt)}
							/>
						))
					:	<Empty description='Нет комментариев' />}
				</CommentSection>
			</TaskModalSection>
		</TaskModalContent>
	);
};
