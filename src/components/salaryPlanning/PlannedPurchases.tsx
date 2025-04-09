import { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker } from 'antd';
import { PurchaseDetails } from './PurchaseDetails';
import { IParamsCreatePurchase, IPurchase } from '../../types';
import { useCreatePurchase } from '../../api/useCreatePurchase';
import { useGeneralStore } from '../../store/useGeneralStore';

interface PlannedPurchasesProps {
	data: IPurchase[];
}

export function PlannedPurchases({ data }: PlannedPurchasesProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentPurchase, setCurrentPurchase] = useState<IPurchase | null>(null);
	const [selectedPurchase, setSelectedPurchase] = useState<IPurchase | null>(null);
	const [form] = Form.useForm();
	const {
		mutateAsync
	} = useCreatePurchase()
	const {
		getGeneralStore
	} = useGeneralStore()

	const {
		team
	} = getGeneralStore()

	const handleAdd = () => {
		form.validateFields().then(async (values) => {
			const newPurchase: IParamsCreatePurchase = {
				name: values.name,
				price: values.amount,
				date: values.plannedDate.format('YYYY-MM-DD'),
				priority: values.priority,
				teamId: team ? team.id : 0
			};
			await mutateAsync(newPurchase);
			// setData([...data, newPurchase]);
			setIsModalOpen(false);
			form.resetFields();
		});
	};

	const handleEdit = (purchase: IPurchase) => {
		setCurrentPurchase(purchase);
		form.setFieldsValue({
			name: purchase.name,
			amount: purchase.price,
			plannedDate: purchase.date,
			priority: purchase.priority,
		});
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		// setData(data.filter((purchase) => purchase.id !== id));
	};

	const columns = [
		{
			title: 'Наименование',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Сумма',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: 'Дата',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Приоритет',
			dataIndex: 'priority',
			key: 'priority',
		},
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: IPurchase) => (
				<span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Редактировать
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Удалить
          </Button>
        </span>
			),
		},
	];

	return (
		<div>
			<Button type="primary" onClick={() => setIsModalOpen(true)}>
				Добавить покупку
			</Button>
			<Table columns={columns} dataSource={data} pagination={false} style={{ marginTop: 16 }} rowKey="id" />
			<PurchaseDetails
				purchase={selectedPurchase}
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
			/>

			<Modal
				title={currentPurchase ? 'Редактировать покупку' : 'Добавить покупку'}
				open={isModalOpen}
				onOk={handleAdd}
				onCancel={() => setIsModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="name" label="Наименование" rules={[{ required: true, message: 'Введите наименование' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="amount" label="Сумма" rules={[{ required: true, message: 'Введите сумму' }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="plannedDate" label="Дата" rules={[{ required: true, message: 'Выберите дату' }]}>
						<DatePicker format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item name="priority" label="Приоритет" rules={[{ required: true, message: 'Выберите приоритет' }]}>
						<Select>
							<Select.Option value="HIGH">Высокий</Select.Option>
							<Select.Option value="MEDIUM">Средний</Select.Option>
							<Select.Option value="LOW">Низкий</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
