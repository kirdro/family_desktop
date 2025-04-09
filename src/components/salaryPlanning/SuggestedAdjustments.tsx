import React from 'react';
import { Card, Row, Col, Button, List } from 'antd';
import { TransferHistory } from './TransferHistory';
import { IPurchase, ISalary } from '../../types';

interface SuggestedAdjustmentsProps {
	salaries: ISalary[];
	purchases: IPurchase[];
}

export function SuggestedAdjustments({
										 salaries,
										 purchases,
									 }: SuggestedAdjustmentsProps) {
	// Вычисление общей суммы зарплаты
	const totalSalary = salaries.reduce((total, salary) => total + salary.count, 0);

	// Вычисление общей суммы покупок
	const totalPurchases = purchases.reduce((total, purchase) => total + purchase.price, 0);

	// Баланс = общая зарплата - общая сумма покупок
	const balance = totalSalary - totalPurchases;

	// Логика для предложения корректировок
	const suggestedAdjustments = purchases
		.filter(purchase => purchase.price > balance) // Покупки, которые превышают баланс
		.map(purchase => ({
			...purchase,
			adjustedAmount: balance, // Предлагаем уменьшить покупку до доступного баланса
			adjustedDate: 'Следующий месяц', // Переносим покупку на следующий месяц
		}));

	// Функция для переноса покупок
	const handleAdjustPurchase = (purchaseId: string) => {
		// setPurchases(purchases.map(purchase => {
		// 	if (purchase.id === purchaseId) {
		// 		return {
		// 			...purchase,
		// 			plannedDate: '2025-05-01', // Меняем дату на следующий месяц
		// 			amount: balance, // Обновляем сумму покупки
		// 		};
		// 	}
		// 	return purchase;
		// }));
	};

	return (
		<div>
			<Row gutter={16} >
				<Col span={12}>
					<Card title="Рекомендации по корректировке">
						<List
							dataSource={suggestedAdjustments}
							renderItem={(purchase) => (
								<List.Item
									actions={[
										<Button type="link" onClick={() => handleAdjustPurchase(purchase.id)}>
											Перенести
										</Button>,
									]}
								>
									<List.Item.Meta
										title={`Перенос покупки: ${purchase.name}`}
										description={`Сумма: ₽${purchase.price} (Предлагаем уменьшить до ₽${purchase.adjustedAmount})`}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
				<Col span={12}>
					<TransferHistory transfers={purchases.filter(p => p.date === '2025-05-01')} />
				</Col>
			</Row>
		</div>
	);
}
