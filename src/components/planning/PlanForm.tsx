// PlanForm.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Card,
	Form,
	Input,
	DatePicker,
	Select,
	Button,
	Space,
	InputNumber,
	Typography,
	message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { PlanPriority, PlanStatus } from '../../types/building';
import { useGeneralStore } from '../../store/useGeneralStore';
import styles from '../../pages/tasks/TasksStyles.module.css';
import UserAvatar from '../common/UserAvatar';
import { useCreatePlan } from '../../api/useCreatePlan';
import { useUpdatePlan } from '../../api/useUpdatePlan';

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Container = styled.div`
	padding: 24px;
`;

const StyledCard = styled(Card)`
	background: #1f1f1f;
	border-radius: 8px;
	margin-bottom: 16px;
`;

const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
`;

const FormActions = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 24px;
	gap: 12px;
`;

const PlanForm: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const isEditMode = !!id;

	const { getGeneralStore } = useGeneralStore();

	const { plans, team, user } = getGeneralStore();

	const { mutateAsync } = useCreatePlan();
	const { mutateAsync: updatePlan } = useUpdatePlan(id || '');

	console.log('>>>>>>>>><><>><><<>', id);

	// Для режима редактирования загружаем данные плана
	const plan = plans.find((p) => p.id === id);
	// const { data: plan, isLoading: planLoading } = usePlan(id || '');
	// const createPlanMutation = useCreatePlan();
	// const updatePlanMutation = useUpdatePlan();

	// Заполняем форму при получении данных в режиме редактирования
	useEffect(() => {
		if (isEditMode && plan) {
			form.setFieldsValue({
				title: plan.title,
				description: plan.description,
				dateRange: [dayjs(plan.startDate), dayjs(plan.endDate)],
				status: plan.status,
				priority: plan.priority,
				assignees: plan.assignees.map((user) => user.id),
				progress: plan.progress,
			});
		}
	}, [isEditMode, plan, form]);

	const onFinish = async (values: any) => {
		try {
			const [startDate, endDate] = values.dateRange;
			const planData = {
				title: values.title,
				description: values.description,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				status: values.status,
				priority: values.priority,
				assigneeIds: values.assignees,
				// progress: values.progress,
				email: user?.email,
			};

			if (isEditMode) {
				const planDataUpdate = {
					title: values.title,
					description: values.description,
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
					status: values.status,
					priority: values.priority,
					// assigneeIds: values.assignees,
				};
				await updatePlan(planDataUpdate);
				message.success('План успешно обновлен');
			} else {
				await mutateAsync(planData);
				message.success('План успешно создан');
				navigate(`/admin/plans`);
			}
		} catch (error) {
			message.error('Произошла ошибка при сохранении плана');
		}
	};

	// if (isEditMode) {
	// 	return (
	// 		<Container>
	// 			<StyledCard>
	// 				<Skeleton active />
	// 			</StyledCard>
	// 		</Container>
	// 	);
	// }

	return (
		<Container>
			<HeaderContainer>
				<Space>
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate('/admin/plans')}
					>
						Назад к списку
					</Button>
					<Title level={3} style={{ margin: 0 }}>
						{isEditMode ?
							'Редактирование плана'
						:	'Создание нового плана'}
					</Title>
				</Space>
			</HeaderContainer>

			<StyledCard>
				<Form
					form={form}
					layout='vertical'
					onFinish={onFinish}
					initialValues={{
						status: PlanStatus.NEW,
						priority: PlanPriority.MEDIUM,
						progress: 0,
					}}
				>
					<Form.Item
						name='title'
						label='Название'
						rules={[
							{
								required: true,
								message: 'Введите название плана',
							},
						]}
					>
						<Input placeholder='Название плана' />
					</Form.Item>

					<Form.Item name='description' label='Описание'>
						<TextArea
							rows={4}
							placeholder='Подробное описание плана'
						/>
					</Form.Item>

					<Form.Item
						name='dateRange'
						label='Период выполнения'
						rules={[
							{
								required: true,
								message: 'Выберите период выполнения',
							},
						]}
					>
						<RangePicker
							style={{ width: '100%' }}
							format='DD.MM.YYYY'
						/>
					</Form.Item>

					<div style={{ display: 'flex', gap: '16px' }}>
						<Form.Item
							name='status'
							label='Статус'
							style={{ flex: 1 }}
						>
							<Select
								options={Object.values(PlanStatus).map(
									(status) => ({
										label:
											status === PlanStatus.NEW ? 'Новый'
											: (
												status ===
												PlanStatus.IN_PROGRESS
											) ?
												'В работе'
											: status === PlanStatus.ON_HOLD ?
												'На паузе'
											: status === PlanStatus.COMPLETED ?
												'Завершен'
											:	'Отменен',
										value: status,
									}),
								)}
							/>
						</Form.Item>

						<Form.Item
							name='priority'
							label='Приоритет'
							style={{ flex: 1 }}
						>
							<Select
								options={Object.values(PlanPriority).map(
									(priority) => ({
										label:
											priority === PlanPriority.LOW ?
												'Низкий'
											: priority === PlanPriority.MEDIUM ?
												'Средний'
											:	'Высокий',
										value: priority,
									}),
								)}
							/>
						</Form.Item>
					</div>

					<Form.Item
						name='assignees'
						label='Исполнители'
						rules={[
							{
								required: true,
								message: 'Выберите исполнителей',
							},
						]}
					>
						<Select
							mode='multiple'
							placeholder='Выберите исполнителей'
							value={
								plan ?
									plan.assignees.map((user) => user.email)
								:	null
							}
						>
							{team?.members?.map((user) => (
								<Select.Option
									key={user.id}
									value={user.id}
									label={user.name || user.email}
								>
									<div className={styles.assigneeOption}>
										<UserAvatar
											size='small'
											name={user.name || ''}
											email={user.email}
											avatar={user.image || ''}
										/>
										<span>{user.name || user.email}</span>
									</div>
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='progress'
						label='Прогресс выполнения (%)'
						rules={[
							{
								required: true,
								message: 'Укажите прогресс выполнения',
							},
							{
								type: 'number',
								min: 0,
								max: 100,
								message: 'Значение должно быть от 0 до 100',
							},
						]}
					>
						<InputNumber
							min={0}
							max={100}
							style={{ width: '100%' }}
						/>
					</Form.Item>

					<FormActions>
						<Button onClick={() => navigate('/admin/plans')}>
							Отмена
						</Button>
						<Button
							type='primary'
							htmlType='submit'
							icon={<SaveOutlined />}
							// loading={
							// 	createPlanMutation.isLoading ||
							// 	updatePlanMutation.isLoading
							// }
						>
							{isEditMode ?
								'Сохранить изменения'
							:	'Создать план'}
						</Button>
					</FormActions>
				</Form>
			</StyledCard>
		</Container>
	);
};

export default PlanForm;
