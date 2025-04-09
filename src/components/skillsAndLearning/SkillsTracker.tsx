import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Skill {
	key: string;
	name: string;
	level: string;
	member: string;
	notes: string;
}

export default function SkillsTracker() {
	const [skills, setSkills] = useState<Skill[]>([
		{
			key: '1',
			name: 'Готовка',
			level: 'Средний',
			member: 'Аня',
			notes: 'Уверенно готовит основные блюда',
		},
		{
			key: '2',
			name: 'HTML + CSS',
			level: 'Начальный',
			member: 'Макс',
			notes: 'Прошел вводный курс',
		},
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();

	const columns = [
		{ title: 'Навык', dataIndex: 'name', key: 'name' },
		{ title: 'Уровень', dataIndex: 'level', key: 'level' },
		{ title: 'Член семьи', dataIndex: 'member', key: 'member' },
		{ title: 'Заметки', dataIndex: 'notes', key: 'notes' },
	];

	const handleAddSkill = () => {
		form.validateFields().then((values: Skill) => {
			setSkills([
				...skills,
				{
					...values,
					key: String(skills.length + 1),
				},
			]);
			form.resetFields();
			setIsModalOpen(false);
		});
	};

	return (
		<div>
			<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
				Добавить навык
			</Button>
			<Table columns={columns} dataSource={skills} style={{ marginTop: 16 }} />

			<Modal
				title="Добавить навык"
				open={isModalOpen}
				onOk={handleAddSkill}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Название навыка" rules={[{ required: true, message: 'Введите название' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="level" label="Уровень" rules={[{ required: true, message: 'Выберите уровень' }]}>
						<Select>
							<Select.Option value="Начальный">Начальный</Select.Option>
							<Select.Option value="Средний">Средний</Select.Option>
							<Select.Option value="Продвинутый">Продвинутый</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item name="member" label="Член семьи" rules={[{ required: true, message: 'Укажите участника' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="notes" label="Заметки">
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
