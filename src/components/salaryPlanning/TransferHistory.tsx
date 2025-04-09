import React from 'react';
import { Card, List, Button } from 'antd';
import { IPurchase } from '../../types';

interface TransferHistoryProps {
	transfers: IPurchase[];
}

export function TransferHistory({ transfers }: TransferHistoryProps) {
	return (
		<Card title="История переносов покупок">
			<List
				dataSource={transfers}
				renderItem={(purchase) => (
					<List.Item>
						<List.Item.Meta
							title={purchase.name}
							description={`Перенос на ${purchase.date}, сумма: ₽${purchase.price}`}
						/>
					</List.Item>
				)}
			/>
		</Card>
	);
}
