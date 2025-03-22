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
	Modal,
	Image,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	UploadOutlined,
	FileOutlined,
	DownloadOutlined,
	ArrowLeftOutlined,
	FilePdfOutlined,
	FileExcelOutlined,
	FileWordOutlined,
	FileImageOutlined,
	FileZipOutlined,
	FilePptOutlined,
	FileTextOutlined,
	EyeOutlined,
	DeleteFilled,
	PaperClipOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';

import styled from 'styled-components';
import dayjs from 'dayjs';
import { useGeneralStore } from '../../store/useGeneralStore';
import UserAvatar from '../../components/common/UserAvatar';
import {
	IReqUpdatePlan,
	PlanFile,
	PlanPriority,
	PlanStatus,
} from '../../types/planning';
import { useUpdatePlan } from '../../api/useUpdatePlan';
import { usePostUploadFile } from '../../api/usePostUploadFile';
import { useCreatePlanFile } from '../../api/useCreatePlanFile';
import { useDeletePlan } from '../../api/useDeletePlan';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Dragger } = Upload;

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

const UploadContainer = styled.div`
	margin-bottom: 24px;
`;

const PreviewFilesSection = styled.div`
	margin-top: 16px;
	margin-bottom: 24px;
`;

const PreviewFileItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px;
	background: #2a2a2a;
	border-radius: 4px;
	margin-bottom: 8px;
	border: 1px dashed #444;
`;

const UploadActionsSection = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
	gap: 12px;
`;

const PreviewThumbnail = styled.div`
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	margin-right: 12px;
`;

const PreviewActions = styled.div`
	display: flex;
	gap: 8px;
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

	const { plans, user } = getGeneralStore();
	const { mutateAsync: uploadFile } = usePostUploadFile();
	const { mutateAsync: createFileMutation } = useCreatePlanFile();

	const plan = plans.find((p) => p.id === id);
	const { mutateAsync } = useUpdatePlan(plan ? plan.id : '');
	const { mutateAsync: deleteMutation } = useDeletePlan();

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
			// await deletePlanMutation.mutateAsync(plan.id);
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
			console.log('>>>>>>>><>>><<<>>', file);
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
			// Здесь должен быть код для загрузки файлов на сервер
			// Например, используя uploadFileMutation или axios
			if (plan && user) {
				for (const fileObj of previewFiles) {
					console.log('Uploading file:', fileObj);
					// await uploadFileMutation.mutateAsync(fileObj.file);
					const res = await uploadFile(fileObj.file);
					await createFileMutation({
						name: fileObj.name,
						size: fileObj.size,
						type: fileObj.type,
						url: res.url,
						planId: plan.id,
						userId: user.id,
					});
					// imageUrls.push(res.url);
					// Имитация загрузки для примера
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

	// Получение иконки файла по типу
	const getFileIcon = (fileType: string) => {
		if (fileType.startsWith('image/'))
			return <FileImageOutlined style={{ color: '#52c41a' }} />;
		if (fileType.includes('pdf'))
			return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
		if (
			fileType.includes('excel') ||
			fileType.includes('sheet') ||
			fileType.includes('csv')
		)
			return <FileExcelOutlined style={{ color: '#52c41a' }} />;
		if (fileType.includes('word') || fileType.includes('document'))
			return <FileWordOutlined style={{ color: '#1890ff' }} />;
		if (
			fileType.includes('zip') ||
			fileType.includes('rar') ||
			fileType.includes('tar') ||
			fileType.includes('gz')
		)
			return <FileZipOutlined style={{ color: '#faad14' }} />;
		if (
			fileType.includes('powerpoint') ||
			fileType.includes('presentation')
		)
			return <FilePptOutlined style={{ color: '#fa541c' }} />;
		if (fileType.includes('text'))
			return <FileTextOutlined style={{ color: '#d9d9d9' }} />;
		return <FileOutlined style={{ color: '#d9d9d9' }} />;
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
						<Button danger icon={<DeleteOutlined />}>
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

					<TabPane tab={`Файлы (${plan.files.length})`} key='files'>
						<UploadContainer>
							{/* Компонент для загрузки файлов с предпросмотром */}
							<Dragger
								multiple
								beforeUpload={(file) => handleFileAdd(file)}
								showUploadList={false}
								accept='image/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .zip, .rar'
							>
								<p className='ant-upload-drag-icon'>
									<UploadOutlined />
								</p>
								<p className='ant-upload-text'>
									Нажмите или перетащите файлы для загрузки
								</p>
								<p className='ant-upload-hint'>
									Поддерживаются изображения, документы,
									архивы и другие типы файлов
								</p>
							</Dragger>

							{/* Секция предпросмотра файлов */}
							{previewFiles.length > 0 && (
								<PreviewFilesSection>
									<Divider orientation='left'>
										Файлы для загрузки (
										{previewFiles.length})
									</Divider>

									{previewFiles.map((file) => (
										<PreviewFileItem key={file.uid}>
											<Space>
												<PreviewThumbnail>
													{getFileIcon(file.type)}
												</PreviewThumbnail>
												<div>
													<Text strong>
														{file.name}
													</Text>
													<br />
													<Text type='secondary'>
														{formatFileSize(
															file.size,
														)}{' '}
														• Подготовлен к загрузке
													</Text>
												</div>
											</Space>
											<PreviewActions>
												{file.previewUrl && (
													<Button
														type='text'
														icon={<EyeOutlined />}
														onClick={() =>
															handlePreviewImage(
																file.previewUrl!,
															)
														}
													>
														Просмотр
													</Button>
												)}
												<Button
													type='text'
													danger
													icon={<DeleteFilled />}
													onClick={() =>
														handleRemoveFile(
															file.uid,
														)
													}
												>
													Удалить
												</Button>
											</PreviewActions>
										</PreviewFileItem>
									))}

									<UploadActionsSection>
										<Button
											onClick={clearPreviewFiles}
											icon={<CloseCircleOutlined />}
										>
											Отменить все
										</Button>
										<Button
											type='primary'
											onClick={handleUploadFiles}
											loading={uploadLoading}
											icon={<PaperClipOutlined />}
										>
											Загрузить файлы (
											{previewFiles.length})
										</Button>
									</UploadActionsSection>
								</PreviewFilesSection>
							)}
						</UploadContainer>

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
		</Container>
	);
};

export default PlanDetail;
