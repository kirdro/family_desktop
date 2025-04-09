import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface LearningItem {
	key: string;
	topic: string;
	member: string;
	deadline: string;
	status: string;
}

export default function LearningPlan() {
	const [plan, setPlan] = useState<LearningItem[]>([
		{
			key: '1',
			topic: 'Основы программирования',
			member: 'Макс',
			deadline: '2025-05-10',
			status: 'В процессе',
		},
		{
			key: '2',
			topic: 'Выращивание томатов',
			member: 'Аня',
			deadline: '2025-04-25',
			status: 'Запланировано',
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const columns = [
		{ title: 'Тема', dataIndex: 'topic', key: 'topic' },
		{ title: 'Член семьи', dataIndex: 'member', key: 'member' },
		{ title: 'Дедлайн', dataIndex: 'deadline', key: 'deadline' },
		{ title: 'Статус', dataIndex: 'status', key: 'status' },
	];

	const handleAddLearning = () => {
		form.validateFields().then((values: { topic: string; member: string; deadline: dayjs.Dayjs; status: string }) => {
			setPlan([
				...plan,
				{
					key: String(plan.length + 1),
					topic: values.topic,
					member: values.member,
					deadline: values.deadline.format('YYYY-MM-DD'),
					status: values.status,
				},
			]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить обучение
			</Button>
			<Table columns={columns} dataSource={plan} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить план обучения"
				open={isModalOpen}
				onOk={handleAddLearning}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="topic" label="Тема" rules={[{ required: true, message: 'Введите тему' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="member" label="Член семьи" rules={[{ required: true, message: 'Укажите участника' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="deadline" label="Дедлайн" rules={[{ required: true, message: 'Укажите дату' }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item name="status" label="Статус" rules={[{ required: true, message: 'Выберите статус' }]}>
						<Select>
							<Select.Option value="Запланировано">Запланировано</Select.Option>
							<Select.Option value="В процессе">В процессе</Select.Option>
							<Select.Option value="Завершено">Завершено</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
