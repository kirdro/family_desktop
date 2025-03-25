// PlanDetail.tsx с добавленным функционалом задач
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Typography,
	Space,
	Button,
	Tabs,
	List,
	Popconfirm,
	message,
	Empty,
	Modal,
	Image,
	Checkbox,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	DownloadOutlined,
	ArrowLeftOutlined,
	PlusOutlined,
} from '@ant-design/icons';

import dayjs from 'dayjs';
import { useGeneralStore } from '../../store/useGeneralStore';
import { IReqUpdatePlan, PlanFile, PlanStatus } from '../../types/planning';
import { useUpdatePlan } from '../../api/useUpdatePlan';
import { usePostUploadFile } from '../../api/usePostUploadFile';
import { useCreatePlanFile } from '../../api/useCreatePlanFile';
import { useDeletePlan } from '../../api/useDeletePlan';
import { usePatchUpdateTask } from '../../api';
import { ITask, Status } from '../../types';
import {
	ActionButtonsContainer,
	AddTaskButton,
	Container,
	FileItem,
	HeaderContainer,
	PreviewThumbnail,
	StyledCard,
} from './styles';
import { InfoBlock } from '../../components/planning/InfoBlock';
import { CustomTaskItem } from '../../components/planning/TaskItem';
import { UploadFile } from '../../components/planning/UploadFile';
import { getFileIcon } from '../../components/planning/tools/getFileIcon';
import { formatFileSize } from '../../components/planning/tools/formatFileSize';
import { TaskModal } from '../../components/planning/TaskModal';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Интерфейс для временных файлов с предпросмотром
interface PreviewFile {
	uid: string;
	name: string;
	size: number;
	type: string;
	previewUrl?: string; // url для предпросмотра, если это изображение
	file: File;
}

const PlanDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('info');
	const { getGeneralStore } = useGeneralStore();

	// Состояние для хранения предпросмотра файлов
	const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
	const [uploadModalVisible, setUploadModalVisible] = useState(false);
	const [previewModalVisible, setPreviewModalVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [uploadLoading, setUploadLoading] = useState(false);

	// Состояние для модального окна задачи
	const [taskModalVisible, setTaskModalVisible] = useState(false);
	const [currentTask, setCurrentTask] = useState<ITask | null>(null);
	const [newComment, setNewComment] = useState('');

	const { plans, user, tasks } = getGeneralStore();
	const { mutateAsync: uploadFile } = usePostUploadFile();
	const { mutateAsync: createFileMutation } = useCreatePlanFile();
	const { mutateAsync: updateTask } = usePatchUpdateTask();

	const plan = plans.find((p) => p.id === id);
	const { mutateAsync } = useUpdatePlan(plan ? plan.id : '');
	const { mutateAsync: deleteMutation } = useDeletePlan();

	// Получаем задачи, связанные с текущим планом
	const planTasks = tasks.filter((task) => task.planId === id);

	const handleStatusChange = async (newStatus: PlanStatus) => {
		const updates: IReqUpdatePlan = { status: newStatus };

		if (newStatus === PlanStatus.COMPLETED) {
			updates.progress = 100;
		} else if (newStatus === PlanStatus.CANCELLED) {
		}
		await mutateAsync(updates);
	};

	const handleDelete = async () => {
		try {
			if (plan) {
				await deleteMutation(plan.id);
				message.success('План успешно удален');
				navigate('/admin/plans');
			}
		} catch (err) {
			console.log(err);
			message.error('Ошибка при удалении плана');
		}
	};

	// Функция для добавления файла в предпросмотр
	const handleFileAdd = (file: File) => {
		// Создаем временный URL для предпросмотра (только для изображений)
		let previewUrl: string | undefined = undefined;
		if (file.type.startsWith('image/')) {
			previewUrl = URL.createObjectURL(file);
		}

		const newPreviewFile: PreviewFile = {
			uid: `preview-${Date.now()}-${file.name}`,
			name: file.name,
			size: file.size,
			type: file.type,
			previewUrl,
			file,
		};

		setPreviewFiles((prev) => [...prev, newPreviewFile]);

		// Показываем модальное окно, если это первый файл
		if (previewFiles.length === 0) {
			setUploadModalVisible(true);
		}

		return false; // предотвращаем стандартное поведение Upload
	};

	// Удаление файла из предпросмотра
	const handleRemoveFile = (uid: string) => {
		setPreviewFiles((prev) => {
			const fileToRemove = prev.find((f) => f.uid === uid);
			if (fileToRemove?.previewUrl) {
				URL.revokeObjectURL(fileToRemove.previewUrl);
			}
			return prev.filter((f) => f.uid !== uid);
		});
	};

	// Предпросмотр изображения
	const handlePreviewImage = (url: string) => {
		setPreviewImage(url);
		setPreviewModalVisible(true);
	};

	// Загрузка файлов на сервер
	const handleUploadFiles = async () => {
		if (previewFiles.length === 0) return;

		setUploadLoading(true);
		try {
			if (plan && user) {
				for (const fileObj of previewFiles) {
					console.log('Uploading file:', fileObj);
					const res = await uploadFile(fileObj.file);
					await createFileMutation({
						name: fileObj.name,
						size: fileObj.size,
						type: fileObj.type,
						url: res.url,
						planId: plan.id,
						userId: user.id,
					});
				}
			}

			// Очищаем предпросмотр и закрываем модальное окно
			clearPreviewFiles();
			setUploadModalVisible(false);
		} catch (error) {
			console.error('Error uploading files:', error);
			message.error('Ошибка при загрузке файлов');
		} finally {
			setUploadLoading(false);
		}
	};

	// Очистка всех предпросмотров
	const clearPreviewFiles = () => {
		previewFiles.forEach((file) => {
			if (file.previewUrl) {
				URL.revokeObjectURL(file.previewUrl);
			}
		});
		setPreviewFiles([]);
	};

	// Обработчик для открытия модального окна задачи
	const handleOpenTaskModal = (task: ITask) => {
		setCurrentTask(task);
		setTaskModalVisible(true);
	};

	// Обработчик для изменения статуса задачи
	const handleTaskStatusChange = async (
		taskId: string,
		newStatus: Status,
	) => {
		try {
			const task = tasks.find((t) => t.id === taskId);
			if (!task) return;

			const _data = {
				taskId: task.id,
				startDate: task.startDate,
				status: newStatus,
				emailAssigns: task.assignees.map((t) => t.email),
				tags: task.tags.map((t) => t.id),
				planId: id,
			};

			await updateTask(_data);
			message.success('Статус задачи обновлен');

			// Обновляем текущую задачу в модальном окне если она открыта
			if (currentTask && currentTask.id === taskId) {
				setCurrentTask({
					...currentTask,
					status: newStatus,
				});
			}
		} catch (error) {
			console.error('Error updating task status:', error);
			message.error('Не удалось обновить статус задачи');
		}
	};

	// Обработчик отметки задачи как выполненной
	const handleToggleTaskComplete = async (taskId: string) => {
		try {
			const task = tasks.find((t) => t.id === taskId);
			if (!task) return;

			const newStatus =
				task.status === Status.DONE ? Status.IN_PROGRESS : Status.DONE;

			const _data = {
				taskId: task.id,
				startDate: task.startDate,
				status: newStatus,
				emailAssigns: task.assignees.map((t) => t.email),
				tags: task.tags.map((t) => t.id),
				planId: id,
			};

			await updateTask(_data);
			message.success(
				newStatus === Status.DONE ?
					'Задача отмечена как выполненная'
				:	'Задача возвращена в работу',
			);

			// Обновляем текущую задачу в модальном окне если она открыта
			if (currentTask && currentTask.id === taskId) {
				setCurrentTask({
					...currentTask,
					status: newStatus,
				});
			}
		} catch (error) {
			console.error('Error toggling task completion:', error);
			message.error('Не удалось обновить статус задачи');
		}
	};

	// Обработчик добавления комментария к задаче
	const handleAddComment = async () => {
		if (!newComment.trim() || !currentTask) return;

		try {
			// Здесь должен быть вызов API для добавления комментария
			// const response = await addTaskComment(currentTask.id, newComment);

			// Временная имитация добавления комментария (в реальном приложении замените на API)
			const tempComment = {
				id: `temp-${Date.now()}`,
				text: newComment,
				createdAt: new Date().toISOString(),
				author: {
					id: user?.id || '',
					name: user?.name || '',
					email: user?.email || '',
					image: user?.image || '',
				},
			};

			// Обновляем текущую задачу в модальном окне
			// setCurrentTask({
			// 	...currentTask,
			// 	comments: [...(currentTask.comments || []), tempComment],
			// });

			setNewComment('');
			message.success('Комментарий добавлен');
		} catch (error) {
			console.error('Error adding comment:', error);
			message.error('Не удалось добавить комментарий');
		}
	};

	// Обработчик переключения статуса подзадачи
	const handleToggleSubtask = async (
		taskId: string,
		subtaskId: string,
		completed: boolean,
	) => {
		try {
			// Здесь должен быть вызов API для обновления статуса подзадачи
			// const response = await updateSubtask(subtaskId, { completed });

			// Временная имитация обновления подзадачи (в реальном приложении замените на API)
			if (currentTask && currentTask.id === taskId) {
				const updatedSubTasks =
					currentTask.subTasks?.map((st) =>
						st.id === subtaskId ? { ...st, completed } : st,
					) || [];

				setCurrentTask({
					...currentTask,
					subTasks: updatedSubTasks,
				});
			}

			message.success(
				completed ?
					'Подзадача выполнена'
				:	'Подзадача возвращена в работу',
			);
		} catch (error) {
			console.error('Error updating subtask:', error);
			message.error('Не удалось обновить статус подзадачи');
		}
	};

	// Функция для создания новой задачи
	const handleCreateTask = () => {
		navigate(`/admin/tasks/create`, {
			state: { planId: id, initialValues: { planId: id } },
		});
	};

	// Получение иконки файла по типу

	// Форматирование даты

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
						<Button danger icon={<DeleteOutlined />}>
							Удалить
						</Button>
					</Popconfirm>
				</ActionButtonsContainer>
			</HeaderContainer>

			<StyledCard>
				<Tabs activeKey={activeTab} onChange={setActiveTab}>
					<TabPane tab='Информация' key='info'>
						<InfoBlock
							plan={plan}
							handleStatusChange={handleStatusChange}
						/>
					</TabPane>

					{/* Новая вкладка для задач */}
					<TabPane tab={`Задачи (${planTasks.length})`} key='tasks'>
						<AddTaskButton
							type='primary'
							icon={<PlusOutlined />}
							onClick={handleCreateTask}
						>
							Добавить задачу
						</AddTaskButton>

						{planTasks.length === 0 ?
							<Empty description='Нет задач, связанных с этим планом' />
						:	<List
								dataSource={planTasks}
								renderItem={(task) => (
									<CustomTaskItem
										task={task}
										handleToggleTaskComplete={
											handleToggleTaskComplete
										}
										handleOpenTaskModal={
											handleOpenTaskModal
										}
									/>
								)}
							/>
						}
					</TabPane>

					<TabPane tab={`Файлы (${plan.files.length})`} key='files'>
						<UploadFile
							handleRemoveFile={handleRemoveFile}
							previewFiles={previewFiles}
							handleFileAdd={handleFileAdd}
							handlePreviewImage={handlePreviewImage}
							handleUploadFiles={handleUploadFiles}
							clearPreviewFiles={clearPreviewFiles}
							uploadLoading={uploadLoading}
						/>

						{/* Список уже загруженных файлов */}
						{plan.files.length === 0 && previewFiles.length === 0 ?
							<Empty description='Нет файлов' />
						:	<List
								dataSource={plan.files}
								renderItem={(file: PlanFile) => (
									<FileItem>
										<Space>
											<PreviewThumbnail>
												{getFileIcon(file.type)}
											</PreviewThumbnail>
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
				</Tabs>
			</StyledCard>

			{/* Модальное окно предпросмотра изображения */}
			<Modal
				visible={previewModalVisible}
				footer={null}
				onCancel={() => setPreviewModalVisible(false)}
				width={800}
				centered
			>
				<Image
					alt='Предпросмотр изображения'
					style={{ width: '100%' }}
					src={previewImage}
					preview={false}
				/>
			</Modal>

			{/* Модальное окно детальной информации о задаче */}
			<Modal
				title={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Checkbox
							checked={currentTask?.status === Status.DONE}
							onChange={() =>
								currentTask &&
								handleToggleTaskComplete(currentTask.id)
							}
							style={{ marginRight: 12 }}
						/>
						<span>{currentTask?.title}</span>
					</div>
				}
				visible={taskModalVisible}
				onCancel={() => setTaskModalVisible(false)}
				width={700}
				footer={[
					<Button
						key='close'
						onClick={() => setTaskModalVisible(false)}
					>
						Закрыть
					</Button>,
					<Button
						key='open'
						type='primary'
						onClick={() =>
							navigate(`/admin/tasks/${currentTask?.id}`)
						}
					>
						Открыть страницу задачи
					</Button>,
				]}
			>
				{currentTask && (
					<TaskModal
						task={currentTask}
						handleTaskStatusChange={handleTaskStatusChange}
						handleAddComment={handleAddComment}
						newComment={newComment}
						setNewComment={setNewComment}
						handleToggleSubtask={handleToggleSubtask}
					/>
				)}
			</Modal>
		</Container>
	);
};

export default PlanDetail;
