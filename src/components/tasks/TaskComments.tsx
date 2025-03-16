// src/components/tasks/TaskComments.tsx
import React, { useState, useEffect } from 'react';
import {
	Input,
	Button,
	List,
	Typography,
	Popconfirm,
	Spin,
	Empty,
	message,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	SendOutlined,
	CloseOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { useTaskComments } from '../../hooks/useTaskComments';
import { useGeneralStore } from '../../store/useGeneralStore';
import UserAvatar from '../common/UserAvatar';
import { Comment } from '@ant-design/compatible';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from '../../pages/tasks/TasksStyles.module.css';

// Расширяем функциональность dayjs для относительного времени
dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Text } = Typography;

interface TaskCommentsProps {
	taskId: string;
	subTaskId?: string;
	initialComments?: any[];
	onCommentCreate?: (comment: any) => void;
	onCommentUpdate?: (comment: any) => void;
	onCommentDelete?: (commentId: string) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({
	taskId,
	subTaskId,
	initialComments = [],
	onCommentCreate,
	onCommentUpdate,
	onCommentDelete,
}) => {
	const [comments, setComments] = useState<any[]>(initialComments);
	const [loading, setLoading] = useState(false);
	const [commentText, setCommentText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState<string | null>(
		null,
	);
	const [editingText, setEditingText] = useState('');

	const { generalStore } = useGeneralStore();
	const { getComments, addComment, updateComment, deleteComment } =
		useTaskComments();

	// Загрузка комментариев при монтировании
	useEffect(() => {
		const fetchComments = async () => {
			if (initialComments.length === 0) {
				try {
					setLoading(true);
					const data = await getComments(taskId, subTaskId);
					setComments(data || []);
				} catch (error) {
					console.error('Error fetching comments:', error);
					message.error('Не удалось загрузить комментарии');
				} finally {
					setLoading(false);
				}
			} else {
				setComments(initialComments);
			}
		};

		fetchComments();
	}, [taskId, subTaskId, getComments, initialComments]);

	// Обработчик отправки комментария
	const handleSubmitComment = async () => {
		if (!commentText.trim()) return;

		try {
			setSubmitting(true);

			const newComment = await addComment({
				taskId,
				subTaskId,
				text: commentText,
			});

			setComments((prev) => [...prev, newComment]);
			setCommentText('');

			// Вызываем callback для обновления родительского компонента
			if (onCommentCreate) {
				onCommentCreate(newComment);
			}
		} catch (error) {
			console.error('Error adding comment:', error);
			message.error('Не удалось добавить комментарий');
		} finally {
			setSubmitting(false);
		}
	};

	// Обработчик обновления комментария
	const handleUpdateComment = async (commentId: string) => {
		if (!editingText.trim()) return;

		try {
			setSubmitting(true);

			const updatedComment = await updateComment(commentId, {
				text: editingText,
			});

			// Обновляем локальное состояние
			setComments((prev) =>
				prev.map((comment) =>
					comment.id === commentId ? updatedComment : comment,
				),
			);

			setEditingCommentId(null);
			setEditingText('');

			// Вызываем callback для обновления родительского компонента
			if (onCommentUpdate) {
				onCommentUpdate(updatedComment);
			}
		} catch (error) {
			console.error('Error updating comment:', error);
			message.error('Не удалось обновить комментарий');
		} finally {
			setSubmitting(false);
		}
	};

	// Начало редактирования комментария
	const startEditingComment = (comment: any) => {
		setEditingCommentId(comment.id);
		setEditingText(comment.text);
	};

	// Отмена редактирования комментария
	const cancelEditingComment = () => {
		setEditingCommentId(null);
		setEditingText('');
	};

	// Обработчик удаления комментария
	const handleDeleteComment = async (commentId: string) => {
		try {
			setLoading(true);
			await deleteComment(commentId);

			// Обновляем локальное состояние
			setComments((prev) =>
				prev.filter((comment) => comment.id !== commentId),
			);

			// Вызываем callback для обновления родительского компонента
			if (onCommentDelete) {
				onCommentDelete(commentId);
			}

			message.success('Комментарий удален');
		} catch (error) {
			console.error('Error deleting comment:', error);
			message.error('Не удалось удалить комментарий');
		} finally {
			setLoading(false);
		}
	};

	// Форматирование даты
	const formatDate = (date: string) => {
		return dayjs(date).fromNow(); // Использует плагин relativeTime
	};

	// Рендеринг списка комментариев
	const renderCommentList = () => {
		if (loading && comments.length === 0) {
			return (
				<div className={styles.loadingContainer}>
					<Spin size='small' />
					<Text type='secondary'>Загрузка комментариев...</Text>
				</div>
			);
		}

		if (comments.length === 0) {
			return (
				<Empty
					description='Нет комментариев'
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			);
		}

		return (
			<List
				className={styles.commentsList}
				itemLayout='horizontal'
				dataSource={comments}
				renderItem={(comment) => (
					<Comment
						author={
							<Text strong>
								{comment.author?.name || 'Пользователь'}
							</Text>
						}
						style={{
							paddingLeft: 16,
							paddingRight: 16,
							boxSizing: 'border-box',
						}}
						avatar={
							<UserAvatar
								name={comment.author?.name}
								email={comment.author?.email}
								avatar={comment.author?.avatar}
							/>
						}
						content={
							editingCommentId === comment.id ?
								<div className={styles.editCommentContainer}>
									<TextArea
										rows={3}
										value={editingText}
										onChange={(e) =>
											setEditingText(e.target.value)
										}
										disabled={submitting}
									/>
									<div className={styles.editCommentActions}>
										<Button
											size='small'
											icon={<CloseOutlined />}
											onClick={cancelEditingComment}
											disabled={submitting}
										>
											Отмена
										</Button>
										<Button
											type='primary'
											size='small'
											icon={<SaveOutlined />}
											onClick={() =>
												handleUpdateComment(comment.id)
											}
											loading={submitting}
											disabled={!editingText.trim()}
										>
											Сохранить
										</Button>
									</div>
								</div>
							:	<div className={styles.commentText}>
									{comment.text}
								</div>
						}
						datetime={
							<Text type='secondary'>
								{formatDate(comment.createdAt)}
							</Text>
						}
						actions={
							comment.author?.id === generalStore.user?.id ?
								[
									<Button
										type='text'
										icon={<EditOutlined />}
										size='small'
										onClick={() =>
											startEditingComment(comment)
										}
										disabled={
											editingCommentId === comment.id
										}
										className={styles.commentAction}
									>
										Редактировать
									</Button>,
									<Popconfirm
										title='Вы уверены, что хотите удалить этот комментарий?'
										onConfirm={() =>
											handleDeleteComment(comment.id)
										}
										okText='Да'
										cancelText='Нет'
									>
										<Button
											type='text'
											icon={<DeleteOutlined />}
											size='small'
											danger
											className={styles.commentAction}
										>
											Удалить
										</Button>
									</Popconfirm>,
								]
							:	[]
						}
					/>
				)}
			/>
		);
	};

	return (
		<div className={styles.commentsContainer}>
			{renderCommentList()}

			<div className={styles.addCommentContainer}>
				<Comment
					avatar={
						<UserAvatar
							name={generalStore.user?.name || ''}
							email={generalStore.user?.email}
							avatar={generalStore.user?.image || ''}
						/>
					}
					style={{
						paddingLeft: 16,
						paddingRight: 16,
						boxSizing: 'border-box',
					}}
					content={
						<>
							<TextArea
								rows={3}
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								placeholder='Добавьте комментарий...'
								disabled={submitting}
								className={styles.commentTextArea}
							/>
							<Button
								type='primary'
								icon={<SendOutlined />}
								onClick={handleSubmitComment}
								loading={submitting}
								disabled={!commentText.trim()}
								className={styles.submitCommentButton}
							>
								Отправить
							</Button>
						</>
					}
				/>
			</div>
		</div>
	);
};

export default TaskComments;
