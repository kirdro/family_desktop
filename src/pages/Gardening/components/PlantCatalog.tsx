import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Plant {
	key: string;
	name: string;
	type: string;
	description: string;
}

export default function PlantCatalog() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [form] = Form.useForm();
	const [plants, setPlants] = useState<Plant[]>([
		{ key: '1', name: 'Томаты', type: 'Овощ', description: 'Красные сладкие плоды' },
		{ key: '2', name: 'Роза', type: 'Цветок', description: 'Красивый ароматный цветок' },
	]);

	const columns = [
		{ title: 'Название', dataIndex: 'name', key: 'name' },
		{ title: 'Тип', dataIndex: 'type', key: 'type' },
		{ title: 'Описание', dataIndex: 'description', key: 'description' },
	];

	const handleAddPlant = () => {
		form.validateFields().then((values: { name: string; type: string; description: string }) => {
			setPlants([...plants, {
				key: String(plants.length + 1),
				name: values.name,
				type: values.type,
				description: values.description,
			}]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить растение
			</Button>
			<Table columns={columns} dataSource={plants} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить растение"
				open={isModalOpen}
				onOk={handleAddPlant}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="type" label="Тип" rules={[{ required: true, message: 'Выберите тип' }]}>
						<Select>
							<Select.Option value="Овощ">Овощ</Select.Option>
							<Select.Option value="Фрукт">Фрукт</Select.Option>
							<Select.Option value="Цветок">Цветок</Select.Option>
							<Select.Option value="Дерево">Дерево</Select.Option>
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
