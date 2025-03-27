// PlansList.tsx
import React, { useState } from 'react';
import {
	Table,
	Tag,
	Button,
	Space,
	Progress,
	Typography,
	Card,
	Select,
	DatePicker,
	Input,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { PlanPriority, PlanStatus, Plan } from '../../types/planning';
import { useGeneralStore } from '../../store/useGeneralStore';
import { useDeletePlan } from '../../api/useDeletePlan';
import {
	priorityColors,
	priorityLabels,
	statusColors,
	statusLabels,
} from '../../components/planning/settings/statuses';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Container = styled.div`
	padding: 24px;
`;

const StyledCard = styled(Card)`
	background: #1f1f1f;
	border-radius: 8px;
	margin-bottom: 16px;
`;

const FilterContainer = styled.div`
	display: flex;
	gap: 16px;
	margin-bottom: 24px;
	flex-wrap: wrap;
	align-items: center;
`;

const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
`;

const PlansList: React.FC = () => {
	const navigate = useNavigate();
	const [teamId, setTeamId] = useState<number | undefined>(undefined);
	const [statusFilter, setStatusFilter] = useState<PlanStatus | undefined>(
		undefined,
	);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const { getGeneralStore } = useGeneralStore();
	const { mutateAsync: deleteMutation } = useDeletePlan();

	const { plans } = getGeneralStore();

	const filteredPlans = React.useMemo(() => {
		if (!plans) return [];

		return plans.filter((plan: Plan) => {
			const matchesStatus = !statusFilter || plan.status === statusFilter;
			const matchesSearch =
				!searchTerm ||
				plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(plan.description &&
					plan.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()));

			return matchesStatus && matchesSearch;
		});
	}, [plans, statusFilter, searchTerm]);

	const columns = [
		{
			title: 'Название',
			dataIndex: 'title',
			key: 'title',
			render: (text: string) => <Text>{text}</Text>,
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
			render: (status: PlanStatus) => (
				<Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
			),
		},
		{
			title: 'Приоритет',
			dataIndex: 'priority',
			key: 'priority',
			render: (priority: PlanPriority) => (
				<Tag color={priorityColors[priority]}>
					{priorityLabels[priority]}
				</Tag>
			),
		},
		{
			title: 'Прогресс',
			dataIndex: 'progress',
			key: 'progress',
			render: (progress: number) => (
				<Progress percent={progress} size='small' />
			),
		},
		{
			title: 'Команда',
			dataIndex: 'team',
			key: 'team',
			render: (team: { name: string }) => team.name,
		},
		{
			title: 'Даты',
			key: 'dates',
			render: (_: string, plan: Plan) => (
				<span>
					{dayjs(plan.startDate).format('DD.MM.YYYY')} -{' '}
					{dayjs(plan.endDate).format('DD.MM.YYYY')}
				</span>
			),
		},
		{
			title: 'Исполнители',
			key: 'assignees',
			render: (_: string, plan: Plan) => (
				<span>{plan.assignees.length} человек</span>
			),
		},
		{
			title: 'Задачи',
			key: 'tasks',
			render: (_: string, plan: Plan) => {
				console.log('sdfagasdfasdf', plan, plan.tasks);
				return <span>{plan.tasks?.length} Задач(а)</span>;
			},
		},
		{
			title: 'Действия',
			key: 'action',
			render: (_: string, plan: Plan) => (
				<Space size='middle'>
					<Button
						type='link'
						onClick={() => navigate(`/admin/plans/${plan.id}`)}
					>
						Открыть
					</Button>
					<Button
						danger
						onClick={async () => await deleteMutation(plan.id)}
					>
						Удалить
					</Button>
				</Space>
			),
		},
	];

	return (
		<Container>
			<HeaderContainer>
				<Title level={2}>Планирование</Title>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => navigate('/admin/plans/create')}
				>
					Создать план
				</Button>
			</HeaderContainer>

			<StyledCard>
				<FilterContainer>
					<Input
						placeholder='Поиск по названию'
						prefix={<SearchOutlined />}
						style={{ width: 250 }}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					<Select
						placeholder='Фильтр по статусу'
						style={{ width: 180 }}
						allowClear
						value={statusFilter}
						onChange={setStatusFilter}
						options={Object.values(PlanStatus).map((status) => ({
							label: statusLabels[status],
							value: status,
						}))}
					/>

					<Select
						placeholder='Фильтр по команде'
						style={{ width: 180 }}
						allowClear
						value={teamId}
						onChange={setTeamId}
						options={[
							{ label: 'Команда 1', value: 1 },
							{ label: 'Команда 2', value: 2 },
							// Здесь должны быть реальные команды из API
						]}
					/>

					<RangePicker
						placeholder={['Дата начала', 'Дата окончания']}
					/>
				</FilterContainer>

				<Table
					columns={columns}
					dataSource={filteredPlans}
					rowKey='id'
					// loading={isLoading}
					pagination={{ pageSize: 10 }}
				/>
			</StyledCard>
		</Container>
	);
};

export default PlansList;
