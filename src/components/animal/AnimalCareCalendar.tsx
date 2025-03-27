// AnimalCareCalendar.tsx
import React, { useState } from 'react';
import {
	Calendar,
	Badge,
	Divider,
	Typography,
	List,
	Tag,
	Button,
	Space,
	Modal,
	Form,
	Input,
	Select,
	DatePicker,
	TimePicker,
	Empty,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	InfoCircleOutlined,
	MedicineBoxOutlined,
	CoffeeOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import locale from 'antd/es/date-picker/locale/ru_RU';
import {
	ActionType,
	ActionTypeColors,
	ActionTypeLabels,
	Animal,
	AnimalAction,
} from '../../types/animal';
import {
	ActionAnimal,
	ActionDate,
	ActionDescription,
	ActionItem,
	ActionQuantity,
	ActionTypeTag,
	CalendarCard,
	Container,
	DetailsCard,
	FormItemGroup,
} from './styles';
import { darkTheme } from '../../main';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Стилизованные компоненты

// Фиктивные данные для животных (в реальном приложении получали бы из API)
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

// Функция для создания фиктивных данных (для тестирования)
const generateDummyActions = (count: number): AnimalAction[] => {
	const actions: AnimalAction[] = [];
	const actionTypes = Object.values(ActionType);
	const today = dayjs();

	for (let i = 0; i < count; i++) {
		const randomAnimal =
			dummyAnimals[Math.floor(Math.random() * dummyAnimals.length)];
		const randomActionType =
			actionTypes[Math.floor(Math.random() * actionTypes.length)];
		const randomDaysOffset = Math.floor(Math.random() * 30) - 15; // от -15 до +15 дней

		actions.push({
			id: `action-${i}`,
			animalId: randomAnimal.id,
			animalName: randomAnimal.name,
			actionType: randomActionType,
			date: today.add(randomDaysOffset, 'day').format('YYYY-MM-DD'),
			description: `${ActionTypeLabels[randomActionType]} для ${randomAnimal.name}`,
			quantity:
				randomActionType === ActionType.FEEDING ?
					`${Math.floor(Math.random() * 500) + 100}г`
				: randomActionType === ActionType.MEDICATION ?
					`${Math.floor(Math.random() * 5) + 1} таб.`
				:	undefined,
			notes: Math.random() > 0.7 ? 'Дополнительная заметка' : undefined,
			createdBy: 'Администратор',
			createdAt: today
				.subtract(Math.floor(Math.random() * 5), 'day')
				.format('YYYY-MM-DD HH:mm:ss'),
		});
	}

	return actions;
};

const AnimalCareCalendar: React.FC = () => {
	// Состояния
	const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
	const [actions, setActions] = useState<AnimalAction[]>(
		generateDummyActions(30),
	);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [editingAction, setEditingAction] = useState<AnimalAction | null>(
		null,
	);
	const [form] = Form.useForm();

	// Функция для получения действий на определенную дату
	const getActionsForDate = (date: Dayjs): AnimalAction[] => {
		return actions.filter(
			(action) =>
				dayjs(action.date).format('YYYY-MM-DD') ===
				date.format('YYYY-MM-DD'),
		);
	};

	// Функция для получения данных для отображения в календаре
	const dateCellRender = (value: Dayjs) => {
		const dayActions = getActionsForDate(value);

		if (dayActions.length === 0) return null;

		// Группируем действия по типам для отображения в календаре
		const actionsByType: Record<ActionType, number> = {} as Record<
			ActionType,
			number
		>;

		dayActions.forEach((action) => {
			actionsByType[action.actionType] =
				(actionsByType[action.actionType] || 0) + 1;
		});

		return (
			<div style={{ padding: '0 2px' }}>
				{Object.entries(actionsByType).map(([type, count]) => (
					<Badge
						key={type}
						count={count}
						style={{
							backgroundColor:
								ActionTypeColors[type as ActionType],
							marginRight: 4,
							marginBottom: 4,
						}}
					/>
				))}
			</div>
		);
	};

	// Обработчик выбора даты в календаре
	const handleDateSelect = (value: Dayjs) => {
		setSelectedDate(value);
	};

	// Обработчик открытия модального окна для создания новой записи
	const handleAddAction = () => {
		form.resetFields();
		form.setFieldsValue({
			date: selectedDate,
			time: dayjs(),
		});
		setEditingAction(null);
		setModalVisible(true);
	};

	// Обработчик открытия модального окна для редактирования записи
	const handleEditAction = (action: AnimalAction) => {
		form.resetFields();
		const actionDate = dayjs(action.date);

		form.setFieldsValue({
			animalId: action.animalId,
			actionType: action.actionType,
			date: actionDate,
			time: actionDate,
			description: action.description,
			quantity: action.quantity,
			notes: action.notes,
		});

		setEditingAction(action);
		setModalVisible(true);
	};

	// Обработчик удаления записи
	const handleDeleteAction = (actionId: string) => {
		setActions((prevActions) =>
			prevActions.filter((action) => action.id !== actionId),
		);
	};

	// Обработчик сохранения записи
	const handleSaveAction = (values: any) => {
		const combinedDate = values.date
			.hour(values.time.hour())
			.minute(values.time.minute())
			.second(0)
			.format();

		const selectedAnimal = dummyAnimals.find(
			(animal) => animal.id === values.animalId,
		);

		if (!selectedAnimal) return;

		const actionData: AnimalAction = {
			id: editingAction ? editingAction.id : `action-${Date.now()}`,
			animalId: values.animalId,
			animalName: selectedAnimal.name,
			actionType: values.actionType,
			date: combinedDate,
			description: values.description,
			quantity: values.quantity,
			notes: values.notes,
			createdBy: 'Пользователь',
			createdAt:
				editingAction ? editingAction.createdAt : dayjs().format(),
		};

		if (editingAction) {
			// Обновляем существующую запись
			setActions((prevActions) =>
				prevActions.map((action) =>
					action.id === editingAction.id ? actionData : action,
				),
			);
		} else {
			// Создаем новую запись
			setActions((prevActions) => [...prevActions, actionData]);
		}

		setModalVisible(false);
	};

	// Действия на выбранную дату
	const selectedDateActions = getActionsForDate(selectedDate);

	return (
		<Container>
			<CalendarCard title='Календарь ухода за животными'>
				<Calendar
					fullscreen={false}
					dateCellRender={dateCellRender}
					onSelect={handleDateSelect}
					value={selectedDate}
					locale={locale}
				/>
				<Divider />
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Text>Выбрано: {selectedDate.format('DD.MM.YYYY')}</Text>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={handleAddAction}
					>
						Добавить запись
					</Button>
				</div>
			</CalendarCard>

			<DetailsCard
				title={
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<span>
							События на {selectedDate.format('DD.MM.YYYY')}
						</span>
						<Badge
							count={selectedDateActions.length}
							style={{
								backgroundColor:
									selectedDateActions.length ? '#52c41a' : (
										'#ccc'
									),
							}}
						/>
					</div>
				}
			>
				{selectedDateActions.length === 0 ?
					<Empty
						description='На этот день ничего не запланировано'
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				:	<List
						dataSource={selectedDateActions}
						renderItem={(action) => (
							<ActionItem
								$background={darkTheme.token.colorBgBase}
								$backgroundHover={
									darkTheme.token.colorBgElevated
								}
								actions={[
									<Button
										icon={<EditOutlined />}
										type='text'
										onClick={() => handleEditAction(action)}
									/>,
									<Button
										icon={<DeleteOutlined />}
										type='text'
										danger
										onClick={() =>
											handleDeleteAction(action.id)
										}
									/>,
								]}
							>
								<List.Item.Meta
									avatar={
										(
											action.actionType ===
											ActionType.FEEDING
										) ?
											<CoffeeOutlined
												style={{
													fontSize: 24,
													color: ActionTypeColors[
														action.actionType
													],
												}}
											/>
										: (
											action.actionType ===
											ActionType.MEDICATION
										) ?
											<MedicineBoxOutlined
												style={{
													fontSize: 24,
													color: ActionTypeColors[
														action.actionType
													],
												}}
											/>
										:	<InfoCircleOutlined
												style={{
													fontSize: 24,
													color: ActionTypeColors[
														action.actionType
													],
												}}
											/>

									}
									title={
										<>
											<ActionTypeTag
												color={
													ActionTypeColors[
														action.actionType
													]
												}
											>
												{
													ActionTypeLabels[
														action.actionType
													]
												}
											</ActionTypeTag>
											<ActionDate>
												{dayjs(action.date).format(
													'HH:mm',
												)}
											</ActionDate>
											<ActionAnimal>
												{action.animalName}
											</ActionAnimal>
										</>
									}
									description={
										<>
											<ActionDescription>
												{action.description}
											</ActionDescription>
											{action.quantity && (
												<ActionQuantity>
													Количество:{' '}
													{action.quantity}
												</ActionQuantity>
											)}
											{action.notes && (
												<Paragraph
													type='secondary'
													style={{
														fontSize: '12px',
														marginTop: '8px',
													}}
												>
													{action.notes}
												</Paragraph>
											)}
										</>
									}
								/>
							</ActionItem>
						)}
					/>
				}
			</DetailsCard>

			{/* Модальное окно для создания/редактирования записи */}
			<Modal
				title={
					editingAction ?
						'Редактировать запись'
					:	'Добавить новую запись'
				}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				footer={null}
				width={700}
			>
				<Form form={form} layout='vertical' onFinish={handleSaveAction}>
					<FormItemGroup>
						<Form.Item
							name='animalId'
							label='Животное'
							rules={[
								{
									required: true,
									message: 'Пожалуйста, выберите животное',
								},
							]}
							style={{ flex: 1 }}
						>
							<Select placeholder='Выберите животное'>
								{dummyAnimals.map((animal) => (
									<Option key={animal.id} value={animal.id}>
										{animal.name} ({animal.species}
										{animal.breed ?
											`, ${animal.breed}`
										:	''}
										)
									</Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name='actionType'
							label='Тип действия'
							rules={[
								{
									required: true,
									message:
										'Пожалуйста, выберите тип действия',
								},
							]}
							style={{ flex: 1 }}
						>
							<Select placeholder='Выберите тип действия'>
								{Object.entries(ActionTypeLabels).map(
									([type, label]) => (
										<Option key={type} value={type}>
											<Tag
												color={
													ActionTypeColors[
														type as ActionType
													]
												}
												style={{ marginRight: 8 }}
											>
												{label}
											</Tag>
										</Option>
									),
								)}
							</Select>
						</Form.Item>
					</FormItemGroup>

					<FormItemGroup>
						<Form.Item
							name='date'
							label='Дата'
							rules={[
								{
									required: true,
									message: 'Пожалуйста, выберите дату',
								},
							]}
							style={{ flex: 1 }}
						>
							<DatePicker
								style={{ width: '100%' }}
								format='DD.MM.YYYY'
								locale={locale}
							/>
						</Form.Item>

						<Form.Item
							name='time'
							label='Время'
							rules={[
								{
									required: true,
									message: 'Пожалуйста, выберите время',
								},
							]}
							style={{ flex: 1 }}
						>
							<TimePicker
								style={{ width: '100%' }}
								format='HH:mm'
								minuteStep={5}
							/>
						</Form.Item>
					</FormItemGroup>

					<Form.Item
						name='description'
						label='Описание'
						rules={[
							{
								required: true,
								message: 'Пожалуйста, добавьте описание',
							},
						]}
					>
						<Input placeholder='Краткое описание действия' />
					</Form.Item>

					<Form.Item
						name='quantity'
						label='Количество (если применимо)'
					>
						<Input placeholder='Например: 200г, 2 таблетки, 50мл и т.д.' />
					</Form.Item>

					<Form.Item name='notes' label='Дополнительные заметки'>
						<TextArea
							rows={4}
							placeholder='Любые дополнительные заметки или наблюдения'
						/>
					</Form.Item>

					<Form.Item
						style={{
							textAlign: 'right',
							marginBottom: 0,
							marginTop: 16,
						}}
					>
						<Space>
							<Button onClick={() => setModalVisible(false)}>
								Отмена
							</Button>
							<Button type='primary' htmlType='submit'>
								{editingAction ?
									'Сохранить изменения'
								:	'Создать запись'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</Container>
	);
};

export default AnimalCareCalendar;
