// CommentItem.tsx
import React, { useState } from 'react';
import { Avatar, Button, Form, Input, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { PlanComment } from '../../types/planning';
import { Comment } from '@ant-design/compatible';

const { TextArea } = Input;

interface CommentItemProps {
	comment: PlanComment;
	planId: string;
}

const StyledComment = styled(Comment)`
	.ant-comment-content-author-name {
		color: #d9d9d9;
	}

	.ant-comment-content-author-time {
		color: #8c8c8c;
	}

	.ant-comment-content-detail {
		color: #f0f0f0;
	}
`;

const ReplyForm = styled(Form)`
	margin-top: 16px;
`;

const CommentItem: React.FC<CommentItemProps> = ({ comment, planId }) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState('');

	const handleReply = () => {
		if (!replyText.trim()) return;

		// addCommentMutation.mutate(
		// 	{
		// 		planId,
		// 		text: replyText,
		// 		parentId: comment.id,
		// 	},
		// 	{
		// 		onSuccess: () => {
		// 			setReplyText('');
		// 			setShowReplyForm(false);
		// 		},
		// 	},
		// );
	};

	const actions = [
		<Button type='link' onClick={() => setShowReplyForm(!showReplyForm)}>
			{showReplyForm ? 'Отменить' : 'Ответить'}
		</Button>,
	];

	return (
		<StyledComment
			actions={actions}
			author={comment.author.name}
			avatar={<Avatar icon={<UserOutlined />} />}
			content={comment.text}
			datetime={
				<Tooltip
					title={dayjs(comment.createdAt).format(
						'DD.MM.YYYY HH:mm:ss',
					)}
				>
					{dayjs(comment.createdAt).format('DD.MM.YYYY HH:mm')}
				</Tooltip>
			}
		>
			{showReplyForm && (
				<ReplyForm>
					<Form.Item>
						<TextArea
							rows={2}
							value={replyText}
							onChange={(e) => setReplyText(e.target.value)}
							placeholder='Напишите ответ...'
						/>
					</Form.Item>
					<Form.Item>
						<Button
							htmlType='submit'
							type='primary'
							onClick={handleReply}
							// loading={addCommentMutation.isLoading}
							disabled={!replyText.trim()}
						>
							Ответить
						</Button>
					</Form.Item>
				</ReplyForm>
			)}

			{comment.replies.map((reply) => (
				<StyledComment
					key={reply.id}
					author={reply.author.name}
					avatar={<Avatar icon={<UserOutlined />} />}
					content={reply.text}
					datetime={
						<Tooltip
							title={dayjs(reply.createdAt).format(
								'DD.MM.YYYY HH:mm:ss',
							)}
						>
							{dayjs(reply.createdAt).format('DD.MM.YYYY HH:mm')}
						</Tooltip>
					}
				/>
			))}
		</StyledComment>
	);
};

export default CommentItem;
