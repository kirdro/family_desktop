// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
	Row,
	Col,
	Card,
	Statistic,
	Typography,
	Table,
	Tag,
	Progress,
	Button,
	Divider,
	Spin,
	Empty,
	Skeleton,
	Avatar,
	Dropdown,
} from 'antd';
import {
	UserOutlined,
	TeamOutlined,
	ProjectOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	PlusOutlined,
	EllipsisOutlined,
	CalendarOutlined,
	FileTextOutlined,
	BellOutlined,
} from '@ant-design/icons';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Sector,
} from 'recharts';
import { useGeneralStore } from '../store/useGeneralStore';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru'; // Для русской локализации
import styles from './Dashboard.module.css';
import UserAvatar from '../components/common/UserAvatar.tsx';
import { ITask, IUser } from '../types';

// Расширяем функциональность dayjs
dayjs.extend(relativeTime);
dayjs.locale('ru'); // Установка русской локализации

const { Title, Text, Paragraph } = Typography;

// Типы данных для дашборда
interface DashboardData {
	stats: {
		totalTasks: number;
		completedTasks: number;
		pendingTasks: number;
		totalTeamMembers: number;
		taskCompletion: number;
		tasksThisWeek: number;
		tasksGrowth: number;
	};
	recentTasks: Array<{
		id: number;
		title: string;
		status: 'pending' | 'in_progress' | 'completed' | 'canceled';
		priority: 'low' | 'medium' | 'high';
		dueDate: string;
		assignedTo: {
			id: number;
			name: string;
			avatar?: string;
		};
	}>;
	activityLog: Array<{
		id: number;
		action: string;
		timestamp: string;
		user: {
			id: number;
			name: string;
			avatar?: string;
		};
		entityType: 'task' | 'team' | 'project' | 'user';
		entityId: number;
		entityName: string;
	}>;
	tasksByStatus: Array<{
		status: string;
		value: number;
	}>;
	tasksByPriority: Array<{
		priority: string;
		value: number;
		color: string;
	}>;
	taskCompletionHistory: Array<{
		date: string;
		completed: number;
		created: number;
	}>;
}

// Цвета для графиков
const COLORS = [
	'#76ABAE',
	'#52c41a',
	'#faad14',
	'#f5222d',
	'#1890ff',
	'#722ed1',
];

const Dashboard: React.FC = () => {
	const { generalStore, getGeneralStore } = useGeneralStore();
	const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>(
		'week',
	);

	const { team, tasks } = getGeneralStore();

	// Загрузка данных дашборда через React Query
	const { data, isLoading, error } = useQuery<DashboardData>({
		queryKey: ['dashboard', timeRange],
		queryFn: async () => {
			try {
				// В реальном приложении замените на реальный API
				// const response = await apiClient.get(`/dashboard?timeRange=${timeRange}`);
				// return response.data;

				// Для демонстрации используем моковые данные
				return getMockDashboardData(timeRange);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
				throw error;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 минут кеширования
	});

	// Определение типа роста (положительный или отрицательный)
	const isPositiveGrowth =
		data?.stats.tasksGrowth && data.stats.tasksGrowth >= 0;

	// Состояние для активного сегмента круговой диаграммы
	const [activePieIndex, setActivePieIndex] = useState(0);

	// Состояние для демонстрации загрузки компонентов
	const [isTasksLoading, setIsTasksLoading] = useState(true);
	useEffect(() => {
		// Имитация загрузки списка задач
		const timer = setTimeout(() => {
			setIsTasksLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	// Функция форматирования даты для отображения на графиках
	const formatDateForChart = (date: string) => {
		if (timeRange === 'week') {
			return dayjs(date).format('DD MMM');
		} else if (timeRange === 'month') {
			return dayjs(date).format('DD MMM');
		} else {
			return dayjs(date).format('MMM');
		}
	};

	// Функция для рендеринга активного сегмента в круговой диаграмме
	const renderActiveShape = (props) => {
		const RADIAN = Math.PI / 180;
		const {
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value,
		} = props;

		const sin = Math.sin(-RADIAN * midAngle);
		const cos = Math.cos(-RADIAN * midAngle);
		const sx = cx + (outerRadius + 10) * cos;
		const sy = cy + (outerRadius + 10) * sin;
		const mx = cx + (outerRadius + 30) * cos;
		const my = cy + (outerRadius + 30) * sin;
		const ex = mx + (cos >= 0 ? 1 : -1) * 22;
		const ey = my;
		const textAnchor = cos >= 0 ? 'start' : 'end';

		return (
			<g>
				<text x={cx} y={cy} dy={8} textAnchor='middle' fill='#EEEEEE'>
					{payload.status}
				</text>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={outerRadius + 6}
					outerRadius={outerRadius + 10}
					fill={fill}
				/>
				<path
					d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
					stroke={fill}
					fill='none'
				/>
				<circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					textAnchor={textAnchor}
					fill='#EEEEEE'
				>
					{`${value} задач`}
				</text>
				<text
					x={ex + (cos >= 0 ? 1 : -1) * 12}
					y={ey}
					dy={18}
					textAnchor={textAnchor}
					fill='#999'
				>
					{`(${(percent * 100).toFixed(2)}%)`}
				</text>
			</g>
		);
	};

	// Кастомный тултип для графиков
	const CustomTooltip = ({ active, payload, label, valuePrefix = '' }) => {
		if (active && payload && payload.length) {
			return (
				<div className={styles.customTooltip}>
					<p className={styles.tooltipLabel}>{label}</p>
					{payload.map((entry, index) => (
						<p key={`item-${index}`} style={{ color: entry.color }}>
							{entry.name}: {valuePrefix}
							{entry.value}
						</p>
					))}
				</div>
			);
		}

		return null;
	};

	// Получение статуса задачи для отображения
	const getStatusTag = (status: string) => {
		const statusMap = {
			pending: { color: 'gold', text: 'Ожидает' },
			in_progress: { color: 'blue', text: 'В работе' },
			completed: { color: 'green', text: 'Завершено' },
			canceled: { color: 'red', text: 'Отменено' },
		};

		const statusInfo = statusMap[status] || {
			color: 'default',
			text: status,
		};

		return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
	};

	// Получение приоритета задачи для отображения
	const getPriorityTag = (priority: string) => {
		const priorityMap = {
			low: { color: 'green', text: 'Низкий' },
			medium: { color: 'orange', text: 'Средний' },
			high: { color: 'red', text: 'Высокий' },
		};

		const priorityInfo = priorityMap[priority] || {
			color: 'default',
			text: priority,
		};

		return <Tag color={priorityInfo.color}>{priorityInfo.text}</Tag>;
	};

	// Функция форматирования даты
	const formatDate = (dateString: string) => {
		return dayjs(dateString).format('DD.MM.YYYY');
	};

	// Если данные загружаются
	if (isLoading) {
		return (
			<div className={styles.loadingContainer}>
				<Spin size='large' />
				<Text style={{ marginTop: 16 }}>
					Загрузка данных дашборда...
				</Text>
			</div>
		);
	}

	// Если произошла ошибка
	if (error) {
		return (
			<div className={styles.errorContainer}>
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description='Не удалось загрузить данные дашборда'
				/>
				<Button type='primary' onClick={() => window.location.reload()}>
					Попробовать снова
				</Button>
			</div>
		);
	}

	return (
		<div className={styles.dashboardContainer}>
			{/* Заголовок и приветствие */}
			<div className={styles.welcomeSection}>
				<div>
					<Title level={2}>
						Добро пожаловать,{' '}
						{generalStore.user?.name || generalStore.user?.email}!
					</Title>
					<Paragraph type='secondary'>
						Обзор активности и статистика вашей команды
					</Paragraph>
				</div>
				<div className={styles.dateInfo}>
					<CalendarOutlined style={{ marginRight: 8 }} />
					<Text>{dayjs().format('DD MMMM YYYY')}</Text>
				</div>
			</div>

			{/* Статистические карточки */}
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={6}>
					<Card bordered={false} className={styles.statCard}>
						<Statistic
							title='Всего задач'
							value={tasks.length || 0}
							prefix={<ProjectOutlined />}
							valueStyle={{ color: '#76ABAE' }}
						/>
						<div className={styles.growthIndicator}>
							<Text
								type={isPositiveGrowth ? 'success' : 'danger'}
							>
								{isPositiveGrowth ?
									<ArrowUpOutlined />
								:	<ArrowDownOutlined />}
								{Math.abs(data?.stats.tasksGrowth || 0)}%
							</Text>
							<Text type='secondary' style={{ marginLeft: 8 }}>
								с прошлого{' '}
								{timeRange === 'week' ?
									'недели'
								: timeRange === 'month' ?
									'месяца'
								:	'года'}
							</Text>
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card bordered={false} className={styles.statCard}>
						<Statistic
							title='Выполнено задач'
							value={
								tasks.filter((item) => item.completed).length ||
								0
							}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
						<Progress
							percent={
								Math.round(
									(tasks.filter((item) => item.completed)
										.length /
										tasks.length) *
										100,
								) || 0
							}
							size='small'
							status='active'
							showInfo={false}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card bordered={false} className={styles.statCard}>
						<Statistic
							title='Ожидают выполнения'
							value={data?.stats.pendingTasks || 0}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
						<Text type='secondary'>Срок: в течение недели</Text>
					</Card>
				</Col>

				<Col xs={24} sm={12} md={6}>
					<Card bordered={false} className={styles.statCard}>
						<Statistic
							title='Участников в команде'
							value={team?.members.length || 0}
							prefix={<TeamOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
						<Text type='secondary'>
							{team?.name || 'Нет активной команды'}
						</Text>
					</Card>
				</Col>
			</Row>

			{/* Графики */}
			{/* Графики */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={16}>
					<Card
						title='История выполнения задач'
						bordered={false}
						extra={
							<div className={styles.cardExtra}>
								<Button.Group>
									<Button
										type={
											timeRange === 'week' ? 'primary' : (
												'default'
											)
										}
										onClick={() => setTimeRange('week')}
									>
										Неделя
									</Button>
									<Button
										type={
											timeRange === 'month' ? 'primary'
											:	'default'
										}
										onClick={() => setTimeRange('month')}
									>
										Месяц
									</Button>
									<Button
										type={
											timeRange === 'year' ? 'primary' : (
												'default'
											)
										}
										onClick={() => setTimeRange('year')}
									>
										Год
									</Button>
								</Button.Group>
							</div>
						}
					>
						<div style={{ width: '100%', height: 300 }}>
							{data?.taskCompletionHistory ?
								<ResponsiveContainer width='100%' height='100%'>
									<LineChart
										data={data.taskCompletionHistory}
										margin={{
											top: 20,
											right: 30,
											left: 20,
											bottom: 10,
										}}
									>
										<CartesianGrid
											strokeDasharray='3 3'
											stroke='#31363F'
											vertical={false}
										/>
										<XAxis
											dataKey='date'
											tickFormatter={formatDateForChart}
											stroke='#EEEEEE'
											tick={{ fill: '#EEEEEE' }}
										/>
										<YAxis
											stroke='#EEEEEE'
											tick={{ fill: '#EEEEEE' }}
										/>
										<Tooltip
											content={<CustomTooltip />}
											contentStyle={{
												backgroundColor: '#31363F',
												border: '1px solid #76ABAE',
												borderRadius: '6px',
											}}
										/>
										<Legend
											wrapperStyle={{ color: '#EEEEEE' }}
										/>
										<Line
											type='monotone'
											dataKey='created'
											name='Создано'
											stroke='#1890ff'
											activeDot={{ r: 8 }}
											strokeWidth={2}
										/>
										<Line
											type='monotone'
											dataKey='completed'
											name='Выполнено'
											stroke='#52c41a'
											strokeWidth={2}
										/>
									</LineChart>
								</ResponsiveContainer>
							:	<Skeleton active paragraph={{ rows: 5 }} />}
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={8}>
					<Card title='Задачи по статусам' bordered={false}>
						<div style={{ width: '100%', height: 300 }}>
							{tasks ?
								<ResponsiveContainer width='100%' height='100%'>
									<PieChart>
										<Pie
											activeIndex={activePieIndex}
											activeShape={renderActiveShape}
											data={data.tasksByStatus}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={80}
											fill='#8884d8'
											dataKey='value'
											onMouseEnter={(_, index) =>
												setActivePieIndex(index)
											}
										>
											{tasks.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														COLORS[
															index %
																COLORS.length
														]
													}
												/>
											))}
										</Pie>
										<Tooltip
											content={
												<CustomTooltip valuePrefix='' />
											}
											contentStyle={{
												backgroundColor: '#31363F',
												border: '1px solid #76ABAE',
												borderRadius: '6px',
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							:	<Skeleton active paragraph={{ rows: 5 }} />}
						</div>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={8}>
					<Card title='Задачи по приоритету' bordered={false}>
						<div style={{ width: '100%', height: 300 }}>
							{data?.tasksByPriority ?
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart
										data={data.tasksByPriority}
										margin={{
											top: 20,
											right: 30,
											left: 20,
											bottom: 5,
										}}
									>
										<CartesianGrid
											strokeDasharray='3 3'
											stroke='#31363F'
											vertical={false}
										/>
										<XAxis
											dataKey='name'
											stroke='#EEEEEE'
											tick={{ fill: '#EEEEEE' }}
										/>
										<YAxis
											stroke='#EEEEEE'
											tick={{ fill: '#EEEEEE' }}
										/>
										<Tooltip
											content={<CustomTooltip />}
											contentStyle={{
												backgroundColor: '#31363F',
												border: '1px solid #76ABAE',
												borderRadius: '6px',
											}}
										/>
										<Bar dataKey='value' name='Количество'>
											{data.tasksByPriority.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={
															entry.color ||
															COLORS[
																index %
																	COLORS.length
															]
														}
													/>
												),
											)}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							:	<Skeleton active paragraph={{ rows: 5 }} />}
						</div>
					</Card>
				</Col>

				<Col xs={24} lg={16}>
					<Card
						title='Последние задачи'
						bordered={false}
						extra={
							<Button
								type='primary'
								icon={<PlusOutlined />}
								size='small'
							>
								Новая задача
							</Button>
						}
					>
						{isTasksLoading ?
							<Skeleton active paragraph={{ rows: 5 }} />
						:	<Table
								dataSource={tasks || []}
								rowKey='id'
								pagination={false}
								size='middle'
								columns={[
									{
										title: 'Задача',
										dataIndex: 'title',
										key: 'title',
										render: (text, record) => (
											<div className={styles.taskTitle}>
												<Text strong>{text}</Text>
											</div>
										),
									},
									{
										title: 'Статус',
										dataIndex: 'status',
										key: 'status',
										render: (status) =>
											getStatusTag(status),
										width: 120,
									},
									{
										title: 'Приоритет',
										dataIndex: 'priority',
										key: 'priority',
										render: (priority) =>
											getPriorityTag(priority),
										width: 120,
									},
									{
										title: 'Срок',
										dataIndex: 'dueDate',
										key: 'dueDate',
										render: (date) => formatDate(date),
										width: 120,
									},
									{
										title: 'Исполнитель',
										dataIndex: 'assignedTo',
										key: 'assignedTo',
										render: (_, record: ITask) => {
											const node = record.assignees.map(
												(user, i) => {
													return (
														<div
															className={
																styles.userInfo
															}
															key={`cell-${i}`}
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
																	undefined
																}
															/>
															<Text
																style={{
																	marginLeft: 8,
																}}
															>
																{user.name ||
																	user.email}
															</Text>
														</div>
													);
												},
											);
											return node;
										},
										width: 200,
									},
									{
										title: '',
										key: 'actions',
										render: (_, record) => (
											<Dropdown
												menu={{
													items: [
														{
															key: 'view',
															label: 'Просмотр',
														},
														{
															key: 'edit',
															label: 'Редактировать',
														},
														{
															key: 'delete',
															label: 'Удалить',
															danger: true,
														},
													],
												}}
												trigger={['click']}
											>
												<Button
													type='text'
													icon={<EllipsisOutlined />}
													style={{
														borderRadius: '50%',
													}}
												/>
											</Dropdown>
										),
										width: 60,
									},
								]}
							/>
						}
					</Card>
				</Col>
			</Row>

			{/* Активность */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24}>
					<Card
						title='Недавняя активность'
						bordered={false}
						className={styles.activityCard}
					>
						{isTasksLoading ?
							<Skeleton active paragraph={{ rows: 5 }} />
						:	<div className={styles.activityList}>
								{(
									data?.activityLog &&
									data.activityLog.length > 0
								) ?
									data.activityLog.map((activity) => (
										<div
											key={activity.id}
											className={styles.activityItem}
										>
											<div
												className={
													styles.activityAvatar
												}
											>
												<Avatar
													size='small'
													src={activity.user.avatar}
													icon={
														!activity.user
															.avatar && (
															<UserOutlined />
														)
													}
												/>
											</div>
											<div
												className={
													styles.activityContent
												}
											>
												<div
													className={
														styles.activityText
													}
												>
													<Text strong>
														{activity.user.name}
													</Text>
													<Text>
														{' '}
														{activity.action}{' '}
													</Text>
													<Text strong>
														{activity.entityType ===
															'task' && (
															<FileTextOutlined
																style={{
																	marginRight: 4,
																}}
															/>
														)}
														{activity.entityType ===
															'team' && (
															<TeamOutlined
																style={{
																	marginRight: 4,
																}}
															/>
														)}
														{activity.entityType ===
															'user' && (
															<UserOutlined
																style={{
																	marginRight: 4,
																}}
															/>
														)}
														{activity.entityName}
													</Text>
												</div>
												<div
													className={
														styles.activityTime
													}
												>
													<Text type='secondary'>
														{dayjs(
															activity.timestamp,
														).fromNow()}
													</Text>
												</div>
											</div>
										</div>
									))
								:	<Empty description='Нет недавней активности' />
								}
							</div>
						}
					</Card>
				</Col>
			</Row>

			{/* Предстоящие события */}
			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} md={12}>
					<Card
						title='Ближайшие дедлайны'
						bordered={false}
						extra={
							<Button type='link' size='small'>
								Все задачи
							</Button>
						}
					>
						{isTasksLoading ?
							<Skeleton active paragraph={{ rows: 3 }} />
						:	<>
								{data?.recentTasks
									?.filter(
										(task) =>
											task.status !== 'completed' &&
											task.status !== 'canceled',
									)
									.slice(0, 3)
									.map((task) => (
										<div
											key={task.id}
											className={styles.deadlineItem}
										>
											<div
												className={styles.deadlineInfo}
											>
												<Text strong>{task.title}</Text>
												<div
													className={
														styles.deadlineMeta
													}
												>
													<ClockCircleOutlined
														style={{
															marginRight: 4,
														}}
													/>
													<Text type='secondary'>
														{formatDate(
															task.dueDate,
														)}
													</Text>
													{getPriorityTag(
														task.priority,
													)}
												</div>
											</div>
											<div>
												<Avatar
													size='small'
													src={task.assignedTo.avatar}
													icon={
														!task.assignedTo
															.avatar && (
															<UserOutlined />
														)
													}
												/>
											</div>
										</div>
									))}
							</>
						}
					</Card>
				</Col>

				<Col xs={24} md={12}>
					<Card
						title='Уведомления'
						bordered={false}
						extra={
							<Button
								type='link'
								size='small'
								icon={<BellOutlined />}
							>
								Все
							</Button>
						}
					>
						{isTasksLoading ?
							<Skeleton active paragraph={{ rows: 3 }} />
						:	<>
								{data?.activityLog
									?.filter((activity) =>
										dayjs(activity.timestamp).isAfter(
											dayjs().subtract(2, 'day'),
										),
									)
									.slice(0, 3)
									.map((activity) => (
										<div
											key={activity.id}
											className={styles.notificationItem}
										>
											<div
												className={
													styles.notificationIcon
												}
											>
												{activity.entityType ===
													'task' && (
													<FileTextOutlined />
												)}
												{activity.entityType ===
													'team' && <TeamOutlined />}
												{activity.entityType ===
													'user' && <UserOutlined />}
											</div>
											<div
												className={
													styles.notificationContent
												}
											>
												<Text>
													{activity.action}{' '}
													{activity.entityName}
												</Text>
												<Text
													type='secondary'
													style={{ fontSize: 12 }}
												>
													{dayjs(
														activity.timestamp,
													).fromNow()}
												</Text>
											</div>
										</div>
									))}
							</>
						}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

// Функция для генерации моковых данных (в реальном приложении заменить на API)
function getMockDashboardData(
	timeRange: 'week' | 'month' | 'year',
): DashboardData {
	// Настройка количества точек данных в зависимости от временного диапазона
	const dataPoints =
		timeRange === 'week' ? 7
		: timeRange === 'month' ? 30
		: 12;

	// Генерация истории выполнения задач
	// Генерация истории выполнения задач
	const taskCompletionHistory = Array.from({ length: dataPoints }).map(
		(_, i) => {
			const date = dayjs()
				.subtract(
					dataPoints - i - 1,
					timeRange === 'year' ? 'month' : 'day',
				)
				.format('YYYY-MM-DD');
			const created = Math.floor(Math.random() * 10) + 5;
			const completed = Math.floor(Math.random() * created);

			return {
				date,
				created,
				completed,
			};
		},
	);

	const totalTasks = 120;
	const completedTasks = 78;
	const pendingTasks = 32;
	const canceledTasks = 10;

	return {
		stats: {
			totalTasks,
			completedTasks,
			pendingTasks,
			totalTeamMembers: 8,
			taskCompletion: Math.round((completedTasks / totalTasks) * 100),
			tasksThisWeek: 24,
			tasksGrowth: 12.5, // процент роста
		},
		recentTasks: [
			{
				id: 1,
				title: 'Разработка дашборда',
				status: 'in_progress',
				priority: 'high',
				dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
				assignedTo: {
					id: 101,
					name: 'Алексей Иванов',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=101',
				},
			},
			{
				id: 2,
				title: 'Обновление API для мобильного приложения',
				status: 'pending',
				priority: 'medium',
				dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
				assignedTo: {
					id: 102,
					name: 'Мария Петрова',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&id=102',
				},
			},
			{
				id: 3,
				title: 'Тестирование новых функций',
				status: 'completed',
				priority: 'low',
				dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
				assignedTo: {
					id: 103,
					name: 'Сергей Смирнов',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=103',
				},
			},
			{
				id: 4,
				title: 'Создание документации',
				status: 'pending',
				priority: 'medium',
				dueDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
				assignedTo: {
					id: 104,
					name: 'Елена Козлова',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&id=104',
				},
			},
			{
				id: 5,
				title: 'Оптимизация производительности',
				status: 'in_progress',
				priority: 'high',
				dueDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
				assignedTo: {
					id: 105,
					name: 'Дмитрий Николаев',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=105',
				},
			},
		],
		activityLog: [
			{
				id: 201,
				action: 'создал задачу',
				timestamp: dayjs().subtract(2, 'hour').format(),
				user: {
					id: 101,
					name: 'Алексей Иванов',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=101',
				},
				entityType: 'task',
				entityId: 1,
				entityName: 'Разработка дашборда',
			},
			{
				id: 202,
				action: 'обновил задачу',
				timestamp: dayjs().subtract(5, 'hour').format(),
				user: {
					id: 103,
					name: 'Сергей Смирнов',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=103',
				},
				entityType: 'task',
				entityId: 3,
				entityName: 'Тестирование новых функций',
			},
			{
				id: 203,
				action: 'завершил задачу',
				timestamp: dayjs().subtract(1, 'day').format(),
				user: {
					id: 103,
					name: 'Сергей Смирнов',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=103',
				},
				entityType: 'task',
				entityId: 3,
				entityName: 'Тестирование новых функций',
			},
			{
				id: 204,
				action: 'добавил пользователя',
				timestamp: dayjs().subtract(2, 'day').format(),
				user: {
					id: 101,
					name: 'Алексей Иванов',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&id=101',
				},
				entityType: 'team',
				entityId: 1,
				entityName: 'Команда разработки',
			},
			{
				id: 205,
				action: 'создал задачу',
				timestamp: dayjs().subtract(3, 'day').format(),
				user: {
					id: 102,
					name: 'Мария Петрова',
					avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&id=102',
				},
				entityType: 'task',
				entityId: 4,
				entityName: 'Создание документации',
			},
		],
		tasksByStatus: [
			{ status: 'В работе', value: 45 },
			{ status: 'Завершено', value: completedTasks },
			{ status: 'Ожидает', value: pendingTasks },
			{ status: 'Отменено', value: canceledTasks },
		],
		tasksByPriority: [
			{ priority: 'low', name: 'Низкий', value: 35, color: '#52c41a' },
			{
				priority: 'medium',
				name: 'Средний',
				value: 55,
				color: '#faad14',
			},
			{ priority: 'high', name: 'Высокий', value: 30, color: '#f5222d' },
		],
		taskCompletionHistory,
	};
}

export default Dashboard;
