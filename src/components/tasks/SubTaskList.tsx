// src/components/tasks/SubTaskList.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
	List,
	Input,
	Button,
	Checkbox,
	Typography,
	Space,
	Dropdown,
	Menu,
	Tag,
	Tooltip,
	Avatar,
	Modal,
	Form,
	Select,
	message,
	Spin,
	Empty,
	Tabs,
	Badge,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	MoreOutlined,
	CommentOutlined,
} from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import TaskComments from './TaskComments';
import UserAvatar from '../common/UserAvatar';
import dayjs from 'dayjs';
import styles from '../../pages/tasks/TasksStyles.module.css';
import { usePatchUpdateSubTask, usePostCreateSubTask } from '../../api';
import {
	IKeyString,
	IParamsUpdateSubTask,
	ISubTask,
	ITag,
	IUser,
	Priority,
	Status,
} from '../../types';
import { useDeleteSubTask } from '../../api/useDeleteSubTask';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface SubTaskListProps {
	taskId: string;
	initialSubTasks?: ISubTask[];
	onSubTaskUpdate?: (subTask: ISubTask) => void;
	onSubTaskCreate?: (subTask: ISubTask) => void;
	onSubTaskDelete?: (subTaskId: string) => void;
	showComments?: boolean; // Новый проп для отображения комментариев
}

const SubTaskList: React.FC<SubTaskListProps> = ({
	taskId,
	initialSubTasks = [],
	onSubTaskUpdate,
	showComments = true, // По умолчанию показываем комментарии
}) => {
	const [subTasks, setSubTasks] = useState<ISubTask[]>(initialSubTasks);
	const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
	const [editingSubTask, setEditingSubTask] = useState<ISubTask | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
	const [selectedAssignees, setSelectedAssignees] = useState<IUser[]>([]);
	const [expandedSubTask, setExpandedSubTask] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string>('details');
	const [form] = Form.useForm();

	const { getGeneralStore } = useGeneralStore();
	const { user, team, taskTags } = getGeneralStore();
	const { isPending, mutateAsync: onSubTaskCreate } = usePostCreateSubTask();
	const { isPending: isPendingSubTask, mutateAsync: updateSubTask } =
		usePatchUpdateSubTask();
	const { mutateAsync: onSubTaskDelete } = useDeleteSubTask();

	// Загрузка подзадач при монтировании
	useEffect(() => {
		setSubTasks(initialSubTasks);
	}, [taskId, initialSubTasks]);

	// Фокус на поле ввода при монтировании

	// Сортировка подзадач: невыполненные сверху, выполненные снизу
	const sortedSubTasks = [...subTasks].sort((a, b) => {
		// Сначала сортируем по статусу выполнения
		if (a.completed !== b.completed) {
			return a.completed ? 1 : -1; // Невыполненные сверху
		}

		// Затем по приоритету
		const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
		if (a.priority !== b.priority) {
			return priorityOrder[a.priority] - priorityOrder[b.priority];
		}

		// И, наконец, по дате создания (новые сверху)
		return (
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	});

	// Обработчик создания новой подзадачи
	const handleAddSubTask = async () => {
		if (!newSubTaskTitle.trim()) return;

		try {
			// setLoading(true);
			const newSubTask = {
				taskId,
				title: newSubTaskTitle,
				status: 'TODO',
				priority: Priority.LOW,
				email: user ? user.email : '',
				emailAssigns: [],
			};

			// setSubTasks(prev => [...prev, newSubTask]);
			setNewSubTaskTitle('');

			// Вызываем callback для обновления родительского компонента
			await onSubTaskCreate(newSubTask);

			// Фокус на поле ввода после добавления
			// if (inputRef.current) {
			// 	inputRef.current.focus();
			// }
		} catch (error) {
			console.error('Error creating subtask:', error);
			message.error('Не удалось создать подзадачу');
		}
	};

	// Обработчик нажатия Enter при вводе
	const handleKeyPress = (e: { key: string }) => {
		if (e.key === 'Enter') {
			handleAddSubTask();
		}
	};

	// Обработчик отметки выполнения подзадачи
	const handleToggleComplete = async (subTaskId: string) => {
		try {
			// await toggleSubTaskCompletion(subTaskId, completed);

			const subTask = subTasks.find(
				(subTask) => subTask.id === subTaskId,
			);
			// Обновляем локальное состояние
			if (!subTask) {
				return;
			}

			const updateData: IParamsUpdateSubTask = {
				subTaskId: subTask.id,
				completed: !subTask.completed,
				completedAt: !subTask.completed ? new Date() : null,
				endDate: !subTask.completed ? new Date() : null,
				status: !subTask.completed ? Status.DONE : Status.IN_PROGRESS,
				tags: subTask.tags.map((t: ITag) => t.id),
				emailAssigns: subTask.assignees.map((t: IUser) => t.email),
			};

			await updateSubTask(updateData);
			// Вызываем callback для обновления родительского компонента
		} catch (error) {
			console.error('Error toggling subtask completion:', error);
			message.error('Не удалось обновить статус подзадачи');
		}
	};

	// Обработчик удаления подзадачи
	const handleDeleteSubTask = async (subTaskId: string) => {
		await onSubTaskDelete({
			subTaskId,
			email: user ? user.email : '',
		});

		message.success('Подзадача удалена');
	};

	// Открытие модального окна для редактирования
	const handleEditSubTask = (subTask: ISubTask) => {
		setEditingSubTask(subTask);
		setSelectedTags(subTask.tags || []);
		setSelectedAssignees(subTask.assignees || []);

		form.setFieldsValue({
			title: subTask.title,
			description: subTask.description,
			priority: subTask.priority,
			status: subTask.status,
			dateRange:
				subTask.startDate || subTask.endDate ?
					[
						subTask.startDate ? dayjs(subTask.startDate) : null,
						subTask.endDate ? dayjs(subTask.endDate) : null,
					]
				:	null,
		});

		setModalVisible(true);
	};

	// Сохранение изменений подзадачи
	const handleSaveSubTask = async () => {
		try {
			const values = await form.validateFields();

			if (editingSubTask) {
				const subTaskData = {
					subTaskId: editingSubTask.id,
					title: values.title,
					description: values.description,
					priority: values.priority,
					status: values.status,
					// startDate: values.dateRange?.[0]?.toISOString() || null,
					// endDate: values.dateRange?.[1]?.toISOString() || null,
					tags: selectedTags.map((tag) => tag.id),
					emailAssigns: selectedAssignees.map((user) => user.email),
				};

				await updateSubTask(subTaskData);

				setModalVisible(false);
				message.success('Подзадача обновлена');
			}
			// Подготовка данных для API
		} catch (error) {
			console.error('Error updating subtask:', error);
			message.error('Не удалось обновить подзадачу');
		}
	};

	// Обработчик развертывания/свертывания подзадачи
	const handleExpandSubTask = (subTaskId: string) => {
		setExpandedSubTask(expandedSubTask === subTaskId ? null : subTaskId);
		setActiveTab('details');
	};

	// Получение цвета приоритета
	const getPriorityColor = (priority: string) => {
		const priorityMap: IKeyString<string> = {
			LOW: 'green',
			MEDIUM: 'blue',
			HIGH: 'orange',
			URGENT: 'red',
		};

		return priorityMap[priority] || 'default';
	};

	// Получение цвета статуса
	const getStatusColor = (status: string) => {
		const statusMap: IKeyString<string> = {
			TODO: 'default',
			IN_PROGRESS: 'processing',
			REVIEW: 'warning',
			DONE: 'success',
			ARCHIVED: 'default',
		};

		return statusMap[status] || 'default';
	};

	// Получение текста статуса
	const getStatusText = (status: string) => {
		const statusMap: IKeyString<string> = {
			TODO: 'К выполнению',
			IN_PROGRESS: 'В процессе',
			REVIEW: 'На проверке',
			DONE: 'Выполнено',
			ARCHIVED: 'Архив',
		};

		return statusMap[status] || status;
	};

	// Получение текста приоритета
	const getPriorityText = (priority: string) => {
		const priorityMap: IKeyString<string> = {
			LOW: 'Низкий',
			MEDIUM: 'Средний',
			HIGH: 'Высокий',
			URGENT: 'Срочный',
		};

		return priorityMap[priority] || priority;
	};

	// Форматирование даты
	const formatDate = (date: string | null | undefined | Date) => {
		if (!date) return null;
		return dayjs(date).format('DD.MM.YYYY');
	};

	return (
		<div className={styles.subTasksContainer}>
			{sortedSubTasks.length === 0 ?
				<div className={styles.loadingContainer}>
					<Spin size='small' />
					<Text type='secondary'>Загрузка подзадач...</Text>
				</div>
			:	<>
					<List
						className={styles.subTasksList}
						dataSource={sortedSubTasks}
						locale={{
							emptyText: (
								<Empty
									description='Нет подзадач'
									image={Empty.PRESENTED_IMAGE_SIMPLE}
								/>
							),
						}}
						renderItem={(subTask) => (
							<>
								<List.Item
									className={`${styles.subTaskItem} ${subTask.completed ? styles.completedSubTask : ''}`}
									actions={[
										showComments && (
											<Button
												type='text'
												icon={<CommentOutlined />}
												onClick={() => {
													handleExpandSubTask(
														subTask.id,
													);
													setActiveTab('comments');
												}}
												className={styles.subTaskAction}
												title='Комментарии'
											>
												{subTask.comments?.length >
													0 && (
													<Badge
														count={
															subTask.comments
																.length
														}
														size='small'
														offset={[3, -3]}
													/>
												)}
											</Button>
										),
										<Dropdown
											overlay={
												<Menu
													items={[
														{
															key: 'edit',
															label: 'Редактировать',
															icon: (
																<EditOutlined />
															),
															onClick: () => {
																handleEditSubTask(
																	subTask,
																);
															},
														},
														{
															key: 'delete',
															label: 'Удалить',
															icon: (
																<DeleteOutlined />
															),
															danger: true,
															onClick: () =>
																handleDeleteSubTask(
																	subTask.id,
																),
														},
													]}
												/>
											}
											trigger={['click']}
										>
											<Button
												type='text'
												icon={<MoreOutlined />}
												className={
													styles.subTaskActionButton
												}
												onClick={(e) =>
													e.stopPropagation()
												}
											/>
										</Dropdown>,
									]}
								>
									<div className={styles.subTaskContent}>
										<Checkbox
											checked={subTask.completed}
											onChange={(e) => {
												e.stopPropagation();
												handleToggleComplete(
													subTask.id,
												);
											}}
											onClick={(e) => e.stopPropagation()}
										/>
										<div className={styles.subTaskInfo}>
											<Text
												strong
												className={
													subTask.completed ?
														styles.completedText
													:	''
												}
											>
												{subTask.title}
											</Text>

											<div className={styles.subTaskMeta}>
												{subTask.tags &&
													subTask.tags.length > 0 && (
														<Space
															size={[0, 4]}
															wrap
															className={
																styles.subTaskTags
															}
														>
															{subTask.tags
																.slice(0, 2)
																.map((tag) => (
																	<Tooltip
																		title={
																			tag.name
																		}
																		key={
																			tag.id
																		}
																	>
																		<div
																			className={
																				styles.tagDot
																			}
																			style={{
																				backgroundColor:
																					tag.color,
																			}}
																		/>
																	</Tooltip>
																))}
															{subTask.tags
																.length > 2 && (
																<Tooltip
																	title={subTask.tags
																		.slice(
																			2,
																		)
																		.map(
																			(
																				tag,
																			) =>
																				tag.name,
																		)
																		.join(
																			', ',
																		)}
																>
																	<Text
																		type='secondary'
																		className={
																			styles.tagMore
																		}
																	>
																		+
																		{subTask
																			.tags
																			.length -
																			2}
																	</Text>
																</Tooltip>
															)}
														</Space>
													)}

												{subTask.assignees &&
													subTask.assignees.length >
														0 && (
														<Avatar.Group
															maxCount={2}
															size='small'
															className={
																styles.subTaskAssignees
															}
														>
															{subTask.assignees.map(
																(user) => (
																	<Tooltip
																		title={
																			user.name
																		}
																		key={
																			user.id
																		}
																	>
																		<UserAvatar
																			size='small'
																			name={
																				user.name ||
																				''
																			}
																			email={
																				user.email
																			}
																			avatar={
																				user.image ||
																				''
																			}
																		/>
																	</Tooltip>
																),
															)}
														</Avatar.Group>
													)}

												{(subTask.startDate ||
													subTask.endDate) && (
													<Text
														type='secondary'
														className={
															styles.subTaskDates
														}
													>
														{formatDate(
															subTask.startDate,
														)}{' '}
														-{' '}
														{formatDate(
															subTask.endDate,
														)}
													</Text>
												)}

												<Tag
													color={getPriorityColor(
														subTask.priority,
													)}
												>
													{getPriorityText(
														subTask.priority,
													)}
												</Tag>

												<Tag
													color={getStatusColor(
														subTask.status,
													)}
												>
													{getStatusText(
														subTask.status,
													)}
												</Tag>
											</div>
										</div>
									</div>
								</List.Item>

								{/* Развернутая информация о подзадаче */}
								{expandedSubTask === subTask.id && (
									<div className={styles.expandedSubTask}>
										<Tabs
											activeKey={activeTab}
											onChange={setActiveTab}
										>
											<TabPane tab='Детали' key='details'>
												{subTask.description ?
													<Paragraph>
														{subTask.description}
													</Paragraph>
												:	<Text type='secondary' italic>
														Нет описания
													</Text>
												}

												<div
													className={
														styles.subTaskDetails
													}
												>
													<div>
														<Text type='secondary'>
															Статус:
														</Text>
														<Tag
															color={getStatusColor(
																subTask.status,
															)}
														>
															{getStatusText(
																subTask.status,
															)}
														</Tag>
													</div>
													<div>
														<Text type='secondary'>
															Приоритет:
														</Text>
														<Tag
															color={getPriorityColor(
																subTask.priority,
															)}
														>
															{getPriorityText(
																subTask.priority,
															)}
														</Tag>
													</div>
													{(subTask.startDate ||
														subTask.endDate) && (
														<div>
															<Text type='secondary'>
																Срок:
															</Text>
															<Text>
																{formatDate(
																	subTask.startDate,
																)}{' '}
																-{' '}
																{formatDate(
																	subTask.endDate,
																)}
															</Text>
														</div>
													)}
													{subTask.author && (
														<div>
															<Text type='secondary'>
																Автор:
															</Text>
															<div
																className={
																	styles.authorInfo
																}
															>
																<UserAvatar
																	size='small'
																	name={
																		subTask
																			.author
																			.name ||
																		''
																	}
																	email={
																		subTask
																			.author
																			.email
																	}
																	avatar={
																		subTask
																			.author
																			.image ||
																		''
																	}
																/>
																<Text>
																	{
																		subTask
																			.author
																			.name
																	}
																</Text>
															</div>
														</div>
													)}
												</div>
											</TabPane>

											{showComments && (
												<TabPane
													tab='Комментарии'
													key='comments'
												>
													<TaskComments
														taskId={taskId}
														subTaskId={subTask.id}
														initialComments={
															subTask.comments ||
															[]
														}
														onCommentCreate={(
															newComment,
														) => {
															// Обновляем список комментариев в подзадаче
															const updatedSubTask =
																{
																	...subTask,
																	comments: [
																		...(subTask.comments ||
																			[]),
																		newComment,
																	],
																};

															// Обновляем локальное состояние
															setSubTasks(
																(prev) =>
																	prev.map(
																		(
																			item,
																		) =>
																			(
																				item.id ===
																				subTask.id
																			) ?
																				updatedSubTask
																			:	item,
																	),
															);

															if (
																onSubTaskUpdate
															) {
																onSubTaskUpdate(
																	updatedSubTask,
																);
															}
														}}
														onCommentUpdate={(
															updatedComment,
														) => {
															// Обновляем комментарий в подзадаче
															const updatedSubTask =
																{
																	...subTask,
																	comments: (
																		subTask.comments ||
																		[]
																	).map(
																		(c) =>
																			(
																				c.id ===
																				updatedComment.id
																			) ?
																				updatedComment
																			:	c,
																	),
																};

															// Обновляем локальное состояние
															setSubTasks(
																(prev) =>
																	prev.map(
																		(
																			item,
																		) =>
																			(
																				item.id ===
																				subTask.id
																			) ?
																				updatedSubTask
																			:	item,
																	),
															);

															if (
																onSubTaskUpdate
															) {
																onSubTaskUpdate(
																	updatedSubTask,
																);
															}
														}}
														onCommentDelete={(
															commentId,
														) => {
															// Удаляем комментарий из подзадачи
															const updatedSubTask =
																{
																	...subTask,
																	comments: (
																		subTask.comments ||
																		[]
																	).filter(
																		(c) =>
																			c.id !==
																			commentId,
																	),
																};

															// Обновляем локальное состояние
															setSubTasks(
																(prev) =>
																	prev.map(
																		(
																			item,
																		) =>
																			(
																				item.id ===
																				subTask.id
																			) ?
																				updatedSubTask
																			:	item,
																	),
															);

															if (
																onSubTaskUpdate
															) {
																onSubTaskUpdate(
																	updatedSubTask,
																);
															}
														}}
													/>
												</TabPane>
											)}
										</Tabs>
									</div>
								)}
							</>
						)}
					/>

					<div className={styles.addSubTaskContainer}>
						<Input
							placeholder='Добавить новую подзадачу и нажать Enter'
							value={newSubTaskTitle}
							onChange={(e) => setNewSubTaskTitle(e.target.value)}
							onKeyPress={handleKeyPress}
							disabled={isPending || isPendingSubTask}
							suffix={
								<Button
									type='text'
									icon={<PlusOutlined />}
									onClick={handleAddSubTask}
									disabled={
										!newSubTaskTitle.trim() ||
										isPending ||
										isPendingSubTask
									}
								/>
							}
						/>
					</div>
				</>
			}

			{/* Модальное окно редактирования подзадачи */}
			<Modal
				title='Редактирование подзадачи'
				open={modalVisible}
				onOk={handleSaveSubTask}
				onCancel={() => setModalVisible(false)}
				width={700}
				okText='Сохранить'
				cancelText='Отмена'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='title'
						label='Название'
						rules={[
							{
								required: true,
								message: 'Введите название подзадачи',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='description' label='Описание'>
						<TextArea rows={4} />
					</Form.Item>

					<Form.Item name='status' label='Статус'>
						<Select>
							<Select.Option value='TODO'>
								К выполнению
							</Select.Option>
							<Select.Option value='IN_PROGRESS'>
								В процессе
							</Select.Option>
							<Select.Option value='REVIEW'>
								На проверке
							</Select.Option>
							<Select.Option value='DONE'>
								Выполнено
							</Select.Option>
							<Select.Option value='ARCHIVED'>
								Архив
							</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item name='priority' label='Приоритет'>
						<Select>
							<Select.Option value='LOW'>Низкий</Select.Option>
							<Select.Option value='MEDIUM'>
								Средний
							</Select.Option>
							<Select.Option value='HIGH'>Высокий</Select.Option>
							<Select.Option value='URGENT'>
								Срочный
							</Select.Option>
						</Select>
					</Form.Item>

					{/*<Form.Item name='dateRange' label='Период выполнения'>*/}
					{/*	<RangePicker*/}
					{/*		style={{ width: '100%' }}*/}
					{/*		placeholder={['Дата начала', 'Дата окончания']}*/}
					{/*	/>*/}
					{/*</Form.Item>*/}

					<Form.Item label='Теги'>
						<Text type='secondary'>
							Выбрано тегов: {selectedTags.length}
						</Text>
						<Select
							mode='multiple'
							placeholder='Выберите теги'
							style={{ width: '100%' }}
							value={selectedTags.map((tag) => tag.id)}
							onChange={(values) => {
								// Преобразуем ID обратно в объекты тегов
								if (editingSubTask) {
									const tags = values
										.map((id) => {
											const existingTag =
												editingSubTask.tags?.find(
													(t) => t.id === id,
												);
											return existingTag;
										})
										.filter((tag) => !!tag);
									setSelectedTags(tags);
								}
							}}
							optionLabelProp='label'
						>
							{taskTags?.map((tag: ITag) => (
								<Select.Option
									key={tag.id}
									value={tag.id}
									label={tag.name}
								>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<div
											style={{
												width: 14,
												height: 14,
												borderRadius: '50%',
												backgroundColor: tag.color,
												marginRight: 8,
											}}
										/>
										<span>{tag.name}</span>
									</div>
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Исполнители'>
						<Text type='secondary'>
							Выбрано исполнителей: {selectedAssignees.length}
						</Text>
						<Select
							mode='multiple'
							placeholder='Выберите исполнителей'
							style={{ width: '100%' }}
							value={selectedAssignees.map((user) => user.email)}
							onChange={(values: string[]) => {
								// Преобразуем ID обратно в объекты пользователей

								if (!team) {
									return;
								}
								const _users: IUser[] = team.members.filter(
									(user: IUser) => {
										const found = values.find(
											(t: string) => t === user.email,
										);
										if (!found) {
											return false;
										}
										return true;
									},
								);
								setSelectedAssignees(_users);
							}}
							optionLabelProp='label'
						>
							{team?.members?.map((user) => (
								<Select.Option
									key={user.id}
									value={user.email}
									label={user.name}
								>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<UserAvatar
											size='small'
											name={user.name || ''}
											email={user.email}
											avatar={user.image || undefined}
											style={{ marginRight: 8 }}
										/>
										<span>{user.name || user.email}</span>
									</div>
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default SubTaskList;
