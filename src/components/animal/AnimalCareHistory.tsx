// AnimalCareHistory.tsx
import React, { useState, useEffect } from 'react';
import {
	Card,
	Typography,
	Table,
	Tag,
	Button,
	Space,
	DatePicker,
	Select,
	Input,
	Drawer,
	Descriptions,
	Divider,
} from 'antd';
import {
	SearchOutlined,
	FilterOutlined,
	ExportOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import styled from 'styled-components';
import {
	ActionType,
	ActionTypeColors,
	ActionTypeLabels,
	Animal,
	AnimalAction,
} from '../../types/animal';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Container = styled.div`
	padding: 20px;
`;

const FilterContainer = styled.div`
	display: flex;
	margin-bottom: 16px;
	flex-wrap: wrap;
	gap: 12px;
	align-items: flex-end;
`;

const FilterItem = styled.div`
	min-width: 200px;
	flex: 1;

	@media (max-width: 576px) {
		min-width: 100%;
	}
`;

const StyledCard = styled(Card)`
	margin-bottom: 16px;
`;

// Фиктивные данные (такие же как в AnimalCareCalendar)
const dummyAnimals: Animal[] = [
	{
		id: '1',
		name: 'Барсик',
		species: 'Кот',
		breed: 'Сиамский',
		age: 3,
		weight: 4.5,
	},
	{
		id: '2',
		name: 'Шарик',
		species: 'Собака',
		breed: 'Лабрадор',
		age: 5,
		weight: 30,
	},
	{
		id: '3',
		name: 'Хрюша',
		species: 'Свинья',
		breed: 'Мини-пиг',
		age: 1,
		weight: 15,
	},
	{
		id: '4',
		name: 'Кеша',
		species: 'Попугай',
		breed: 'Волнистый',
		age: 2,
		weight: 0.1,
	},
];

const AnimalCareHistory: React.FC = () => {
	// Получаем те же сгенерированные данные как и в AnimalCareCalendar
	const [actions, setActions] = useState<AnimalAction[]>([]);
	const [filteredActions, setFilteredActions] = useState<AnimalAction[]>([]);

	// Состояния для фильтров
	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
	const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
	const [selectedActionType, setSelectedActionType] =
		useState<ActionType | null>(null);
	const [searchText, setSearchText] = useState<string>('');

	// Состояние для детального просмотра
	const [detailDrawerVisible, setDetailDrawerVisible] =
		useState<boolean>(false);
	const [selectedAction, setSelectedAction] = useState<AnimalAction | null>(
		null,
	);

	// Имитация загрузки данных при монтировании компонента
	useEffect(() => {
		// Функция для создания фиктивных данных (такая же как в AnimalCareCalendar)
		const generateDummyActions = (count: number): AnimalAction[] => {
			const actions: AnimalAction[] = [];
			const actionTypes = Object.values(ActionType);
			const today = dayjs();

			for (let i = 0; i < count; i++) {
				const randomAnimal =
					dummyAnimals[
						Math.floor(Math.random() * dummyAnimals.length)
					];
				const randomActionType =
					actionTypes[Math.floor(Math.random() * actionTypes.length)];
				const randomDaysOffset = Math.floor(Math.random() * 90) - 45; // от -45 до +45 дней

				actions.push({
					id: `action-${i}`,
					animalId: randomAnimal.id,
					animalName: randomAnimal.name,
					actionType: randomActionType,
					date: today
						.add(randomDaysOffset, 'day')
						.format('YYYY-MM-DD HH:mm:ss'),
					description: `${ActionTypeLabels[randomActionType]} для ${randomAnimal.name}`,
					quantity:
						randomActionType === ActionType.FEEDING ?
							`${Math.floor(Math.random() * 500) + 100}г`
						: randomActionType === ActionType.MEDICATION ?
							`${Math.floor(Math.random() * 5) + 1} таб.`
						:	undefined,
					notes:
						Math.random() > 0.7 ?
							'Дополнительная заметка'
						:	undefined,
					createdBy: 'Администратор',
					createdAt: today
						.subtract(Math.floor(Math.random() * 5), 'day')
						.format('YYYY-MM-DD HH:mm:ss'),
				});
			}

			return actions;
		};

		const dummyData = generateDummyActions(100);
		setActions(dummyData);
		setFilteredActions(dummyData);
	}, []);

	// Функция для применения фильтров
	const applyFilters = () => {
		let filtered = [...actions];

		// Фильтр по диапазону дат
		if (dateRange && dateRange[0] && dateRange[1]) {
			filtered = filtered.filter((action) => {
				const actionDate = dayjs(action.date);
				return (
					actionDate.isAfter(dateRange[0]) &&
					actionDate.isBefore(dateRange[1])
				);
			});
		}

		// Фильтр по выбранному животному
		if (selectedAnimal) {
			filtered = filtered.filter(
				(action) => action.animalId === selectedAnimal,
			);
		}

		// Фильтр по типу действия
		if (selectedActionType) {
			filtered = filtered.filter(
				(action) => action.actionType === selectedActionType,
			);
		}

		// Фильтр по тексту
		if (searchText) {
			const searchLower = searchText.toLowerCase();
			filtered = filtered.filter(
				(action) =>
					action.description.toLowerCase().includes(searchLower) ||
					action.notes?.toLowerCase().includes(searchLower) ||
					action.animalName.toLowerCase().includes(searchLower),
			);
		}

		setFilteredActions(filtered);
	};

	// Применяем фильтры при изменении условий
	useEffect(() => {
		applyFilters();
	}, [dateRange, selectedAnimal, selectedActionType, searchText, actions]);

	// Сброс всех фильтров
	const resetFilters = () => {
		setDateRange(null);
		setSelectedAnimal(null);
		setSelectedActionType(null);
		setSearchText('');
	};

	// Просмотр детальной информации о записи
	const viewActionDetails = (action: AnimalAction) => {
		setSelectedAction(action);
		setDetailDrawerVisible(true);
	};

	// Колонки для таблицы
	const columns = [
		{
			title: 'Дата и время',
			dataIndex: 'date',
			key: 'date',
			render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
			sorter: (a: AnimalAction, b: AnimalAction) =>
				dayjs(a.date).unix() - dayjs(b.date).unix(),
		},
		{
			title: 'Животное',
			dataIndex: 'animalName',
			key: 'animalName',
			sorter: (a: AnimalAction, b: AnimalAction) =>
				a.animalName.localeCompare(b.animalName),
		},
		{
			title: 'Тип действия',
			dataIndex: 'actionType',
			key: 'actionType',
			render: (type: ActionType) => (
				<Tag color={ActionTypeColors[type]}>
					{ActionTypeLabels[type]}
				</Tag>
			),
			filters: Object.entries(ActionTypeLabels).map(([value, text]) => ({
				text,
				value,
			})),
			// onFilter: (value: string, record: AnimalAction) =>
			// 	record.actionType === value,
		},
		{
			title: 'Описание',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
		},
		{
			title: 'Количество',
			dataIndex: 'quantity',
			key: 'quantity',
			render: (quantity: string | undefined) => quantity || '-',
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: AnimalAction) => (
				<Button
					type='text'
					icon={<InfoCircleOutlined />}
					onClick={() => viewActionDetails(record)}
				>
					Подробнее
				</Button>
			),
		},
	];

	return (
		<Container>
			<StyledCard title='История ухода за животными'>
				<FilterContainer>
					<FilterItem>
						<Text>Период</Text>
						<RangePicker
							style={{ width: '100%' }}
							format='DD.MM.YYYY'
							value={dateRange}
							onChange={(dates) =>
								setDateRange(dates as [Dayjs, Dayjs] | null)
							}
						/>
					</FilterItem>

					<FilterItem>
						<Text>Животное</Text>
						<Select
							style={{ width: '100%' }}
							placeholder='Все животные'
							allowClear
							value={selectedAnimal}
							onChange={setSelectedAnimal}
						>
							{dummyAnimals.map((animal) => (
								<Option key={animal.id} value={animal.id}>
									{animal.name} ({animal.species})
								</Option>
							))}
						</Select>
					</FilterItem>

					<FilterItem>
						<Text>Тип действия</Text>
						<Select
							style={{ width: '100%' }}
							placeholder='Все типы'
							allowClear
							value={selectedActionType}
							onChange={setSelectedActionType}
						>
							{Object.entries(ActionTypeLabels).map(
								([type, label]) => (
									<Option key={type} value={type}>
										<Tag
											color={
												ActionTypeColors[
													type as ActionType
												]
											}
										>
											{label}
										</Tag>
									</Option>
								),
							)}
						</Select>
					</FilterItem>

					<FilterItem>
						<Text>Поиск</Text>
						<Input
							placeholder='Поиск по описанию'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: '100%' }}
						/>
					</FilterItem>

					<Button icon={<FilterOutlined />} onClick={resetFilters}>
						Сбросить
					</Button>

					<Button
						type='primary'
						icon={<ExportOutlined />}
						onClick={() => {
							// Здесь можно добавить логику экспорта данных (например, в CSV)
							alert('Экспорт данных');
						}}
					>
						Экспорт
					</Button>
				</FilterContainer>

				<Table
					dataSource={filteredActions}
					columns={columns}
					rowKey='id'
					pagination={{ pageSize: 10 }}
					bordered
					summary={(pageData) => {
						// Статистика по отфильтрованным данным
						return (
							<Table.Summary fixed>
								<Table.Summary.Row>
									<Table.Summary.Cell index={0} colSpan={6}>
										<Text type='secondary'>
											Всего записей:{' '}
											{filteredActions.length}
										</Text>
									</Table.Summary.Cell>
								</Table.Summary.Row>
							</Table.Summary>
						);
					}}
				/>
			</StyledCard>

			{/* Drawer для детального просмотра */}
			<Drawer
				title='Подробная информация'
				width={520}
				closable={true}
				onClose={() => setDetailDrawerVisible(false)}
				visible={detailDrawerVisible}
			>
				{selectedAction && (
					<>
						<Descriptions bordered column={1}>
							<Descriptions.Item label='Животное'>
								{selectedAction.animalName}
							</Descriptions.Item>
							<Descriptions.Item label='Тип действия'>
								<Tag
									color={
										ActionTypeColors[
											selectedAction.actionType
										]
									}
								>
									{
										ActionTypeLabels[
											selectedAction.actionType
										]
									}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label='Дата и время'>
								{dayjs(selectedAction.date).format(
									'DD.MM.YYYY HH:mm',
								)}
							</Descriptions.Item>
							<Descriptions.Item label='Описание'>
								{selectedAction.description}
							</Descriptions.Item>
							{selectedAction.quantity && (
								<Descriptions.Item label='Количество'>
									{selectedAction.quantity}
								</Descriptions.Item>
							)}
							{selectedAction.notes && (
								<Descriptions.Item label='Заметки'>
									{selectedAction.notes}
								</Descriptions.Item>
							)}
							<Descriptions.Item label='Создано'>
								{selectedAction.createdBy},{' '}
								{dayjs(selectedAction.createdAt).format(
									'DD.MM.YYYY HH:mm',
								)}
							</Descriptions.Item>
						</Descriptions>

						<Divider />

						<Space
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<Button
								onClick={() => setDetailDrawerVisible(false)}
							>
								Закрыть
							</Button>
							<Button
								type='primary'
								onClick={() => {
									// Переход к редактированию записи (в будущем)
									setDetailDrawerVisible(false);
									// Здесь можно добавить навигацию к форме редактирования
								}}
							>
								Редактировать
							</Button>
						</Space>
					</>
				)}
			</Drawer>
		</Container>
	);
};

export default AnimalCareHistory;
