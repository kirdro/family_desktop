import { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Watering {
	key: string;
	plant: string;
	date: string;
	frequency: string;
}

export default function WateringSchedule() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [schedule, setSchedule] = useState<Watering[]>([
		{ key: '1', plant: 'Томаты', date: '2025-04-12', frequency: 'Каждый день' },
		{ key: '2', plant: 'Огурцы', date: '2025-04-14', frequency: 'Раз в 3 дня' },
	]);

	const columns = [
		{ title: 'Растение', dataIndex: 'plant', key: 'plant' },
		{ title: 'Дата последнего полива', dataIndex: 'date', key: 'date' },
		{ title: 'Частота', dataIndex: 'frequency', key: 'frequency' },
	];

	const handleAddWatering = () => {
		form.validateFields().then((values: { plant: string; date: dayjs.Dayjs; frequency: string }) => {
			setSchedule([...schedule, {
				key: String(schedule.length + 1),
				plant: values.plant,
				date: values.date.format('YYYY-MM-DD'),
				frequency: values.frequency,
			}]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить запись полива
			</Button>
			<Table columns={columns} dataSource={schedule} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить запись полива"
				open={isModalOpen}
				onOk={handleAddWatering}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="plant" label="Растение" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="date" label="Дата последнего полива" rules={[{ required: true, message: 'Выберите дату' }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item name="frequency" label="Частота" rules={[{ required: true, message: 'Выберите частоту' }]}>
						<Select>
							<Select.Option value="Каждый день">Каждый день</Select.Option>
							<Select.Option value="Раз в 3 дня">Раз в 3 дня</Select.Option>
							<Select.Option value="Раз в неделю">Раз в неделю</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
