import styles from '../../pages/tasks/TasksStyles.module.css';
import {
	Avatar,
	Badge,
	Button,
	Card,
	Col,
	Row,
	Tooltip,
	Typography,
} from 'antd';
import { getPriorityTag } from '../../settings/tasks/getPriorityTag';
import TaskTags from './TaskTags';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { ITask } from '../../types';
import { IStatusTitles } from '../../types/tasks';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface IProps {
	filteredTasks: ITask[];
	statusColumns: string[];
	statusTitles: IStatusTitles;
}

export const KanbanBoard: FC<IProps> = (props) => {
	const { filteredTasks, statusColumns, statusTitles } = props;

	const navigate = useNavigate();

	return (
		<div className={styles.kanbanContainer}>
			<Row gutter={16} className={styles.kanbanRow}>
				{statusColumns.map((status: string) => {
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
									<Text strong>{statusTitles[status]}</Text>
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
												{getPriorityTag(task.priority)}
											</div>

											{task.description && (
												<Text
													type='secondary'
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
																			user.image
																		}
																		icon={
																			!user.image && (
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
											className={styles.emptyKanbanColumn}
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
											navigate('/admin/tasks/create', {
												state: {
													defaultStatus: status,
												},
											})
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
