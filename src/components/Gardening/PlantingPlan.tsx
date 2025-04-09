import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Planting {
	key: string;
	plant: string;
	date: string;
	location: string;
}

export default function PlantingPlan() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [plantings, setPlantings] = useState<Planting[]>([
		{ key: '1', plant: 'Томаты', date: '2025-04-10', location: 'Теплица' },
		{ key: '2', plant: 'Огурцы', date: '2025-05-01', location: 'Грядка 3' },
	]);

	const columns = [
		{ title: 'Растение', dataIndex: 'plant', key: 'plant' },
		{ title: 'Дата посадки', dataIndex: 'date', key: 'date' },
		{ title: 'Место', dataIndex: 'location', key: 'location' },
	];

	const handleAddPlanting = () => {
		form.validateFields().then((values: { plant: string; date: dayjs.Dayjs; location: string }) => {
			setPlantings([...plantings, {
				key: String(plantings.length + 1),
				plant: values.plant,
				date: values.date.format('YYYY-MM-DD'),
				location: values.location
			}]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить посадку
			</Button>
			<Table columns={columns} dataSource={plantings} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить посадку"
				open={isModalOpen}
				onOk={handleAddPlanting}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="plant" label="Растение" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="date" label="Дата посадки" rules={[{ required: true, message: 'Выберите дату' }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item name="location" label="Место" rules={[{ required: true, message: 'Введите место' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
