import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { IPurchase, ISalary } from '../../types';

interface BudgetOverviewProps {
	salaries: ISalary[];
	purchases: IPurchase[];
}

export function BudgetOverview({ salaries, purchases }: BudgetOverviewProps) {
	// Вычисление общей суммы зарплаты
	const totalSalary = salaries.reduce((total, salary) => total + salary.count, 0);

	// Вычисление общей суммы покупок
	const totalPurchases = purchases.reduce((total, purchase) => total + purchase.price, 0);

	// Баланс = общая зарплата - общая сумма покупок
	const balance = totalSalary - totalPurchases;

	return (
		<div>
			<Row gutter={16}>
				<Col span={8}>
					<Card>
						<Statistic title="Общая зарплата" value={totalSalary} prefix="₽" />
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic title="Общие покупки" value={totalPurchases} prefix="₽" />
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic title="Оставшийся баланс" value={balance} prefix="₽" />
					</Card>
				</Col>
			</Row>
		</div>
	);
}
