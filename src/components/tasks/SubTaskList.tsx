// src/components/tasks/SubTaskList.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
	List, Input, Button, Checkbox, Typography,
	Space, Dropdown, Menu, Tag, Tooltip, Avatar,
	Modal, Form, Select, DatePicker, message,
	Spin, Empty, Tabs, Badge
} from 'antd';
import {
	PlusOutlined, EditOutlined, DeleteOutlined,
	MoreOutlined, ExclamationCircleOutlined,
	UserOutlined, TagOutlined, MessageOutlined,
	ClockCircleOutlined, CommentOutlined
} from '@ant-design/icons';
import { useSubTasks } from '../../hooks/useSubTasks';
import { useTaskTags } from '../../hooks/useTaskTags';
import { useGeneralStore } from '../../store/useGeneralStore';
import TaskComments from './TaskComments';
import UserAvatar from '../common/UserAvatar';
import dayjs from 'dayjs';
import styles from '../../pages/tasks/TasksStyles.module.css';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface SubTaskListProps {
	taskId: string;
	initialSubTasks?: any[];
	onSubTaskUpdate?: (subTask: any) => void;
	onSubTaskCreate?: (subTask: any) => void;
	onSubTaskDelete?: (subTaskId: string) => void;
	showComments?: boolean; // Новый проп для отображения комментариев
}

const SubTaskList: React.FC<SubTaskListProps> = ({
													 taskId,
													 initialSubTasks = [],
													 onSubTaskUpdate,
													 onSubTaskCreate,
													 onSubTaskDelete,
													 showComments = true, // По умолчанию показываем комментарии
												 }) => {
	const [subTasks, setSubTasks] = useState<any[]>(initialSubTasks);
	const [loading, setLoading] = useState(false);
	const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
	const [editingSubTask, setEditingSubTask] = useState<any>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedTags, setSelectedTags] = useState<any[]>([]);
	const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);
	const [expandedSubTask, setExpandedSubTask] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<string>('details');
	const [form] = Form.useForm();
	const inputRef = useRef<any>(null);

	const { generalStore } = useGeneralStore();
	const {
		getSubTasks,
		createSubTask,
		updateSubTask,
		deleteSubTask,
		toggleSubTaskCompletion
	} = useSubTasks();
	const { getTags } = useTaskTags();

	// Загрузка подзадач при монтировании
	useEffect(() => {
		const fetchSubTasks = async () => {
			if (initialSubTasks.length === 0) {
				try {
					setLoading(true);
					const data = await getSubTasks(taskId);
					setSubTasks(data);
				} catch (error) {
					console.error('Error fetching subtasks:', error);
					message.error('Не удалось загрузить подзадачи');
				} finally {
					setLoading(false);
				}
			} else {
				setSubTasks(initialSubTasks);
			}
		};

		fetchSubTasks();
	}, [taskId, getSubTasks, initialSubTasks]);

	// Фокус на поле ввода при монтировании
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	// Сортировка подзадач: невыполненные сверху, выполненные снизу
	const sortedSubTasks = [...subTasks].sort((a, b) => {
		// Сначала сортируем по статусу выполнения
		if (a.completed !== b.completed) {
			return a.completed ? 1 : -1; // Невыполненные сверху
		}

		// Затем по приоритету
		const priorityOrder = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
		if (a.priority !== b.priority) {
			return priorityOrder[a.priority] - priorityOrder[b.priority];
		}

		// И, наконец, по дате создания (новые сверху)
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	// Обработчик создания новой подзадачи
	const handleAddSubTask = async () => {
		if (!newSubTaskTitle.trim()) return;

		try {
			setLoading(true);
			const newSubTask = await createSubTask({
				taskId,
				title: newSubTaskTitle,
				status: 'TODO',
				priority: 'MEDIUM',
			});

			setSubTasks(prev => [...prev, newSubTask]);
			setNewSubTaskTitle('');

			// Вызываем callback для обновления родительского компонента
			if (onSubTaskCreate) {
				onSubTaskCreate(newSubTask);
			}

			// Фокус на поле ввода после добавления
			if (inputRef.current) {
				inputRef.current.focus();
			}
		} catch (error) {
			console.error('Error creating subtask:', error);
			message.error('Не удалось создать подзадачу');
		} finally {
			setLoading(false);
		}
	};

	// Обработчик нажатия Enter при вводе
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleAddSubTask();
		}
	};

	// Обработчик отметки выполнения подзадачи
	const handleToggleComplete = async (subTaskId: string, completed: boolean) => {
		try {
			await toggleSubTaskCompletion(subTaskId, completed);

			// Обновляем локальное состояние
			setSubTasks(prev =>
				prev.map(item =>
					item.id === subTaskId ? { ...item, completed } : item
				)
			);

			// Вызываем callback для обновления родительского компонента
			if (onSubTaskUpdate) {
				const updatedSubTask = subTasks.find(item => item.id === subTaskId);
				if (updatedSubTask) {
					onSubTaskUpdate({ ...updatedSubTask, completed });
				}
			}
		} catch (error) {
			console.error('Error toggling subtask completion:', error);
			message.error('Не удалось обновить статус подзадачи');
		}
	};

	// Обработчик удаления подзадачи
	const handleDeleteSubTask = (subTaskId: string) => {
		confirm({
			title: 'Вы уверены, что хотите удалить эту подзадачу?',
			icon: <ExclamationCircleOutlined />,
			content: 'Это действие нельзя отменить.',
			okText: 'Да, удалить',
			okType: 'danger',
			cancelText: 'Отмена',
			async onOk() {
				try {
					await deleteSubTask(subTaskId);

					// Обновляем локальное состояние
					setSubTasks(prev => prev.filter(item => item.id !== subTaskId));

					// Вызываем callback для обновления родительского компонента
					if (onSubTaskDelete) {
						onSubTaskDelete(subTaskId);
					}

					message.success('Подзадача удалена');
				} catch (error) {
					console.error('Error deleting subtask:', error);
					message.error('Не удалось удалить подзадачу');
				}
			},
		});
	};

	// Открытие модального окна для редактирования
	const handleEditSubTask = (subTask: any) => {
		setEditingSubTask(subTask);
		setSelectedTags(subTask.tags || []);
		setSelectedAssignees(subTask.assignees || []);

		form.setFieldsValue({
			title: subTask.title,
			description: subTask.description,
			priority: subTask.priority,
			status: subTask.status,
			dateRange: subTask.startDate || subTask.endDate ? [
				subTask.startDate ? dayjs(subTask.startDate) : null,
				subTask.endDate ? dayjs(subTask.endDate) : null,
			] : null,
		});

		setModalVisible(true);
	};

	// Сохранение изменений подзадачи
	const handleSaveSubTask = async () => {
		try {
			const values = await form.validateFields();

			// Подготовка данных для API
			const subTaskData = {
				title: values.title,
				description: values.description,
				priority: values.priority,
				status: values.status,
				startDate: values.dateRange?.[0]?.toISOString() || null,
				endDate: values.dateRange?.[1]?.toISOString() || null,
				tagIds: selectedTags.map(tag => tag.id),
				assigneeIds: selectedAssignees.map(user => user.id),
			};

			const updatedSubTask = await updateSubTask(editingSubTask.id, subTaskData);

			// Обновляем локальное состояние
			setSubTasks(prev =>
				prev.map(item =>
					item.id === editingSubTask.id ? updatedSubTask : item
				)
			);

			// Вызываем callback для обновления родительского компонента
			if (onSubTaskUpdate) {
				onSubTaskUpdate(updatedSubTask);
			}

			setModalVisible(false);
			message.success('Подзадача обновлена');
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
		const priorityMap = {
			'LOW': 'green',
			'MEDIUM': 'blue',
			'HIGH': 'orange',
			'URGENT': 'red',
		};

		return priorityMap[priority] || 'default';
	};

	// Получение цвета статуса
	const getStatusColor = (status: string) => {
		const statusMap = {
			'TODO': 'default',
			'IN_PROGRESS': 'processing',
			'REVIEW': 'warning',
			'DONE': 'success',
			'ARCHIVED': 'default',
		};

		return statusMap[status] || 'default';
	};

	// Получение текста статуса
	const getStatusText = (status: string) => {
		const statusMap = {
			'TODO': 'К выполнению',
			'IN_PROGRESS': 'В процессе',
			'REVIEW': 'На проверке',
			'DONE': 'Выполнено',
			'ARCHIVED': 'Архив',
		};

		return statusMap[status] || status;
	};

	// Получение текста приоритета
	const getPriorityText = (priority: string) => {
		const priorityMap = {
			'LOW': 'Низкий',
			'MEDIUM': 'Средний',
			'HIGH': 'Высокий',
			'URGENT': 'Срочный',
		};

		return priorityMap[priority] || priority;
	};

	// Форматирование даты
	const formatDate = (date: string | null | undefined) => {
		if (!date) return null;
		return dayjs(date).format('DD.MM.YYYY');
	};

	return (
		<div className={styles.subTasksContainer}>
			{loading && sortedSubTasks.length === 0 ? (
				<div className={styles.loadingContainer}>
					<Spin size="small" />
					<Text type="secondary">Загрузка подзадач...</Text>
				</div>
			) : (
				<>
					<List
						className={styles.subTasksList}
						dataSource={sortedSubTasks}
						locale={{
							emptyText: <Empty description="Нет подзадач" image={Empty.PRESENTED_IMAGE_SIMPLE} />
						}}
						renderItem={(subTask) => (
							<>
								<List.Item
									className={`${styles.subTaskItem} ${subTask.completed ? styles.completedSubTask : ''}`}
									actions={[
										showComments && (
											<Button
												type="text"
												icon={<CommentOutlined />}
												onClick={(e) => {
													e.stopPropagation();
													handleExpandSubTask(subTask.id);
													setActiveTab('comments');
												}}
												className={styles.subTaskAction}
												title="Комментарии"
											>
												{subTask.comments?.length > 0 && (
													<Badge count={subTask.comments.length} size="small" offset={[3, -3]} />
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
															icon: <EditOutlined />,
															onClick: () => handleEditSubTask(subTask),
														},
														{
															key: 'delete',
															label: 'Удалить',
															icon: <DeleteOutlined />,
															danger: true,
															onClick: () => handleDeleteSubTask(subTask.id),
														},
													]}
												/>
											}
											trigger={['click']}
										>
											<Button
												type="text"
												icon={<MoreOutlined />}
												className={styles.subTaskActionButton}
												onClick={(e) => e.stopPropagation()}
											/>
										</Dropdown>
									]}
									onClick={() => handleExpandSubTask(subTask.id)}
								>
									<div className={styles.subTaskContent}>
										<Checkbox
											checked={subTask.completed}
											onChange={(e) => {
												e.stopPropagation();
												handleToggleComplete(subTask.id, e.target.checked);
											}}
											onClick={(e) => e.stopPropagation()}
										/>
										<div className={styles.subTaskInfo}>
											<Text
												strong
												className={subTask.completed ? styles.completedText : ''}
											>
												{subTask.title}
											</Text>

											<div className={styles.subTaskMeta}>
												{subTask.tags && subTask.tags.length > 0 && (
													<Space size={[0, 4]} wrap className={styles.subTaskTags}>
														{subTask.tags.slice(0, 2).map(tag => (
															<Tooltip title={tag.name} key={tag.id}>
																<div
																	className={styles.tagDot}
																	style={{ backgroundColor: tag.color }}
																/>
															</Tooltip>
														))}
														{subTask.tags.length > 2 && (
															<Tooltip
																title={subTask.tags.slice(2).map(tag => tag.name).join(', ')}
															>
																<Text type="secondary" className={styles.tagMore}>
																	+{subTask.tags.length - 2}
																</Text>
															</Tooltip>
														)}
													</Space>
												)}

												{subTask.assignees && subTask.assignees.length > 0 && (
													<Avatar.Group
														maxCount={2}
														size="small"
														className={styles.subTaskAssignees}
													>
														{subTask.assignees.map(user => (
															<Tooltip title={user.name} key={user.id}>
																<UserAvatar
																	size="small"
																	name={user.name}
																	email={user.email}
																	avatar={user.avatar}
																/>
															</Tooltip>
														))}
													</Avatar.Group>
												)}

												{(subTask.startDate || subTask.endDate) && (
													<Text type="secondary" className={styles.subTaskDates}>
														{formatDate(subTask.startDate)} - {formatDate(subTask.endDate)}
													</Text>
												)}

												<Tag color={getPriorityColor(subTask.priority)}>
													{getPriorityText(subTask.priority)}
												</Tag>

												<Tag color={getStatusColor(subTask.status)}>
													{getStatusText(subTask.status)}
												</Tag>
											</div>
										</div>
									</div>
								</List.Item>

								{/* Развернутая информация о подзадаче */}
								{expandedSubTask === subTask.id && (
									<div className={styles.expandedSubTask}>
										<Tabs activeKey={activeTab} onChange={setActiveTab}>
											<TabPane tab="Детали" key="details">
												{subTask.description ? (
													<Paragraph>{subTask.description}</Paragraph>
												) : (
													<Text type="secondary" italic>Нет описания</Text>
												)}

												<div className={styles.subTaskDetails}>
													<div>
														<Text type="secondary">Статус:</Text>
														<Tag color={getStatusColor(subTask.status)}>
															{getStatusText(subTask.status)}
														</Tag>
													</div>
													<div>
														<Text type="secondary">Приоритет:</Text>
														<Tag color={getPriorityColor(subTask.priority)}>
															{getPriorityText(subTask.priority)}
														</Tag>
													</div>
													{(subTask.startDate || subTask.endDate) && (
														<div>
															<Text type="secondary">Срок:</Text>
															<Text>{formatDate(subTask.startDate)} - {formatDate(subTask.endDate)}</Text>
														</div>
													)}
													{subTask.author && (
														<div>
															<Text type="secondary">Автор:</Text>
															<div className={styles.authorInfo}>
																<UserAvatar
																	size="small"
																	name={subTask.author.name}
																	email={subTask.author.email}
																	avatar={subTask.author.avatar}
																/>
																<Text>{subTask.author.name}</Text>
															</div>
														</div>
													)}
												</div>
											</TabPane>

											{showComments && (
												<TabPane tab="Комментарии" key="comments">
													<TaskComments
														taskId={taskId}
														subTaskId={subTask.id}
														initialComments={subTask.comments || []}
														onCommentCreate={(newComment) => {
															// Обновляем список комментариев в подзадаче
															const updatedSubTask = {
																...subTask,
																comments: [...(subTask.comments || []), newComment]
															};

															// Обновляем локальное состояние
															setSubTasks(prev =>
																prev.map(item =>
																	item.id === subTask.id ? updatedSubTask : item
																)
															);

															if (onSubTaskUpdate) {
																onSubTaskUpdate(updatedSubTask);
															}
														}}
														onCommentUpdate={(updatedComment) => {
															// Обновляем комментарий в подзадаче
															const updatedSubTask = {
																...subTask,
																comments: (subTask.comments || []).map(c =>
																	c.id === updatedComment.id ? updatedComment : c
																)
															};

															// Обновляем локальное состояние
															setSubTasks(prev =>
																prev.map(item =>
																	item.id === subTask.id ? updatedSubTask : item
																)
															);

															if (onSubTaskUpdate) {
																onSubTaskUpdate(updatedSubTask);
															}
														}}
														onCommentDelete={(commentId) => {
															// Удаляем комментарий из подзадачи
															const updatedSubTask = {
																...subTask,
																comments: (subTask.comments || []).filter(c => c.id !== commentId)
															};

															// Обновляем локальное состояние
															setSubTasks(prev =>
																prev.map(item =>
																	item.id === subTask.id ? updatedSubTask : item
																)
															);

															if (onSubTaskUpdate) {
																onSubTaskUpdate(updatedSubTask);
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
							ref={inputRef}
							placeholder="Добавить новую подзадачу и нажать Enter"
							value={newSubTaskTitle}
							onChange={(e) => setNewSubTaskTitle(e.target.value)}
							onKeyPress={handleKeyPress}
							disabled={loading}
							suffix={
								<Button
									type="text"
									icon={<PlusOutlined />}
									onClick={handleAddSubTask}
									disabled={!newSubTaskTitle.trim() || loading}
								/>
							}
						/>
					</div>
				</>
			)}

			{/* Модальное окно редактирования подзадачи */}
			<Modal
				title="Редактирование подзадачи"
				open={modalVisible}
				onOk={handleSaveSubTask}
				onCancel={() => setModalVisible(false)}
				width={700}
				okText="Сохранить"
				cancelText="Отмена"
			>
				<Form
					form={form}
					layout="vertical"
				>
					<Form.Item
						name="title"
						label="Название"
						rules={[{ required: true, message: 'Введите название подзадачи' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="description"
						label="Описание"
					>
						<TextArea rows={4} />
					</Form.Item>

					<Form.Item
						name="status"
						label="Статус"
					>
						<Select>
							<Select.Option value="TODO">К выполнению</Select.Option>
							<Select.Option value="IN_PROGRESS">В процессе</Select.Option>
							<Select.Option value="REVIEW">На проверке</Select.Option>
							<Select.Option value="DONE">Выполнено</Select.Option>
							<Select.Option value="ARCHIVED">Архив</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="priority"
						label="Приоритет"
					>
						<Select>
							<Select.Option value="LOW">Низкий</Select.Option>
							<Select.Option value="MEDIUM">Средний</Select.Option>
							<Select.Option value="HIGH">Высокий</Select.Option>
							<Select.Option value="URGENT">Срочный</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="dateRange"
						label="Период выполнения"
					>
						<RangePicker
							style={{ width: '100%' }}
							placeholder={['Дата начала', 'Дата окончания']}
						/>
					</Form.Item>

					<Form.Item
						label="Теги"
					>
						<Text type="secondary">Выбрано тегов: {selectedTags.length}</Text>
						<Select
							mode="multiple"
							placeholder="Выберите теги"
							style={{ width: '100%' }}
							value={selectedTags.map(tag => tag.id)}
							onChange={(values) => {
								// Преобразуем ID обратно в объекты тегов
								const tags = values.map(id => {
									const existingTag = editingSubTask.tags?.find(t => t.id === id);
									return existingTag || { id };
								});
								setSelectedTags(tags);
							}}
							optionLabelProp="label"
						>
							{editingSubTask?.tags?.map(tag => (
								<Select.Option key={tag.id} value={tag.id} label={tag.name}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div
											style={{
												width: 14,
												height: 14,
												borderRadius: '50%',
												backgroundColor: tag.color,
												marginRight: 8
											}}
										/>
										<span>{tag.name}</span>
									</div>
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label="Исполнители"
					>
						<Text type="secondary">Выбрано исполнителей: {selectedAssignees.length}</Text>
						<Select
							mode="multiple"
							placeholder="Выберите исполнителей"
							style={{ width: '100%' }}
							value={selectedAssignees.map(user => user.id)}
							onChange={(values) => {
								// Преобразуем ID обратно в объекты пользователей
								const users = values.map(id => {
									const existingUser = editingSubTask.assignees?.find(u => u.id === id);
									return existingUser || { id };
								});
								setSelectedAssignees(users);
							}}
							optionLabelProp="label"
						>
							{generalStore.team?.members?.map(user => (
								<Select.Option key={user.id} value={user.id} label={user.name}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<UserAvatar
											size="small"
											name={user.name}
											email={user.email}
											avatar={user.avatar}
											style={{ marginRight: 8 }}
										/>
										<span>{user.name}</span>
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