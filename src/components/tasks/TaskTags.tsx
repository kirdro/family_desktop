// src/components/tasks/TaskTags.tsx
import React from 'react';
import { Tag, Tooltip, Typography, Popover } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import styles from '../../pages/tasks/TasksStyles.module.css';

const { Text } = Typography;

interface TaskTag {
	id: string;
	name: string;
	color: string;
	description?: string;
	icon?: string;
}

interface TaskTagsProps {
	tags: TaskTag[];
	maxDisplay?: number;
	showCount?: boolean;
	size?: 'small' | 'default' | 'large';
	onTagClick?: (tag: TaskTag) => void;
	className?: string;
}

/**
 * Компонент для отображения тегов задачи или подзадачи
 *
 * @param tags - массив тегов для отображения
 * @param maxDisplay - максимальное количество отображаемых тегов (остальные будут в выпадающем списке)
 * @param showCount - показывать ли общее количество тегов
 * @param size - размер тегов
 * @param onTagClick - обработчик клика по тегу
 * @param className - дополнительный CSS класс
 */
const TaskTags: React.FC<TaskTagsProps> = ({
	tags = [],
	maxDisplay = 3,
	showCount = false,
	size = 'default',
	onTagClick,
	className = '',
}) => {
	// Если тегов нет, возвращаем пустой фрагмент
	if (!tags || tags.length === 0) {
		return null;
	}

	// Определяем, сколько тегов отображать напрямую
	const displayTags = tags.slice(0, maxDisplay);
	const hiddenTags = tags.length > maxDisplay ? tags.slice(maxDisplay) : [];

	// Контент для всплывающего окна со скрытыми тегами
	const hiddenTagsContent = (
		<div className={styles.hiddenTagsContainer}>
			{hiddenTags.map((tag) => (
				<Tag
					key={tag.id}
					color={tag.color}
					className={styles.tagItem}
					onClick={() => onTagClick && onTagClick(tag)}
				>
					{tag.name}
				</Tag>
			))}
		</div>
	);

	return (
		<div className={`${styles.tagsContainer} ${className}`}>
			{/* Отображаемые теги */}
			{displayTags.map((tag) => (
				<Tooltip
					key={tag.id}
					title={tag.description || tag.name}
					placement='top'
				>
					<Tag
						color={tag.color}
						className={styles.tagItem}
						onClick={() => onTagClick && onTagClick(tag)}
						style={{ cursor: onTagClick ? 'pointer' : 'default' }}
					>
						{tag.name}
					</Tag>
				</Tooltip>
			))}

			{/* Индикатор скрытых тегов */}
			{hiddenTags.length > 0 && (
				<Popover
					content={hiddenTagsContent}
					title='Все теги'
					trigger='click'
					placement='bottom'
					overlayClassName={styles.tagsPopover}
				>
					<Tag className={styles.moreTagsTag}>
						<TagOutlined /> +{hiddenTags.length}
					</Tag>
				</Popover>
			)}

			{/* Общее количество тегов, если нужно */}
			{showCount && tags.length > 0 && (
				<Text type='secondary' className={styles.tagCount}>
					Всего: {tags.length}
				</Text>
			)}
		</div>
	);
};

export default TaskTags;
