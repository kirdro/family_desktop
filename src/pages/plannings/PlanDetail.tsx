// PlanDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Card,
	Typography,
	Descriptions,
	Tag,
	Space,
	Button,
	Avatar,
	Progress,
	Tabs,
	List,
	Upload,
	Tooltip,
	Divider,
	Popconfirm,
	message,
	Empty,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	UploadOutlined,
	FileOutlined,
	DownloadOutlined,
	ArrowLeftOutlined,
} from '@ant-design/icons';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useGeneralStore } from '../../store/useGeneralStore';
import UserAvatar from '../../components/common/UserAvatar';
import { PlanFile, PlanPriority, PlanStatus } from '../../types/planning';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

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

const ActionButtonsContainer = styled.div`
	display: flex;
	gap: 12px;
`;

const TagContainer = styled.div`
	margin-top: 16px;
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
`;

const FileItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background: #2a2a2a;
	border-radius: 4px;
	margin-bottom: 8px;
`;

const statusColors = {
	[PlanStatus.NEW]: 'blue',
	[PlanStatus.IN_PROGRESS]: 'green',
	[PlanStatus.ON_HOLD]: 'orange',
	[PlanStatus.COMPLETED]: 'purple',
	[PlanStatus.CANCELLED]: 'red',
};

const priorityColors = {
	[PlanPriority.LOW]: 'green',
	[PlanPriority.MEDIUM]: 'blue',
	[PlanPriority.HIGH]: 'red',
};

const statusLabels = {
	[PlanStatus.NEW]: 'Новый',
	[PlanStatus.IN_PROGRESS]: 'В работе',
	[PlanStatus.ON_HOLD]: 'На паузе',
	[PlanStatus.COMPLETED]: 'Завершен',
	[PlanStatus.CANCELLED]: 'Отменен',
};

const priorityLabels = {
	[PlanPriority.LOW]: 'Низкий',
	[PlanPriority.MEDIUM]: 'Средний',
	[PlanPriority.HIGH]: 'Высокий',
};

const PlanDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('info');
	const { getGeneralStore } = useGeneralStore();

	const { plans } = getGeneralStore();

	const plan = plans.find((p) => p.id === id);

	// const { data: plan, isLoading } = usePlan(id!);
	// const updatePlanMutation = useUpdatePlan();
	// const deletePlanMutation = useDeletePlan();
	// const uploadFileMutation = useUploadPlanFile(id!);
	// const addCommentMutation = useAddComment();

	// if (isLoading || !plan) {
	// 	return (
	// 		<Container>
	// 			<StyledCard>
	// 				<Skeleton active />
	// 			</StyledCard>
	// 		</Container>
	// 	);
	// }

	const handleStatusChange = (newStatus: PlanStatus) => {
		// let updates: Partial<Plan> = { status: newStatus };
		//
		// if (newStatus === PlanStatus.COMPLETED) {
		// 	updates.completedAt = new Date().toISOString();
		// 	updates.progress = 100;
		// } else if (newStatus === PlanStatus.CANCELLED) {
		// 	updates.cancelledAt = new Date().toISOString();
		// }
		// updatePlanMutation.mutate({ id: plan.id, ...updates });
	};

	const handleDelete = async () => {
		try {
			// await deletePlanMutation.mutateAsync(plan.id);
			message.success('План успешно удален');
			navigate('/admin/plans');
		} catch (err) {
			console.log(err);
			message.error('Ошибка при удалении плана');
		}
	};

	const handleFileUpload = (file: File) => {
		// uploadFileMutation.mutate(file);
		return false; // предотвращаем стандартное поведение Upload
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' bytes';
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
		else return (bytes / 1048576).toFixed(1) + ' MB';
	};

	const getDaysLeft = () => {
		const endDate = dayjs(plan?.endDate);
		const today = dayjs();
		return endDate.diff(today, 'day');
	};
	if (!plan) {
		return <div>... загрузка</div>;
	}

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
						{plan?.title}
					</Title>
				</Space>

				<ActionButtonsContainer>
					<Button
						icon={<EditOutlined />}
						onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}
					>
						Редактировать
					</Button>

					<Popconfirm
						title='Вы уверены, что хотите удалить план?'
						onConfirm={handleDelete}
						okText='Да'
						cancelText='Нет'
					>
						<Button
							danger
							icon={<DeleteOutlined />}
							// loading={deletePlanMutation.isLoading}
						>
							Удалить
						</Button>
					</Popconfirm>
				</ActionButtonsContainer>
			</HeaderContainer>

			<StyledCard>
				<Tabs activeKey={activeTab} onChange={setActiveTab}>
					<TabPane tab='Информация' key='info'>
						<Space direction='vertical' style={{ width: '100%' }}>
							<TagContainer>
								<Tag color={statusColors[plan.status]}>
									{statusLabels[plan.status]}
								</Tag>
								<Tag color={priorityColors[plan.priority]}>
									{priorityLabels[plan.priority]}
								</Tag>
								{getDaysLeft() < 0 ?
									<Tag color='red'>
										Просрочен на {Math.abs(getDaysLeft())}{' '}
										дн.
									</Tag>
								:	<Tag color='blue'>
										Осталось {getDaysLeft()} дн.
									</Tag>
								}
							</TagContainer>

							<Progress
								percent={plan?.progress}
								status={
									plan?.progress === 100 ?
										'success'
									:	'active'
								}
								style={{ marginTop: 16 }}
							/>

							<Descriptions
								bordered
								column={2}
								style={{ marginTop: 24 }}
							>
								<Descriptions.Item label='Дата начала'>
									{dayjs(plan.startDate).format('DD.MM.YYYY')}
								</Descriptions.Item>
								<Descriptions.Item label='Дата окончания'>
									{dayjs(plan.endDate).format('DD.MM.YYYY')}
								</Descriptions.Item>
								<Descriptions.Item label='Создан'>
									{dayjs(plan.createdAt).format(
										'DD.MM.YYYY HH:mm',
									)}
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
										{dayjs(plan.completedAt).format(
											'DD.MM.YYYY HH:mm',
										)}
									</Descriptions.Item>
								)}
								{plan.cancelledAt && (
									<Descriptions.Item label='Отменен'>
										{dayjs(plan.cancelledAt).format(
											'DD.MM.YYYY HH:mm',
										)}
									</Descriptions.Item>
								)}
							</Descriptions>

							<Divider orientation='left'>Описание</Divider>
							<Paragraph>
								{plan.description || 'Описание отсутствует'}
							</Paragraph>

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

							<Divider orientation='left'>
								Управление статусом
							</Divider>
							<Space>
								<Button
									type={
										plan.status === PlanStatus.NEW ?
											'primary'
										:	'default'
									}
									onClick={() =>
										handleStatusChange(PlanStatus.NEW)
									}
								>
									Новый
								</Button>
								<Button
									type={
										plan.status === PlanStatus.IN_PROGRESS ?
											'primary'
										:	'default'
									}
									onClick={() =>
										handleStatusChange(
											PlanStatus.IN_PROGRESS,
										)
									}
								>
									В работе
								</Button>
								<Button
									type={
										plan.status === PlanStatus.ON_HOLD ?
											'primary'
										:	'default'
									}
									onClick={() =>
										handleStatusChange(PlanStatus.ON_HOLD)
									}
								>
									На паузе
								</Button>
								<Button
									type={
										plan.status === PlanStatus.COMPLETED ?
											'primary'
										:	'default'
									}
									onClick={() =>
										handleStatusChange(PlanStatus.COMPLETED)
									}
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
									onClick={() =>
										handleStatusChange(PlanStatus.CANCELLED)
									}
								>
									Отменен
								</Button>
							</Space>
						</Space>
					</TabPane>

					{/*<TabPane tab={`Задачи (${plan.tasks.length})`} key='tasks'>*/}
					{/*	<Button*/}
					{/*		type='primary'*/}
					{/*		icon={<PlusOutlined />}*/}
					{/*		style={{ marginBottom: 16 }}*/}
					{/*		onClick={() =>*/}
					{/*			navigate(`/admin/plans/${plan.id}/tasks/create`)*/}
					{/*		}*/}
					{/*	>*/}
					{/*		Добавить задачу*/}
					{/*	</Button>*/}

					{/*	{plan.tasks.length === 0 ?*/}
					{/*		<Empty description='Нет задач' />*/}
					{/*	:	<List*/}
					{/*			dataSource={plan.tasks}*/}
					{/*			renderItem={(task: Task) => (*/}
					{/*				<TaskItem>*/}
					{/*					<Checkbox*/}
					{/*						checked={task.completed}*/}
					{/*						style={{ marginRight: 8 }}*/}
					{/*					/>*/}
					{/*					<div>*/}
					{/*						<Text strong>{task.title}</Text>*/}
					{/*						{task.description && (*/}
					{/*							<Paragraph*/}
					{/*								ellipsis={{ rows: 2 }}*/}
					{/*								type='secondary'*/}
					{/*							>*/}
					{/*								{task.description}*/}
					{/*							</Paragraph>*/}
					{/*						)}*/}
					{/*					</div>*/}
					{/*				</TaskItem>*/}
					{/*			)}*/}
					{/*		/>*/}
					{/*	}*/}
					{/*</TabPane>*/}

					<TabPane tab={`Файлы (${plan.files.length})`} key='files'>
						<Upload
							customRequest={({ file }) => {
								if (file instanceof File) {
									handleFileUpload(file);
								}
							}}
							showUploadList={false}
							multiple
						>
							<Button
								icon={<UploadOutlined />}
								style={{ marginBottom: 16 }}
							>
								Загрузить файлы
							</Button>
						</Upload>

						{plan.files.length === 0 ?
							<Empty description='Нет файлов' />
						:	<List
								dataSource={plan.files}
								renderItem={(file: PlanFile) => (
									<FileItem>
										<Space>
											<FileOutlined />
											<div>
												<Text strong>{file.name}</Text>
												<br />
												<Text type='secondary'>
													{formatFileSize(file.size)}{' '}
													•{' '}
													{dayjs(
														file.uploadedAt,
													).format('DD.MM.YYYY')}
												</Text>
											</div>
										</Space>
										<Button
											icon={<DownloadOutlined />}
											type='link'
											href={file.url}
											target='_blank'
										>
											Скачать
										</Button>
									</FileItem>
								)}
							/>
						}
					</TabPane>

					{/*<TabPane*/}
					{/*	tab={`Комментарии (${plan.comments.length})`}*/}
					{/*	key='comments'*/}
					{/*>*/}
					{/*	<Form>*/}
					{/*		<Form.Item>*/}
					{/*			<TextArea*/}
					{/*				rows={4}*/}
					{/*				value={commentText}*/}
					{/*				onChange={(e) =>*/}
					{/*					setCommentText(e.target.value)*/}
					{/*				}*/}
					{/*				placeholder='Добавьте комментарий...'*/}
					{/*			/>*/}
					{/*		</Form.Item>*/}
					{/*		<Form.Item>*/}
					{/*			<Button*/}
					{/*				htmlType='submit'*/}
					{/*				// loading={addCommentMutation.isLoading}*/}
					{/*				type='primary'*/}
					{/*				onClick={handleSubmitComment}*/}
					{/*				disabled={!commentText.trim()}*/}
					{/*			>*/}
					{/*				Добавить комментарий*/}
					{/*			</Button>*/}
					{/*		</Form.Item>*/}
					{/*	</Form>*/}

					{/*	<CommentList>*/}
					{/*		{plan.comments.length === 0 ?*/}
					{/*			<Empty description='Нет комментариев' />*/}
					{/*		:	<List*/}
					{/*				dataSource={plan.comments.filter(*/}
					{/*					(comment) => !comment.parentId,*/}
					{/*				)}*/}
					{/*				renderItem={(comment: PlanComment) => (*/}
					{/*					<Comment*/}
					{/*						author={comment.author.name}*/}
					{/*						avatar={*/}
					{/*							<Avatar*/}
					{/*								icon={<UserOutlined />}*/}
					{/*							/>*/}
					{/*						}*/}
					{/*						content={comment.text}*/}
					{/*						datetime={dayjs(*/}
					{/*							comment.createdAt,*/}
					{/*						).format('DD.MM.YYYY HH:mm')}*/}
					{/*					>*/}
					{/*						{comment.replies.map((reply) => (*/}
					{/*							<Comment*/}
					{/*								key={reply.id}*/}
					{/*								author={reply.author.name}*/}
					{/*								avatar={*/}
					{/*									<Avatar*/}
					{/*										icon={*/}
					{/*											<UserOutlined />*/}
					{/*										}*/}
					{/*									/>*/}
					{/*								}*/}
					{/*								content={reply.text}*/}
					{/*								datetime={dayjs(*/}
					{/*									reply.createdAt,*/}
					{/*								).format(*/}
					{/*									'DD.MM.YYYY HH:mm',*/}
					{/*								)}*/}
					{/*							/>*/}
					{/*						))}*/}
					{/*					</Comment>*/}
					{/*				)}*/}
					{/*			/>*/}
					{/*		}*/}
					{/*	</CommentList>*/}
					{/*</TabPane>*/}
				</Tabs>
			</StyledCard>
		</Container>
	);
};

export default PlanDetail;
