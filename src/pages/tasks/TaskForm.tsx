// src/components/tasks/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import {
	Form,
	Input,
	Button,
	Select,
	DatePicker,
	Tabs,
	Space,
	Divider,
	message,
	Row,
	Col,
	Card,
	Alert,
} from 'antd';
import {
	FileOutlined,
	TagOutlined,
	UserOutlined,
	CalendarOutlined,
	SaveOutlined,
	CloseOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useGeneralStore } from '../../store/useGeneralStore';
import { useTasks } from '../../hooks/useTasks';
import { useTaskTags } from '../../hooks/useTaskTags';
import dayjs from 'dayjs';
import styles from '../../pages/tasks/TasksStyles.module.css';
import TagSelector from '../../components/tasks/TagSelector.tsx';
import AssigneeSelector from '../../components/tasks/AssigneeSelector.tsx';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface TaskFormProps {
	initialData?: any;
	isEditMode?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
	initialData,
	isEditMode = false,
}) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { generalStore } = useGeneralStore();
	const [form] = Form.useForm();
	const [activeTab, setActiveTab] = useState('details');
	const [loading, setLoading] = useState(false);
	const [selectedTags, setSelectedTags] = useState<any[]>([]);
	const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);

	// Используем хуки для работы с API
	const { createTask, updateTask, getTask } = useTasks();
	const { getTags } = useTaskTags();

	// Загрузка данных задачи для редактирования
	useEffect(() => {
		const fetchTask = async () => {
			if (isEditMode && id) {
				try {
					setLoading(true);
					const taskData = await getTask(id);

					// Заполняем форму данными
					form.setFieldsValue({
						title: taskData.title,
						description: taskData.description,
						status: taskData.status,
						priority: taskData.priority,
						dateRange:
							taskData.startDate || taskData.endDate ?
								[
									taskData.startDate ?
										dayjs(taskData.startDate)
									:	null,
									taskData.endDate ?
										dayjs(taskData.endDate)
									:	null,
								]
							:	null,
					});

					// Устанавливаем выбранные теги и исполнителей
					setSelectedTags(taskData.tags || []);
					setSelectedAssignees(taskData.assignees || []);
				} catch (error) {
					console.error('Error fetching task:', error);
					message.error('Не удалось загрузить данные задачи');
				} finally {
					setLoading(false);
				}
			} else if (initialData) {
				// Если переданы начальные данные, заполняем форму
				form.setFieldsValue({
					...initialData,
					dateRange:
						initialData.startDate || initialData.endDate ?
							[
								initialData.startDate ?
									dayjs(initialData.startDate)
								:	null,
								initialData.endDate ?
									dayjs(initialData.endDate)
								:	null,
							]
						:	null,
				});

				// setSelectedTags(initialData.tags || []);
				// setSelectedAssignees(initialData.assignees || []);
			}
		};

		fetchTask();
	}, [isEditMode, id, form, getTask, initialData]);

	// Обработчик отправки формы
	const handleSubmit = async (values) => {
		try {
			setLoading(true);

			// Подготавливаем данные для отправки
			const taskData = {
				title: values.title,
				description: values.description,
				status: values.status,
				priority: values.priority,
				startDate: values.dateRange?.[0]?.toISOString() || null,
				endDate: values.dateRange?.[1]?.toISOString() || null,
				tagIds: selectedTags.map((tag) => tag.id),
				assigneeIds: selectedAssignees.map((user) => user.id),
				teamId: generalStore.team?.id, // ID команды из стора
			};

			if (isEditMode && id) {
				// Обновление существующей задачи
				await updateTask(id, taskData);
				message.success('Задача успешно обновлена');
				navigate(`/admin/tasks/${id}`);
			} else {
				// Создание новой задачи
				const newTask = await createTask(taskData);
				message.success('Задача успешно создана');
				navigate(`/admin/tasks/${newTask.id}`);
			}
		} catch (error) {
			console.error('Error saving task:', error);
			message.error('Не удалось сохранить задачу');
		} finally {
			setLoading(false);
		}
	};

	// Обработчик отмены
	const handleCancel = () => {
		if (isEditMode && id) {
			navigate(`/admin/tasks/${id}`);
		} else {
			navigate('/admin/tasks');
		}
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={handleSubmit}
			className={styles.taskForm}
			initialValues={{
				status: 'TODO',
				priority: 'MEDIUM',
			}}
		>
			<Row gutter={16}>
				<Col xs={24} lg={16}>
					<Card className={styles.formMainCard}>
						<Form.Item
							name='title'
							label='Название задачи'
							rules={[
								{
									required: true,
									message: 'Введите название задачи',
								},
							]}
						>
							<Input
								placeholder='Введите название задачи'
								size='large'
							/>
						</Form.Item>

						<Tabs activeKey={activeTab} onChange={setActiveTab}>
							<TabPane
								tab={
									<span>
										<FileOutlined /> Описание
									</span>
								}
								key='details'
							>
								<Form.Item name='description' label='Описание'>
									<TextArea
										placeholder='Введите подробное описание задачи'
										autoSize={{ minRows: 4, maxRows: 8 }}
									/>
								</Form.Item>
							</TabPane>

							<TabPane
								tab={
									<span>
										<TagOutlined /> Теги
									</span>
								}
								key='tags'
							>
								<TagSelector
									selectedTags={selectedTags}
									onChange={setSelectedTags}
								/>
							</TabPane>

							<TabPane
								tab={
									<span>
										<UserOutlined /> Исполнители
									</span>
								}
								key='assignees'
							>
								<AssigneeSelector
									selectedAssignees={selectedAssignees}
									onChange={setSelectedAssignees}
								/>
							</TabPane>

							<TabPane
								tab={
									<span>
										<CalendarOutlined /> Сроки
									</span>
								}
								key='dates'
							>
								<Form.Item
									name='dateRange'
									label='Период выполнения'
								>
									<RangePicker
										style={{ width: '100%' }}
										placeholder={[
											'Дата начала',
											'Дата окончания',
										]}
										showTime={{ format: 'HH:mm' }}
										format='DD.MM.YYYY HH:mm'
									/>
								</Form.Item>
							</TabPane>
						</Tabs>
					</Card>
				</Col>

				<Col xs={24} lg={8}>
					<Card className={styles.formSideCard}>
						<Form.Item
							name='status'
							label='Статус'
							rules={[
								{ required: true, message: 'Выберите статус' },
							]}
						>
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

						<Form.Item
							name='priority'
							label='Приоритет'
							rules={[
								{
									required: true,
									message: 'Выберите приоритет',
								},
							]}
						>
							<Select>
								<Select.Option value='LOW'>
									Низкий
								</Select.Option>
								<Select.Option value='MEDIUM'>
									Средний
								</Select.Option>
								<Select.Option value='HIGH'>
									Высокий
								</Select.Option>
								<Select.Option value='URGENT'>
									Срочный
								</Select.Option>
							</Select>
						</Form.Item>

						<Divider />

						<div className={styles.formSummary}>
							<div className={styles.summaryItem}>
								<span>Теги:</span>
								<span>{selectedTags.length}</span>
							</div>
							<div className={styles.summaryItem}>
								<span>Исполнители:</span>
								<span>{selectedAssignees.length}</span>
							</div>
						</div>

						{!generalStore.team && (
							<Alert
								type='warning'
								message='Внимание'
								description='У вас нет активной команды. Задача будет создана без привязки к команде.'
								style={{ marginTop: 16 }}
							/>
						)}

						<Divider />

						<div className={styles.formActions}>
							<Button
								type='primary'
								htmlType='submit'
								icon={<SaveOutlined />}
								loading={loading}
							>
								{isEditMode ?
									'Сохранить изменения'
								:	'Создать задачу'}
							</Button>
							<Button
								onClick={handleCancel}
								icon={<CloseOutlined />}
							>
								Отмена
							</Button>
						</div>
					</Card>
				</Col>
			</Row>
		</Form>
	);
};

export default TaskForm;
