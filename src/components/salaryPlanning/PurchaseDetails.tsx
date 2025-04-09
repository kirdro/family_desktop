import React from 'react';
import { Modal, Descriptions, Button } from 'antd';
import { IPurchase } from '../../types';

interface PurchaseDetailsProps {
	purchase: IPurchase | null;
	visible: boolean;
	onClose: () => void;
}

export function PurchaseDetails({ purchase, visible, onClose }: PurchaseDetailsProps) {
	if (!purchase) return null;

	return (
		<Modal
			title={`Детали покупки: ${purchase.name}`}
			open={visible}
			onCancel={onClose}
			footer={[
				<Button key="close" onClick={onClose}>
					Закрыть
				</Button>,
			]}
		>
			<Descriptions column={1}>
				<Descriptions.Item label="Наименование">{purchase.name}</Descriptions.Item>
				<Descriptions.Item label="Сумма">{purchase.price} ₽</Descriptions.Item>
				<Descriptions.Item label="Дата">{purchase.date}</Descriptions.Item>
				<Descriptions.Item label="Приоритет">{purchase.priority}</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
}
