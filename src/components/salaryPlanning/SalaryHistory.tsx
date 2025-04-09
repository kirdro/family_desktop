import React from 'react';
import { Card, Table, Button } from 'antd';
import { ISalary } from '../../types';

interface SalaryHistoryProps {
	salaries: ISalary[];
}

export function SalaryHistory({ salaries }: SalaryHistoryProps) {
	const handleDelete = (id: string) => {
		// setSalaries(salaries.filter((salary) => salary.id !== id));
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
		{
			title: 'Действия',
			key: 'actions',
			render: (_: any, record: ISalary) => (
				<Button type="link" danger onClick={() => handleDelete(record.id)}>
					Удалить
				</Button>
			),
		},
	];

	return (
		<Card title="История выплат">
			<Table
				columns={columns}
				dataSource={salaries}
				pagination={false}
				rowKey="id"
				style={{ marginTop: 16 }}
			/>
		</Card>
	);
}
