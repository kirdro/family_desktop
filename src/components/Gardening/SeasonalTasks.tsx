import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Task {
	key: string;
	title: string;
	date: string;
	category: string;
	description: string;
}

export default function SeasonalTasks() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [tasks, setTasks] = useState<Task[]>([
		{ key: '1', title: 'Посадка картофеля', date: '2025-04-15', category: 'Весна', description: 'Подготовка почвы и посадка клубней' },
		{ key: '2', title: 'Обрезка деревьев', date: '2025-10-05', category: 'Осень', description: 'Формирующая обрезка плодовых деревьев' },
	]);

	const columns = [
		{ title: 'Задача', dataIndex: 'title', key: 'title' },
		{ title: 'Дата', dataIndex: 'date', key: 'date' },
		{ title: 'Сезон', dataIndex: 'category', key: 'category' },
		{ title: 'Описание', dataIndex: 'description', key: 'description' },
	];

	const handleAddTask = () => {
		form.validateFields().then((values: { title: string; date: dayjs.Dayjs; category: string; description: string }) => {
			setTasks([...tasks, {
				key: String(tasks.length + 1),
				title: values.title,
				date: values.date.format('YYYY-MM-DD'),
				category: values.category,
				description: values.description,
			}]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить сезонную задачу
			</Button>
			<Table columns={columns} dataSource={tasks} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить сезонную задачу"
				open={isModalOpen}
				onOk={handleAddTask}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="title" label="Задача" rules={[{ required: true, message: 'Введите название задачи' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="date" label="Дата выполнения" rules={[{ required: true, message: 'Выберите дату' }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item name="category" label="Сезон" rules={[{ required: true, message: 'Выберите сезон' }]}>
						<Select>
							<Select.Option value="Весна">Весна</Select.Option>
							<Select.Option value="Лето">Лето</Select.Option>
							<Select.Option value="Осень">Осень</Select.Option>
							<Select.Option value="Зима">Зима</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name="description" label="Описание">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
