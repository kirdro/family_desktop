// src/components/tasks/TagSelector.tsx
import React, { useState, useEffect } from 'react';
import {
	Select,
	Tag,
	Button,
	Modal,
	Form,
	Input,
	ColorPicker,
	message,
	Spin,
	List,
	Typography,
	Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTaskTags } from '../../hooks/useTaskTags';
import { useGeneralStore } from '../../store/useGeneralStore';
import styles from '../../pages/tasks/TasksStyles.module.css';

const { Text } = Typography;

interface TagSelectorProps {
	selectedTags: any[];
	onChange: (tags: any[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
	selectedTags,
	onChange,
}) => {
	const [tags, setTags] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [newTagName, setNewTagName] = useState('');
	const [newTagColor, setNewTagColor] = useState('#76ABAE');
	const [form] = Form.useForm();

	const { generalStore } = useGeneralStore();
	const { getTags, createTag, deleteTag } = useTaskTags();

	// Загрузка тегов при монтировании
	useEffect(() => {
		const fetchTags = async () => {
			try {
				setLoading(true);
				const data = await getTags();
				setTags(data);
			} catch (error) {
				console.error('Error fetching tags:', error);
				message.error('Не удалось загрузить теги');
			} finally {
				setLoading(false);
			}
		};

		fetchTags();
	}, [getTags]);

	// Обработчик добавления нового тега
	const handleAddTag = async () => {
		if (!newTagName.trim()) return;

		try {
			setLoading(true);

			const newTag = await createTag({
				name: newTagName,
				color: newTagColor,
				teamId: generalStore.team?.id,
			});

			setTags((prev) => [...prev, newTag]);

			// Добавляем новый тег к выбранным
			onChange([...selectedTags, newTag]);

			// Сбрасываем форму
			setNewTagName('');
			setNewTagColor('#76ABAE');
			setModalVisible(false);

			message.success('Тег успешно создан');
		} catch (error) {
			console.error('Error creating tag:', error);
			message.error('Не удалось создать тег');
		} finally {
			setLoading(false);
		}
	};

	// Обработчик удаления тега
	const handleDeleteTag = async (tagId: string) => {
		try {
			await deleteTag(tagId);

			// Удаляем тег из списка всех тегов
			setTags((prev) => prev.filter((tag) => tag.id !== tagId));

			// Удаляем тег из списка выбранных тегов
			onChange(selectedTags.filter((tag) => tag.id !== tagId));

			message.success('Тег успешно удален');
		} catch (error) {
			console.error('Error deleting tag:', error);
			message.error('Не удалось удалить тег');
		}
	};

	// Обработчик выбора тегов
	const handleTagSelect = (selectedTagIds: string[]) => {
		const newSelectedTags = selectedTagIds
			.map((tagId) => {
				return tags.find((tag) => tag.id === tagId);
			})
			.filter(Boolean);

		onChange(newSelectedTags);
	};

	return (
		<div className={styles.tagSelector}>
			<div className={styles.tagSelectorHeader}>
				<Text>Выбранные теги ({selectedTags.length})</Text>
				<Button
					type='primary'
					icon={<PlusOutlined />}
					size='small'
					onClick={() => setModalVisible(true)}
				>
					Создать тег
				</Button>
			</div>

			{loading ?
				<div className={styles.loadingContainer}>
					<Spin size='small' />
					<Text type='secondary'>Загрузка тегов...</Text>
				</div>
			:	<Select
					mode='multiple'
					placeholder='Выберите теги или создайте новый'
					value={selectedTags.map((tag) => tag.id)}
					onChange={handleTagSelect}
					style={{ width: '100%' }}
					optionLabelProp='label'
					optionFilterProp='label'
					className={styles.tagSelect}
				>
					{tags.map((tag) => (
						<Select.Option
							key={tag.id}
							value={tag.id}
							label={tag.name}
						>
							<div className={styles.tagOption}>
								<div
									className={styles.tagColor}
									style={{ backgroundColor: tag.color }}
								/>
								<span>{tag.name}</span>
							</div>
						</Select.Option>
					))}
				</Select>
			}

			{selectedTags.length > 0 && (
				<div className={styles.selectedTagsList}>
					{selectedTags.map((tag) => (
						<Tag
							key={tag.id}
							className={styles.selectedTag}
							color={tag.color}
							closable
							onClose={() => {
								onChange(
									selectedTags.filter((t) => t.id !== tag.id),
								);
							}}
						>
							{tag.name}
						</Tag>
					))}
				</div>
			)}

			<Modal
				title='Создать новый тег'
				open={modalVisible}
				onOk={handleAddTag}
				onCancel={() => setModalVisible(false)}
				okText='Создать'
				cancelText='Отмена'
				okButtonProps={{
					disabled: !newTagName.trim() || loading,
					loading: loading,
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Название тега'
						rules={[
							{
								required: true,
								message: 'Введите название тега',
							},
						]}
					>
						<Input
							placeholder='Введите название тега'
							value={newTagName}
							onChange={(e) => setNewTagName(e.target.value)}
							disabled={loading}
						/>
					</Form.Item>

					<Form.Item label='Цвет тега'>
						<ColorPicker
							value={newTagColor}
							onChange={(color) =>
								setNewTagColor(color.toHexString())
							}
							disabled={loading}
						/>
					</Form.Item>
				</Form>

				<Divider />

				<div className={styles.currentTagsHeader}>
					<Text>Существующие теги</Text>
				</div>

				<List
					size='small'
					dataSource={tags}
					renderItem={(tag) => (
						<List.Item
							actions={[
								<Button
									type='text'
									icon={<DeleteOutlined />}
									size='small'
									danger
									onClick={() => handleDeleteTag(tag.id)}
									disabled={loading}
								/>,
							]}
						>
							<div className={styles.tagListItem}>
								<div
									className={styles.tagColor}
									style={{ backgroundColor: tag.color }}
								/>
								<Text>{tag.name}</Text>
							</div>
						</List.Item>
					)}
				/>
			</Modal>
		</div>
	);
};

export default TagSelector;
