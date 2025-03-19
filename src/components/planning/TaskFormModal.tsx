// TaskFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';
import { Task } from '../../store/tasksLocalStore';

const { TextArea } = Input;

interface TaskFormModalProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: any) => void;
	task?: Task;
	loading?: boolean;
}

const StyledModal = styled(Modal)`
	.ant-modal-content {
		background-color: #1f1f1f;
	}

	.ant-modal-header {
		background-color: #1f1f1f;
		border-bottom: 1px solid #303030;
	}

	.ant-modal-title {
		color: #f0f0f0;
	}

	.ant-modal-footer {
		border-top: 1px solid #303030;
	}
`;

const TaskFormModal: React.FC<TaskFormModalProps> = ({
	visible,
	onCancel,
	onSubmit,
	task,
	loading = false,
}) => {
	const [form] = Form.useForm();
	const isEditMode = !!task;

	useEffect(() => {
		if (visible && task) {
			form.setFieldsValue({
				title: task.title,
				description: task.description,
				completed: task.completed,
			});
		} else if (visible) {
			form.resetFields();
			form.setFieldsValue({
				completed: false,
			});
		}
	}, [visible, task, form]);

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			onSubmit({
				...values,
				id: task?.id,
			});
		});
	};

	return (
		<StyledModal
			title={isEditMode ? 'Редактирование задачи' : 'Создание задачи'}
			open={visible}
			onCancel={onCancel}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Отмена
				</Button>,
				<Button
					key='submit'
					type='primary'
					onClick={handleSubmit}
					loading={loading}
				>
					{isEditMode ? 'Сохранить' : 'Создать'}
				</Button>,
			]}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='title'
					label='Название'
					rules={[
						{ required: true, message: 'Введите название задачи' },
					]}
				>
					<Input placeholder='Название задачи' />
				</Form.Item>

				<Form.Item name='description' label='Описание'>
					<TextArea rows={4} placeholder='Описание задачи' />
				</Form.Item>

				<Form.Item name='completed' valuePropName='checked'>
					<Checkbox>Завершено</Checkbox>
				</Form.Item>
			</Form>
		</StyledModal>
	);
};

export default TaskFormModal;
