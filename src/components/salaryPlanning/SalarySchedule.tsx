
import { useState } from 'react';
import { Button, DatePicker, Form, InputNumber, Modal, Table } from 'antd';
import { IParamsCreateSalary, ISalary } from '../../types';
import { useGeneralStore } from '../../store/useGeneralStore';
import { useCreateSalary } from '../../api/useCreateSalary';

interface SalaryScheduleProps {
	data: ISalary[];
}

export function SalarySchedule({ data }: SalaryScheduleProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const {
		getGeneralStore
	} = useGeneralStore()

	const {
		team
	} = getGeneralStore()

	const {
		mutateAsync
	} = useCreateSalary()

	const handleAdd = () => {
		form.validateFields().then(async (values) => {
			const newItem: IParamsCreateSalary = {
				date: values.date.format('YYYY-MM-DD'),
				count: values.amount,
				teamId: team? team.id : 0
			};
			await mutateAsync(newItem)
			setIsModalOpen(false);
			form.resetFields();
		});
	};

	const columns = [
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Сумма',
			dataIndex: 'count',
			key: 'count',
		},
	];

	return (
		<div>
			<Button type="primary" onClick={() => setIsModalOpen(true)}>
				Добавить выплату
			</Button>
			<Table columns={columns} dataSource={data} pagination={false} style={{ marginTop: 16 }} rowKey="id" />

			<Modal
				title="Добавить зарплату"
				open={isModalOpen}
				onOk={handleAdd}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="date" label="Дата" rules={[{ required: true, message: 'Выберите дату' }]}>
						<DatePicker format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item name="amount" label="Сумма" rules={[{ required: true, message: 'Введите сумму' }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
