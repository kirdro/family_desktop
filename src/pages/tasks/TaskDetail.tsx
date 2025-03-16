// src/pages/tasks/TaskDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Card,
	Typography,
	Button,
	Tabs,
	Space,
	Avatar,
	Spin,
	Empty,
	Divider,
	Timeline,
	Row,
	Col,
	Dropdown,
	Menu,
	Modal,
	message,
	Badge,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	ArrowLeftOutlined,
	UserOutlined,
	CheckCircleOutlined,
	PlayCircleOutlined,
	MessageOutlined,
	FileOutlined,
	MoreOutlined,
	ExclamationCircleOutlined,
	HistoryOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import { useTasks } from '../../hooks/useTasks';
import TaskComments from '../../components/tasks/TaskComments';
import TaskTags from '../../components/tasks/TaskTags';
import TaskStatusDropdown from '../../components/tasks/TaskStatusDropdown';
import TaskPrioritySelector from '../../components/tasks/TaskPrioritySelector';
import styles from './TasksStyles.module.css';
import dayjs from 'dayjs';
import { TaskDescr } from '../../components/tasks/TaskDescr.tsx';
import { usePatchUpdateTask } from '../../api';
import { Status } from '../../types';
import { formatDate } from '../../tools/formatDate.ts';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const TaskDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getGeneralStore } = useGeneralStore();
	const { tasks } = getGeneralStore();
	const [activeTab, setActiveTab] = useState('details');
	const [isLoading, setIsLoading] = useState(false);
	const [_task, setTask] = useState<unknown>(null);

	const task = tasks.find((task) => task.id === id);
	const { mutateAsync } = usePatchUpdateTask();

	// Используем хуки для задач и комментариев
	const { getTask, updateTask, deleteTask } = useTasks();

	// Получение данных о задаче

	// Обработчик изменения статуса
	const handleStatusChange = async (newStatus: Status) => {
		if (!id || !task) return;

		try {
			const _data = {
				taskId: task.id,
				startDate: task.startDate,
				// endDate: new Date(),
				status: newStatus,
				emailAssigns: task.assignees.map((t) => t.email),
				tags: task.tags.map((t) => t.id),
			};
			await mutateAsync(_data);
			// await updateTask(id, { status: newStatus });
			message.success('Статус задачи обновлен');
		} catch (error) {
			console.error('Error updating task status:', error);
			message.error('Не удалось обновить статус задачи');
		}
	};

	// Обработчик изменения приоритета
	const handlePriorityChange = async (newPriority: string) => {
		if (!id || !task) return;

		try {
			await updateTask(id, { priority: newPriority });
			message.success('Приоритет задачи обновлен');
		} catch (error) {
			console.error('Error updating task priority:', error);
			message.error('Не удалось обновить приоритет задачи');
		}
	};

	// Обработчик начала/завершения задачи
	// Обработчик начала/завершения задачи
	const handleStartOrCompleteTask = async () => {
		if (!id || !task) return;

		// Если задача еще не начата
		if (!task.startDate) {
			try {
				const startDate = dayjs().toISOString();
				await updateTask(id, { startDate, status: 'IN_PROGRESS' });

				message.success('Задача начата');
			} catch (error) {
				console.error('Error starting task:', error);
				message.error('Не удалось начать задачу');
			}
		}
		// Если задача уже начата, но не завершена
		else if (!task.completedAt) {
			try {
				const completedAt = dayjs().toISOString();
				const endDate = dayjs().toISOString();
				await updateTask(id, {
					completedAt,
					endDate,
					status: 'DONE',
				});

				message.success('Задача завершена');
			} catch (error) {
				console.error('Error completing task:', error);
				message.error('Не удалось завершить задачу');
			}
		}
		// Если задача уже завершена, можно возобновить
		else {
			try {
				await updateTask(id, {
					completedAt: null,
					status: 'IN_PROGRESS',
				});

				message.success('Задача возобновлена');
			} catch (error) {
				console.error('Error reopening task:', error);
				message.error('Не удалось возобновить задачу');
			}
		}
	};

	// Обработчик удаления задачи
	const handleDeleteTask = () => {
		if (!id) return;

		confirm({
			title: 'Вы уверены, что хотите удалить эту задачу?',
			icon: <ExclamationCircleOutlined />,
			content:
				'Это действие нельзя отменить. Все подзадачи и комментарии будут также удалены.',
			okText: 'Да, удалить',
			okType: 'danger',
			cancelText: 'Отмена',
			async onOk() {
				try {
					await deleteTask(id);
					message.success('Задача успешно удалена');
					navigate('/admin/tasks');
				} catch (error) {
					console.error('Error deleting task:', error);
					message.error('Не удалось удалить задачу');
				}
			},
		});
	};

	// Форматирование даты

	// Получение статуса в виде компонента Tag

	// Если загрузка
	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<Spin size='large' />
				<Text style={{ marginTop: 16 }}>Загрузка задачи...</Text>
			</div>
		);
	}

	// Если задача не найдена
	if (!task) {
		return (
			<div className={styles.errorContainer}>
				<Empty
					description='Задача не найдена'
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
				<Button
					type='primary'
					icon={<ArrowLeftOutlined />}
					onClick={() => navigate('/admin/tasks')}
				>
					Вернуться к списку задач
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.taskDetailPage}>
			<div className={styles.pageHeader}>
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={() => navigate('/admin/tasks')}
				>
					Назад к списку
				</Button>

				<Space>
					<Button
						icon={
							task.startDate && !task.completedAt ?
								<CheckCircleOutlined />
							:	<PlayCircleOutlined />
						}
						type='primary'
						onClick={handleStartOrCompleteTask}
					>
						{!task.startDate ?
							'Начать задачу'
						: !task.completedAt ?
							'Завершить задачу'
						:	'Возобновить задачу'}
					</Button>

					<Dropdown
						overlay={
							<Menu
								items={[
									{
										key: 'edit',
										label: 'Редактировать',
										icon: <EditOutlined />,
										onClick: () =>
											navigate(`/admin/tasks/${id}/edit`),
									},
									{
										key: 'delete',
										label: 'Удалить',
										icon: <DeleteOutlined />,
										danger: true,
										onClick: handleDeleteTask,
									},
								]}
							/>
						}
						trigger={['click']}
					>
						<Button icon={<MoreOutlined />} />
					</Dropdown>
				</Space>
			</div>

			<Row gutter={16}>
				<Col xs={24} lg={16}>
					<Card className={styles.mainTaskCard}>
						<div className={styles.taskHeader}>
							<Title level={3}>{task.title}</Title>

							<Space
								size='large'
								wrap
								className={styles.taskMeta}
							>
								<div className={styles.metaItem}>
									<Text type='secondary'>Статус:</Text>
									<TaskStatusDropdown
										value={task.status}
										onChange={handleStatusChange}
									/>
								</div>

								<div className={styles.metaItem}>
									<Text type='secondary'>Приоритет:</Text>
									<TaskPrioritySelector
										value={task.priority}
										onChange={handlePriorityChange}
									/>
								</div>
							</Space>
						</div>

						<Divider style={{ margin: '12px 0' }} />

						<div className={styles.taskContent}>
							<Tabs activeKey={activeTab} onChange={setActiveTab}>
								<TabPane
									tab={
										<span>
											<FileOutlined /> Описание
										</span>
									}
									key='details'
								>
									<TaskDescr task={task} setTask={setTask} />
								</TabPane>

								<TabPane
									tab={
										<span>
											<MessageOutlined /> Комментарии
										</span>
									}
									key='comments'
								>
									<TaskComments
										taskId={id as string}
										initialComments={task.comments || []}
										onCommentCreate={(newComment) => {
											// Добавляем новый комментарий в состояние
											setTask((prev) => ({
												...prev,
												comments: [
													...prev.comments,
													newComment,
												],
											}));
										}}
										onCommentUpdate={(updatedComment) => {
											// Обновляем комментарий в состоянии
											setTask((prev) => ({
												...prev,
												comments: prev.comments.map(
													(c) =>
														(
															c.id ===
															updatedComment.id
														) ?
															updatedComment
														:	c,
												),
											}));
										}}
										onCommentDelete={(commentId) => {
											// Удаляем комментарий из состояния
											setTask((prev) => ({
												...prev,
												comments: prev.comments.filter(
													(c) => c.id !== commentId,
												),
											}));
										}}
									/>
								</TabPane>

								<TabPane
									tab={
										<span>
											<HistoryOutlined /> Активность
										</span>
									}
									key='activity'
								>
									<Timeline
										className={styles.activityTimeline}
									>
										<Timeline.Item>
											<Text strong>
												{task.author.name}
											</Text>{' '}
											создал(а) задачу
											<Text type='secondary'>
												{' '}
												{formatDate(
													task.createdAt,
													'DD.MM.YYYY HH:mm',
												)}
											</Text>
										</Timeline.Item>

										{task.startDate && (
											<Timeline.Item>
												<Text strong>
													{task.author.name}
												</Text>{' '}
												начал(а) выполнение задачи
												<Text type='secondary'>
													{' '}
													{formatDate(
														task.startDate,
														'DD.MM.YYYY HH:mm',
													)}
												</Text>
											</Timeline.Item>
										)}

										{task.completedAt && (
											<Timeline.Item>
												<Text strong>
													{task.author.name}
												</Text>{' '}
												завершил(а) задачу
												<Text type='secondary'>
													{' '}
													{formatDate(
														task.completedAt,
														'DD.MM.YYYY HH:mm',
													)}
												</Text>
											</Timeline.Item>
										)}

										{/* Здесь можно добавить другие события из истории задачи */}
									</Timeline>
								</TabPane>
							</Tabs>
						</div>
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card className={styles.taskSidebar}>
						<div className={styles.sidebarSection}>
							<Title level={5}>Исполнители</Title>
							<div className={styles.assigneeList}>
								{task.assignees.length > 0 ?
									task.assignees.map((user) => (
										<div
											key={user.id}
											className={styles.assigneeItem}
										>
											<Avatar
												src={user.image}
												icon={
													!user.image && (
														<UserOutlined />
													)
												}
											/>
											<Text>{user.name}</Text>
										</div>
									))
								:	<Text type='secondary'>Нет исполнителей</Text>}

								<Button
									type='dashed'
									icon={<PlusOutlined />}
									className={styles.addButton}
									onClick={() =>
										navigate(`/admin/tasks/${id}/edit`, {
											state: { activeTab: 'assignees' },
										})
									}
								>
									Добавить исполнителя
								</Button>
							</div>
						</div>

						<Divider />

						<div className={styles.sidebarSection}>
							<Title level={5}>Теги</Title>
							<div className={styles.tagsList}>
								{task.tags.length > 0 ?
									<TaskTags
										tags={task.tags}
										maxDisplay={10}
									/>
								:	<Text type='secondary'>Нет тегов</Text>}

								<Button
									type='dashed'
									icon={<PlusOutlined />}
									className={styles.addButton}
									onClick={() =>
										navigate(`/admin/tasks/${id}/edit`, {
											state: { activeTab: 'tags' },
										})
									}
								>
									Добавить теги
								</Button>
							</div>
						</div>

						<Divider />

						<div className={styles.sidebarSection}>
							<Title level={5}>Информация</Title>
							<ul className={styles.infoList}>
								<li>
									<Text type='secondary'>Автор:</Text>
									<div className={styles.infoValue}>
										<Avatar
											size='small'
											src={task.author.image}
											icon={
												!task.author.image && (
													<UserOutlined />
												)
											}
										/>
										<Text>{task.author.name}</Text>
									</div>
								</li>
								<li>
									<Text type='secondary'>Создана:</Text>
									<Text>
										{formatDate(
											task.createdAt,
											'DD.MM.YYYY HH:mm',
										)}
									</Text>
								</li>
								<li>
									<Text type='secondary'>Начало:</Text>
									<Text>
										{formatDate(
											task.startDate,
											'DD.MM.YYYY HH:mm',
										)}
									</Text>
								</li>
								<li>
									<Text type='secondary'>Срок:</Text>
									<Text>
										{formatDate(
											task.endDate,
											'DD.MM.YYYY HH:mm',
										)}
									</Text>
								</li>
								<li>
									<Text type='secondary'>Завершена:</Text>
									<Text>
										{formatDate(
											task.completedAt,
											'DD.MM.YYYY HH:mm',
										)}
									</Text>
								</li>
								<li>
									<Text type='secondary'>Подзадачи:</Text>
									<Badge
										count={task.subTasks?.length || 0}
										style={{ backgroundColor: '#76ABAE' }}
										showZero
									/>
								</li>
								<li>
									<Text type='secondary'>Комментарии:</Text>
									<Badge
										count={task.comments?.length || 0}
										style={{ backgroundColor: '#76ABAE' }}
										showZero
									/>
								</li>
								<li>
									<Text type='secondary'>Обновлена:</Text>
									<Text>
										{formatDate(
											task.updatedAt,
											'DD.MM.YYYY HH:mm',
										)}
									</Text>
								</li>
							</ul>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default TaskDetail;
