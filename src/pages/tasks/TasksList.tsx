// src/pages/tasks/TasksList.tsx
import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	Card,
	Button,
	Input,
	Space,
	Tag,
	Dropdown,
	Menu,
	Typography,
	Row,
	Col,
	Select,
	DatePicker,
	Badge,
	Avatar,
	Tooltip,
	Tabs,
	Empty,
	Spin,
	Segmented,
	Popover,
} from 'antd';
import {
	PlusOutlined,
	FilterOutlined,
	SearchOutlined,
	CalendarOutlined,
	UnorderedListOutlined,
	AppstoreOutlined,
	SortAscendingOutlined,
	MoreOutlined,
	FileExcelOutlined,
	UserOutlined,
	TagOutlined,
	ClockCircleOutlined,
	CheckOutlined,
} from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import { useTasks } from '../../hooks/useTasks';
import TaskStatusDropdown from '../../components/tasks/TaskStatusDropdown';
import TaskPrioritySelector from '../../components/tasks/TaskPrioritySelector';

import styles from './TasksStyles.module.css';
import dayjs from 'dayjs';
import TaskTags from '../../components/tasks/TaskTags.tsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TasksList: FC = () => {
	const navigate = useNavigate();
	const { generalStore } = useGeneralStore();
	const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState({
		status: [] as string[],
		priority: [] as string[],
		tags: [] as string[],
		assignees: [] as string[],
		dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
	});

	// Используем хук для получения задач
	const { data: tasksData, isLoading, isError, fetchTasks } = useTasks();

	// Обработчик создания новой задачи
	const handleCreateTask = () => {
		navigate('/admin/tasks/create');
	};

	// Обработчик переключения статуса задачи
	const handleStatusChange = async (taskId: string, newStatus: string) => {
		// Здесь будет логика обновления статуса задачи
		console.log('Изменение статуса задачи:', taskId, newStatus);
	};

	// Обработчик переключения приоритета задачи
	const handlePriorityChange = async (
		taskId: string,
		newPriority: string,
	) => {
		// Здесь будет логика обновления приоритета задачи
		console.log('Изменение приоритета задачи:', taskId, newPriority);
	};

	// Форматирование даты
	const formatDate = (date: string | null | undefined) => {
		if (!date) return '-';
		return dayjs(date).format('DD.MM.YYYY');
	};

	// Получение статуса в виде компонента Tag
	const getStatusTag = (status: string) => {
		const statusMap = {
			TODO: { color: 'default', text: 'К выполнению' },
			IN_PROGRESS: { color: 'processing', text: 'В процессе' },
			REVIEW: { color: 'warning', text: 'На проверке' },
			DONE: { color: 'success', text: 'Выполнено' },
			ARCHIVED: { color: 'default', text: 'Архив' },
		};

		const { color, text } = statusMap[status] || {
			color: 'default',
			text: status,
		};

		return <Tag color={color}>{text}</Tag>;
	};

	// Получение приоритета в виде компонента Tag
	const getPriorityTag = (priority: string) => {
		const priorityMap = {
			LOW: { color: 'green', text: 'Низкий' },
			MEDIUM: { color: 'blue', text: 'Средний' },
			HIGH: { color: 'orange', text: 'Высокий' },
			URGENT: { color: 'red', text: 'Срочный' },
		};

		const { color, text } = priorityMap[priority] || {
			color: 'default',
			text: priority,
		};

		return <Tag color={color}>{text}</Tag>;
	};

	// Определение колонок для таблицы
	const columns = [
		{
			title: 'Название',
			dataIndex: 'title',
			key: 'title',
			render: (text: string, record: any) => (
				<div className={styles.taskTitleCell}>
					<Text
						strong
						ellipsis={{ tooltip: text }}
						className={styles.taskTitle}
						onClick={() => navigate(`/admin/tasks/${record.id}`)}
					>
						{text}
					</Text>
					{record.subTasks?.length > 0 && (
						<Badge
							count={record.subTasks.length}
							size='small'
							className={styles.subTaskBadge}
						/>
					)}
				</div>
			),
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (status: string, record: any) => (
				<TaskStatusDropdown
					value={status}
					onChange={(newStatus) =>
						handleStatusChange(record.id, newStatus)
					}
				/>
			),
			width: 150,
		},
		{
			title: 'Приоритет',
			dataIndex: 'priority',
			key: 'priority',
			render: (priority: string, record: any) => (
				<TaskPrioritySelector
					value={priority}
					onChange={(newPriority) =>
						handlePriorityChange(record.id, newPriority)
					}
				/>
			),
			width: 130,
		},
		{
			title: 'Теги',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: any[]) => <TaskTags tags={tags} maxDisplay={2} />,
			width: 150,
		},
		{
			title: 'Исполнители',
			dataIndex: 'assignees',
			key: 'assignees',
			render: (assignees: any[]) => (
				<Avatar.Group
					maxCount={3}
					maxStyle={{ color: '#EEEEEE', backgroundColor: '#76ABAE' }}
				>
					{assignees.map((user) => (
						<Tooltip title={user.name} key={user.id}>
							<Avatar
								src={user.avatar}
								icon={!user.avatar && <UserOutlined />}
							/>
						</Tooltip>
					))}
				</Avatar.Group>
			),
			width: 120,
		},
		{
			title: 'Сроки',
			key: 'dates',
			render: (_, record: any) => (
				<div className={styles.datesContainer}>
					<Text type='secondary'>
						{record.startDate ?
							<span>С {formatDate(record.startDate)}</span>
						:	<span>Не начата</span>}
					</Text>
					{record.endDate && (
						<Text type='secondary'>
							- {formatDate(record.endDate)}
						</Text>
					)}
				</div>
			),
			width: 180,
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_, record: any) => (
				<Dropdown
					overlay={
						<Menu
							items={[
								{
									key: 'edit',
									label: 'Редактировать',
									onClick: () =>
										navigate(
											`/admin/tasks/${record.id}/edit`,
										),
								},
								{
									key: 'startTask',
									label:
										record.startDate ? 'Завершить' : (
											'Начать'
										),
									icon:
										record.startDate ?
											<CheckOutlined />
										:	<ClockCircleOutlined />,
									onClick: () =>
										console.log('Start/complete task'),
								},
								{
									key: 'divider1',
									type: 'divider',
								},
								{
									key: 'delete',
									label: 'Удалить',
									danger: true,
									onClick: () => console.log('Delete task'),
								},
							]}
						/>
					}
					trigger={['click']}
				>
					<Button
						type='text'
						icon={<MoreOutlined />}
						className={styles.actionButton}
					/>
				</Dropdown>
			),
			width: 80,
		},
	];

	// Фильтрация задач на основе параметров поиска и фильтров
	const getFilteredTasks = () => {
		if (!tasksData?.tasks) return [];

		return tasksData?.tasks?.filter((task) => {
			// Фильтрация по поисковому запросу
			if (
				searchText &&
				!task.title.toLowerCase().includes(searchText.toLowerCase())
			) {
				return false;
			}

			// Фильтрация по статусу
			if (
				filters.status.length > 0 &&
				!filters.status.includes(task.status)
			) {
				return false;
			}

			// Фильтрация по приоритету
			if (
				filters.priority.length > 0 &&
				!filters.priority.includes(task.priority)
			) {
				return false;
			}

			// Фильтрация по тегам
			if (
				filters.tags.length > 0 &&
				!task.tags.some((tag) => filters.tags.includes(tag.id))
			) {
				return false;
			}

			// Фильтрация по исполнителям
			if (
				filters.assignees.length > 0 &&
				!task.assignees.some((user) =>
					filters.assignees.includes(user.id),
				)
			) {
				return false;
			}

			// Фильтрация по диапазону дат
			if (filters.dateRange) {
				const [startDate, endDate] = filters.dateRange;
				const taskStartDate =
					task.startDate ? dayjs(task.startDate) : null;
				const taskEndDate = task.endDate ? dayjs(task.endDate) : null;

				if (taskStartDate && taskEndDate) {
					return (
						(taskStartDate.isAfter(startDate) ||
							taskStartDate.isSame(startDate)) &&
						(taskEndDate.isBefore(endDate) ||
							taskEndDate.isSame(endDate))
					);
				} else if (taskStartDate) {
					return (
						taskStartDate.isAfter(startDate) ||
						taskStartDate.isSame(startDate)
					);
				} else if (taskEndDate) {
					return (
						taskEndDate.isBefore(endDate) ||
						taskEndDate.isSame(endDate)
					);
				} else {
					return false;
				}
			}

			return true;
		});
	};

	// Кнопка сброса фильтров
	const handleResetFilters = () => {
		setFilters({
			status: [],
			priority: [],
			tags: [],
			assignees: [],
			dateRange: null,
		});
		setSearchText('');
	};

	// Компонент с фильтрами
	const filtersContent = (
		<div className={styles.filtersPopover}>
			<Typography.Title level={5}>Фильтры</Typography.Title>

			<div className={styles.filterGroup}>
				<label>Статус</label>
				<Select
					mode='multiple'
					allowClear
					style={{ width: '100%' }}
					placeholder='Выберите статус'
					value={filters.status}
					onChange={(values) =>
						setFilters({ ...filters, status: values })
					}
				>
					<Option value='TODO'>К выполнению</Option>
					<Option value='IN_PROGRESS'>В процессе</Option>
					<Option value='REVIEW'>На проверке</Option>
					<Option value='DONE'>Выполнено</Option>
					<Option value='ARCHIVED'>Архив</Option>
				</Select>
			</div>

			<div className={styles.filterGroup}>
				<label>Приоритет</label>
				<Select
					mode='multiple'
					allowClear
					style={{ width: '100%' }}
					placeholder='Выберите приоритет'
					value={filters.priority}
					onChange={(values) =>
						setFilters({ ...filters, priority: values })
					}
				>
					<Option value='LOW'>Низкий</Option>
					<Option value='MEDIUM'>Средний</Option>
					<Option value='HIGH'>Высокий</Option>
					<Option value='URGENT'>Срочный</Option>
				</Select>
			</div>

			<div className={styles.filterGroup}>
				<label>Теги</label>
				<Select
					mode='multiple'
					allowClear
					style={{ width: '100%' }}
					placeholder='Выберите теги'
					value={filters.tags}
					onChange={(values) =>
						setFilters({ ...filters, tags: values })
					}
					optionLabelProp='label'
				>
					{tasksData?.tags?.map((tag) => (
						<Option key={tag.id} value={tag.id} label={tag.name}>
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
						</Option>
					))}
				</Select>
			</div>

			<div className={styles.filterGroup}>
				<label>Исполнители</label>
				<Select
					mode='multiple'
					allowClear
					style={{ width: '100%' }}
					placeholder='Выберите исполнителей'
					value={filters.assignees}
					onChange={(values) =>
						setFilters({ ...filters, assignees: values })
					}
					optionLabelProp='label'
				>
					{generalStore.team?.members?.map((user) => (
						<Option key={user.id} value={user.id} label={user.name}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<Avatar
									size='small'
									src={user.avatar}
									icon={!user.avatar && <UserOutlined />}
									style={{ marginRight: 8 }}
								/>
								<span>{user.name}</span>
							</div>
						</Option>
					))}
				</Select>
			</div>

			<div className={styles.filterGroup}>
				<label>Период</label>
				<RangePicker
					style={{ width: '100%' }}
					onChange={(dates) =>
						setFilters({
							...filters,
							dateRange: dates as
								| [dayjs.Dayjs, dayjs.Dayjs]
								| null,
						})
					}
					value={filters.dateRange}
				/>
			</div>

			<div className={styles.filterActions}>
				<Button onClick={handleResetFilters}>Сбросить</Button>
				<Button type='primary'>Применить</Button>
			</div>
		</div>
	);

	// Функция рендеринга представления Канбан
	const renderKanbanBoard = () => {
		const filteredTasks = getFilteredTasks();
		const statusColumns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
		const statusTitles = {
			TODO: 'К выполнению',
			IN_PROGRESS: 'В процессе',
			REVIEW: 'На проверке',
			DONE: 'Выполнено',
		};

		return (
			<div className={styles.kanbanContainer}>
				<Row gutter={16} className={styles.kanbanRow}>
					{statusColumns.map((status) => {
						const statusTasks = filteredTasks.filter(
							(task) => task.status === status,
						);

						return (
							<Col
								key={status}
								xs={24}
								sm={12}
								lg={6}
								className={styles.kanbanCol}
							>
								<div className={styles.kanbanColumn}>
									<div className={styles.kanbanHeader}>
										<Text strong>
											{statusTitles[status]}
										</Text>
										<Badge
											count={statusTasks.length}
											style={{
												backgroundColor: '#76ABAE',
											}}
										/>
									</div>

									<div className={styles.kanbanTasks}>
										{statusTasks.map((task) => (
											<Card
												key={task.id}
												className={styles.taskCard}
												onClick={() =>
													navigate(
														`/admin/tasks/${task.id}`,
													)
												}
											>
												<div
													className={
														styles.taskCardHeader
													}
												>
													<Text
														strong
														ellipsis
														style={{
															maxWidth: '100%',
														}}
													>
														{task.title}
													</Text>
													{getPriorityTag(
														task.priority,
													)}
												</div>

												{task.description && (
													<Text
														type='secondary'
														ellipsis={{ rows: 2 }}
														className={
															styles.taskCardDescription
														}
													>
														{task.description}
													</Text>
												)}

												<div
													className={
														styles.taskCardFooter
													}
												>
													<div
														className={
															styles.taskCardTags
														}
													>
														<TaskTags
															tags={task.tags}
															maxDisplay={2}
														/>
													</div>

													<div
														className={
															styles.taskCardAssignees
														}
													>
														<Avatar.Group
															maxCount={2}
															size='small'
														>
															{task.assignees.map(
																(user) => (
																	<Tooltip
																		title={
																			user.name
																		}
																		key={
																			user.id
																		}
																	>
																		<Avatar
																			size='small'
																			src={
																				user.avatar
																			}
																			icon={
																				!user.avatar && (
																					<UserOutlined />
																				)
																			}
																		/>
																	</Tooltip>
																),
															)}
														</Avatar.Group>
													</div>
												</div>
											</Card>
										))}

										{statusTasks.length === 0 && (
											<div
												className={
													styles.emptyKanbanColumn
												}
											>
												<Text type='secondary'>
													Нет задач
												</Text>
											</div>
										)}

										{/* Кнопка добавления новой задачи в колонку */}
										<Button
											type='dashed'
											icon={<PlusOutlined />}
											className={styles.addTaskButton}
											onClick={() =>
												navigate(
													'/admin/tasks/create',
													{
														state: {
															defaultStatus:
																status,
														},
													},
												)
											}
										>
											Добавить задачу
										</Button>
									</div>
								</div>
							</Col>
						);
					})}
				</Row>
			</div>
		);
	};

	return (
		<div className={styles.tasksListPage}>
			<div className={styles.pageHeader}>
				<div>
					<Title level={2}>Задачи</Title>
					<Text type='secondary'>
						Управление задачами и подзадачами вашей команды
					</Text>
				</div>

				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={handleCreateTask}
				>
					Создать задачу
				</Button>
			</div>

			<Card className={styles.tasksCard}>
				<div className={styles.toolbarContainer}>
					<div className={styles.searchContainer}>
						<Input
							placeholder='Поиск задач'
							prefix={<SearchOutlined />}
							allowClear
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							className={styles.searchInput}
						/>

						<Popover
							content={filtersContent}
							title={null}
							trigger='click'
							placement='bottomRight'
							overlayClassName={styles.filtersPopoverOverlay}
						>
							<Button icon={<FilterOutlined />}>
								Фильтры
								{Object.values(filters).some((f) =>
									Array.isArray(f) ?
										f.length > 0
									:	f !== null,
								) && <Badge dot style={{ marginLeft: 5 }} />}
							</Button>
						</Popover>

						<Segmented
							options={[
								{
									value: 'table',
									icon: <UnorderedListOutlined />,
								},
								{
									value: 'kanban',
									icon: <AppstoreOutlined />,
								},
							]}
							value={viewMode}
							onChange={(value) =>
								setViewMode(value as 'table' | 'kanban')
							}
						/>
					</div>

					<div className={styles.rightToolbar}>
						<Tooltip title='Экспорт в Excel'>
							<Button icon={<FileExcelOutlined />} />
						</Tooltip>

						<Dropdown
							overlay={
								<Menu
									items={[
										{
											key: 'nameAsc',
											label: 'По названию (А-Я)',
										},
										{
											key: 'nameDesc',
											label: 'По названию (Я-А)',
										},
										{
											key: 'dateAsc',
											label: 'По дате создания (старые)',
										},
										{
											key: 'dateDesc',
											label: 'По дате создания (новые)',
										},
										{
											key: 'priorityAsc',
											label: 'По приоритету (возр.)',
										},
										{
											key: 'priorityDesc',
											label: 'По приоритету (убыв.)',
										},
									]}
								/>
							}
							trigger={['click']}
						>
							<Button icon={<SortAscendingOutlined />}>
								Сортировка
							</Button>
						</Dropdown>
					</div>
				</div>

				{isLoading ?
					<div className={styles.loadingContainer}>
						<Spin size='large' />
						<Text style={{ marginTop: 16 }}>Загрузка задач...</Text>
					</div>
				: isError ?
					<div className={styles.errorContainer}>
						<Empty
							description='Не удалось загрузить задачи. Попробуйте позже.'
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
						<Button type='primary' onClick={() => fetchTasks()}>
							Повторить
						</Button>
					</div>
				:	<>
						{viewMode === 'table' ?
							<Table
								dataSource={getFilteredTasks()}
								columns={columns}
								rowKey='id'
								pagination={{
									pageSize: 10,
									showSizeChanger: true,
									showTotal: (total) =>
										`Всего ${total} задач`,
								}}
								className={styles.tasksTable}
								locale={{
									emptyText: (
										<Empty
											description='Нет задач'
											image={Empty.PRESENTED_IMAGE_SIMPLE}
										/>
									),
								}}
							/>
						:	renderKanbanBoard()}
					</>
				}
			</Card>
		</div>
	);
};

export default TasksList;
