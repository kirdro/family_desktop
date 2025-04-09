import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface CourseItem {
	key: string;
	title: string;
	platform: string;
	link: string;
	assignedTo: string;
	status: string;
}

export default function OnlineCourses() {
	const [courses, setCourses] = useState<CourseItem[]>([
		{
			key: '1',
			title: 'React для начинающих',
			platform: 'Udemy',
			link: 'https://udemy.com/react-course',
			assignedTo: 'Макс',
			status: 'В процессе',
		},
		{
			key: '2',
			title: 'Умный огород',
			platform: 'Stepik',
			link: 'https://stepik.org/course/12345',
			assignedTo: 'Аня',
			status: 'Запланировано',
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const columns = [
		{
			title: 'Название курса',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Платформа',
			dataIndex: 'platform',
			key: 'platform',
		},
		{
			title: 'Ссылка',
			dataIndex: 'link',
			key: 'link',
			render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">Перейти</a>,
		},
		{
			title: 'Назначен',
			dataIndex: 'assignedTo',
			key: 'assignedTo',
		},
		{
			title: 'Статус',
			dataIndex: 'status',
			key: 'status',
		},
	];

	const handleAddCourse = () => {
		form.validateFields().then((values: Omit<CourseItem, 'key'>) => {
			setCourses([
				...courses,
				{
					...values,
					key: String(courses.length + 1),
				},
			]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить курс
			</Button>
			<Table columns={columns} dataSource={courses} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить онлайн-курс"
				open={isModalOpen}
				onOk={handleAddCourse}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="title" label="Название курса" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="platform" label="Платформа" rules={[{ required: true, message: 'Укажите платформу' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="link" label="Ссылка" rules={[{ required: true, message: 'Добавьте ссылку на курс' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="assignedTo" label="Назначено (кому)" rules={[{ required: true, message: 'Укажите участника' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="status" label="Статус" rules={[{ required: true, message: 'Укажите статус' }]}>
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
