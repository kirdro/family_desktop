import {
	CloseCircleOutlined,
	DeleteFilled,
	EyeOutlined,
	PaperClipOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import {
	PreviewActions,
	PreviewFileItem,
	PreviewFilesSection,
	PreviewThumbnail,
	UploadActionsSection,
	UploadContainer,
} from '../../pages/plannings/styles';
import { Button, Divider, Space, Typography, Upload } from 'antd';
import React, { FC } from 'react';
import { getFileIcon } from './tools/getFileIcon';
import { formatFileSize } from './tools/formatFileSize';

const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;

interface PreviewFile {
	uid: string;
	name: string;
	size: number;
	type: string;
	previewUrl?: string; // url для предпросмотра, если это изображение
	file: File;
}

interface IProps {
	handleFileAdd: (file: File) => void;
	previewFiles: PreviewFile[];
	handlePreviewImage: (url: string) => void;
	handleRemoveFile: (uid: string) => void;
	clearPreviewFiles: () => void;
	handleUploadFiles: () => void;
	uploadLoading: boolean;
}

export const UploadFile: FC<IProps> = (props) => {
	const {
		handleFileAdd,
		previewFiles,
		handlePreviewImage,
		handleRemoveFile,
		clearPreviewFiles,
		handleUploadFiles,
		uploadLoading,
	} = props;

	return (
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
					Поддерживаются изображения, документы, архивы и другие типы
					файлов
				</p>
			</Dragger>

			{/* Секция предпросмотра файлов */}
			{previewFiles.length > 0 && (
				<PreviewFilesSection>
					<Divider orientation='left'>
						Файлы для загрузки ({previewFiles.length})
					</Divider>

					{previewFiles.map((file) => (
						<PreviewFileItem key={file.uid}>
							<Space>
								<PreviewThumbnail>
									{getFileIcon(file.type)}
								</PreviewThumbnail>
								<div>
									<Text strong>{file.name}</Text>
									<br />
									<Text type='secondary'>
										{formatFileSize(file.size)} •
										Подготовлен к загрузке
									</Text>
								</div>
							</Space>
							<PreviewActions>
								{file.previewUrl && (
									<Button
										type='text'
										icon={<EyeOutlined />}
										onClick={() =>
											handlePreviewImage(file.previewUrl!)
										}
									>
										Просмотр
									</Button>
								)}
								<Button
									type='text'
									danger
									icon={<DeleteFilled />}
									onClick={() => handleRemoveFile(file.uid)}
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
							Загрузить файлы ({previewFiles.length})
						</Button>
					</UploadActionsSection>
				</PreviewFilesSection>
			)}
		</UploadContainer>
	);
};
