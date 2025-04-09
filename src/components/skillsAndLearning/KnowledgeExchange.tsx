import { useState } from 'react';
import { List, Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ExchangeItem {
	key: string;
	from: string;
	to: string;
	topic: string;
	notes: string;
}

export default function KnowledgeExchange() {
	const [exchanges, setExchanges] = useState<ExchangeItem[]>([
		{
			key: '1',
			from: 'Макс',
			to: 'Аня',
			topic: 'Работа с Excel',
			notes: 'Провести мини-урок с примерами таблиц',
		},
		{
			key: '2',
			from: 'Аня',
			to: 'Макс',
			topic: 'Основы садоводства',
			notes: 'Объяснить про пикировку рассады',
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const handleAddExchange = () => {
		form.validateFields().then((values: ExchangeItem) => {
			setExchanges([
				...exchanges,
				{
					...values,
					key: String(exchanges.length + 1),
				},
			]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить обмен
			</Button>
			<List
				style={{ marginTop: 16 }}
				bordered
				dataSource={exchanges}
				renderItem={(item) => (
					<List.Item>
						<strong>{item.from}</strong> делится с <strong>{item.to}</strong> темой: <em>{item.topic}</em><br />
						<span>{item.notes}</span>
					</List.Item>
				)}
			/>

			<Modal
				title="Добавить обмен знаниями"
				open={isModalOpen}
				onOk={handleAddExchange}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="from" label="От кого" rules={[{ required: true, message: 'Укажите отправителя' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="to" label="Кому" rules={[{ required: true, message: 'Укажите получателя' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="topic" label="Тема" rules={[{ required: true, message: 'Введите тему' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="notes" label="Описание / детали">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}