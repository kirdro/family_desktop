import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Harvest {
	key: string;
	plant: string;
	date: string;
	quantity: number;
	unit: string;
}

export default function HarvestLog() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [harvests, setHarvests] = useState<Harvest[]>([
		{ key: '1', plant: 'Томаты', date: '2025-08-15', quantity: 5, unit: 'кг' },
		{ key: '2', plant: 'Огурцы', date: '2025-08-18', quantity: 10, unit: 'шт' },
	]);

	const columns = [
		{ title: 'Растение', dataIndex: 'plant', key: 'plant' },
		{ title: 'Дата сбора', dataIndex: 'date', key: 'date' },
		{ title: 'Количество', dataIndex: 'quantity', key: 'quantity' },
		{ title: 'Единица измерения', dataIndex: 'unit', key: 'unit' },
	];

	const handleAddHarvest = () => {
		form.validateFields().then((values: { plant: string; date: dayjs.Dayjs; quantity: number; unit: string }) => {
			setHarvests([...harvests, {
				key: String(harvests.length + 1),
				plant: values.plant,
				date: values.date.format('YYYY-MM-DD'),
				quantity: values.quantity,
				unit: values.unit,
			}]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить сбор урожая
			</Button>
			<Table columns={columns} dataSource={harvests} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить сбор урожая"
				open={isModalOpen}
				onOk={handleAddHarvest}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="plant" label="Растение" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="date" label="Дата сбора" rules={[{ required: true, message: 'Выберите дату' }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item name="quantity" label="Количество" rules={[{ required: true, message: 'Введите количество' }]}>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item name="unit" label="Единица измерения" rules={[{ required: true, message: 'Введите единицу измерения' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
