import { TagContainer } from '../../pages/plannings/styles';
import {
	Avatar,
	Button,
	Descriptions,
	Divider,
	Progress,
	Space,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import dayjs from 'dayjs';
import UserAvatar from '../common/UserAvatar';
import { Plan, PlanStatus } from '../../types/planning';
import React, { FC } from 'react';
import {
	priorityColors,
	priorityLabels,
	statusColors,
	statusLabels,
} from './settings/statuses';
import { getDaysLeft } from './tools/getDaysLeft';
const { Paragraph } = Typography;

interface IProps {
	plan: Plan;
	handleStatusChange: (newStatus: PlanStatus) => void;
}

export const InfoBlock: FC<IProps> = (props) => {
	const { plan, handleStatusChange } = props;

	return (
		<Space direction='vertical' style={{ width: '100%' }}>
			<TagContainer>
				<Tag color={statusColors[plan.status]}>
					{statusLabels[plan.status]}
				</Tag>
				<Tag color={priorityColors[plan.priority]}>
					{priorityLabels[plan.priority]}
				</Tag>
				{getDaysLeft(plan) < 0 ?
					<Tag color='red'>
						Просрочен на {Math.abs(getDaysLeft(plan))} дн.
					</Tag>
				:	<Tag color='blue'>Осталось {getDaysLeft(plan)} дн.</Tag>}
			</TagContainer>

			<Progress
				percent={plan?.progress}
				status={plan?.progress === 100 ? 'success' : 'active'}
				style={{ marginTop: 16 }}
			/>

			<Descriptions bordered column={2} style={{ marginTop: 24 }}>
				<Descriptions.Item label='Дата начала'>
					{dayjs(plan.startDate).format('DD.MM.YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label='Дата окончания'>
					{dayjs(plan.endDate).format('DD.MM.YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label='Создан'>
					{dayjs(plan.createdAt).format('DD.MM.YYYY HH:mm')}
				</Descriptions.Item>
				<Descriptions.Item label='Автор'>
					<Space>
						<UserAvatar
							size='default'
							name={plan.author.name || ''}
							email={plan.author.email}
							avatar={plan.author.image || ''}
						/>

						{plan.author.name || plan.author.email}
					</Space>
				</Descriptions.Item>
				<Descriptions.Item label='Команда' span={2}>
					{plan.team.name}
				</Descriptions.Item>
				{plan.completedAt && (
					<Descriptions.Item label='Завершен'>
						{dayjs(plan.completedAt).format('DD.MM.YYYY HH:mm')}
					</Descriptions.Item>
				)}
				{plan.cancelledAt && (
					<Descriptions.Item label='Отменен'>
						{dayjs(plan.cancelledAt).format('DD.MM.YYYY HH:mm')}
					</Descriptions.Item>
				)}
			</Descriptions>

			<Divider orientation='left'>Описание</Divider>
			<Paragraph>{plan.description || 'Описание отсутствует'}</Paragraph>

			<Divider orientation='left'>Исполнители</Divider>
			<Avatar.Group maxCount={5}>
				{plan.assignees.map((user) => (
					<Tooltip key={user.id} title={user.name}>
						<UserAvatar
							size='default'
							name={user.name || ''}
							email={user.email}
							avatar={user.image || ''}
						/>
					</Tooltip>
				))}
			</Avatar.Group>

			<Divider orientation='left'>Управление статусом</Divider>
			<Space>
				<Button
					type={
						plan.status === PlanStatus.NEW ? 'primary' : 'default'
					}
					onClick={() => handleStatusChange(PlanStatus.NEW)}
				>
					Новый
				</Button>
				<Button
					type={
						plan.status === PlanStatus.IN_PROGRESS ?
							'primary'
						:	'default'
					}
					onClick={() => handleStatusChange(PlanStatus.IN_PROGRESS)}
				>
					В работе
				</Button>
				<Button
					type={
						plan.status === PlanStatus.ON_HOLD ?
							'primary'
						:	'default'
					}
					onClick={() => handleStatusChange(PlanStatus.ON_HOLD)}
				>
					На паузе
				</Button>
				<Button
					type={
						plan.status === PlanStatus.COMPLETED ?
							'primary'
						:	'default'
					}
					onClick={() => handleStatusChange(PlanStatus.COMPLETED)}
				>
					Завершен
				</Button>
				<Button
					danger
					type={
						plan.status === PlanStatus.CANCELLED ?
							'primary'
						:	'default'
					}
					onClick={() => handleStatusChange(PlanStatus.CANCELLED)}
				>
					Отменен
				</Button>
			</Space>
		</Space>
	);
};
