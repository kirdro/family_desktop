import {
	FileExcelOutlined,
	FileImageOutlined, FileOutlined,
	FilePdfOutlined, FilePptOutlined, FileTextOutlined,
	FileWordOutlined,
	FileZipOutlined,
} from '@ant-design/icons';
import React from 'react';

export const getFileIcon = (fileType: string) => {
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