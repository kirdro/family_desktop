// FileListItem.tsx
import React from 'react';
import { Button, Tooltip, Space, Typography } from 'antd';
import {
	FileOutlined,
	DownloadOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { PlanFile } from '../../types/building.ts';

const { Text } = Typography;

interface FileListItemProps {
	file: PlanFile;
	onDelete?: (fileId: string) => void;
}

const FileContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #2a2a2a;
	padding: 12px 16px;
	border-radius: 4px;
	margin-bottom: 8px;
`;

const FileInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const FileIcon = styled(FileOutlined)`
	font-size: 24px;
	color: #1890ff;
`;

const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return bytes + ' bytes';
	else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
	else return (bytes / 1048576).toFixed(1) + ' MB';
};

const FileListItem: React.FC<FileListItemProps> = ({ file, onDelete }) => {
	return (
		<FileContainer>
			<FileInfo>
				<FileIcon />
				<div>
					<Text strong>{file.name}</Text>
					<br />
					<Text type='secondary'>
						{formatFileSize(file.size)} •{' '}
						{dayjs(file.uploadedAt).format('DD.MM.YYYY')}
					</Text>
				</div>
			</FileInfo>

			<Space>
				<Tooltip title='Скачать файл'>
					<Button
						type='link'
						icon={<DownloadOutlined />}
						href={file.url}
						target='_blank'
					/>
				</Tooltip>

				{onDelete && (
					<Tooltip title='Удалить файл'>
						<Button
							type='link'
							danger
							icon={<DeleteOutlined />}
							onClick={() => onDelete(file.id)}
						/>
					</Tooltip>
				)}
			</Space>
		</FileContainer>
	);
};

export default FileListItem;
