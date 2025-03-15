// src/pages/tasks/TasksList.tsx
import { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Table,
	Card,
	Button,
	Dropdown,
	Menu,
	Typography,
	Tooltip,
	Empty,
	Spin,
} from 'antd';
import {
	PlusOutlined,
	SortAscendingOutlined,
	FileExcelOutlined,
} from '@ant-design/icons';

import styles from './TasksStyles.module.css';
import dayjs from 'dayjs';
import {getFilteredTasks} from "../../settings/tasks/getFilteredTasks.ts";
import {useColumns} from "../../settings/tasks/useColumns.tsx";
import {IFilters, IStatusTitles} from "../../types/tasks.ts";
import {Filters} from "../../components/tasks/Filters.tsx";
import {ITask} from "../../types";
import {KanbanBoard} from "../../components/tasks/KanbanBoard.tsx";
import {SearchBox} from "../../components/tasks/SearchBox.tsx";
import {useGetAllTasks, useGetTeamTags} from "../../api";
import {useGeneralStore} from "../../store/useGeneralStore.ts";

const { Title, Text } = Typography;

const TasksList: FC = () => {
	const navigate = useNavigate();
	const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
	const [searchText, setSearchText] = useState('');
	const [filters, setFilters] = useState<IFilters>({
		status: [] as string[],
		priority: [] as string[],
		tags: [] as string[],
		assignees: [] as string[],
		dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null,
	});

	const {
		getGeneralStore
	} = useGeneralStore()

	const {
		user,
		tasks,
		taskTags
	} = getGeneralStore()

	const columns = useColumns()

	// Используем хук для получения задач


	// Обработчик создания новой задачи
	const handleCreateTask = () => {
		navigate('/admin/tasks/create');
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
		<Filters
			filters={filters}
			setFilters={setFilters}
			tags={taskTags}
			handleResetFilters={handleResetFilters}
		/>
	);

	// Функция рендеринга представления Канбан
	const renderKanbanBoard = () => {
		const filteredTasks:ITask[] = getFilteredTasks({
			tasks: tasks,
			searchText,
			filters
		});
		const statusColumns = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
		const statusTitles:IStatusTitles = {
			TODO: 'К выполнению',
			IN_PROGRESS: 'В процессе',
			REVIEW: 'На проверке',
			DONE: 'Выполнено',
		};

		return (
			<KanbanBoard
				filteredTasks={filteredTasks}
				statusColumns={statusColumns}
				statusTitles={statusTitles}
			/>
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
					<SearchBox
						searchText={searchText}
						setSearchText={setSearchText}
						filtersContent={filtersContent}
						filters={filters}
						viewMode={viewMode}
						setViewMode={setViewMode}
					/>

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

				<>
					{viewMode === 'table' ?
						<Table
							dataSource={getFilteredTasks({
								tasks: tasks,
								searchText,
								filters
							})}
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
			</Card>
		</div>
	);
};

export default TasksList;
