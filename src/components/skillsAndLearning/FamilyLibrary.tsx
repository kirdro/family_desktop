import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface BookItem {
	key: string;
	title: string;
	author: string;
	category: string;
	owner: string;
}

export default function FamilyLibrary() {
	const [library, setLibrary] = useState<BookItem[]>([
		{
			key: '1',
			title: 'Война и мир',
			author: 'Лев Толстой',
			category: 'Художественная литература',
			owner: 'Аня',
		},
		{
			key: '2',
			title: 'JavaScript для детей',
			author: 'Ник Морган',
			category: 'Программирование',
			owner: 'Макс',
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const columns = [
		{ title: 'Название', dataIndex: 'title', key: 'title' },
		{ title: 'Автор', dataIndex: 'author', key: 'author' },
		{ title: 'Категория', dataIndex: 'category', key: 'category' },
		{ title: 'Владелец', dataIndex: 'owner', key: 'owner' },
	];

	const handleAddBook = () => {
		form.validateFields().then((values: BookItem) => {
			setLibrary([
				...library,
				{
					...values,
					key: String(library.length + 1),
				},
			]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить книгу
			</Button>
			<Table columns={columns} dataSource={library} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить книгу в библиотеку"
				open={isModalOpen}
				onOk={handleAddBook}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="author" label="Автор" rules={[{ required: true, message: 'Укажите автора' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="category" label="Категория" rules={[{ required: true, message: 'Укажите категорию' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="owner" label="Член семьи (владелец)" rules={[{ required: true, message: 'Укажите владельца' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
