import styled from 'styled-components';
import { Card, List, Tag, Typography } from 'antd';

const { Text, Paragraph } = Typography;

export const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	padding: 20px;

	@media (max-width: 992px) {
		flex-direction: column;
	}
`;

export const CalendarCard = styled(Card)`
	flex: 1;
	min-width: 300px;
`;

export const DetailsCard = styled(Card)`
	flex: 1;
	min-width: 300px;
`;

export const ActionItem = styled(List.Item)<{
	$background: string;
	$backgroundHover: string;
}>`
	position: relative;
	padding: 12px !important;
	background: ${(p) => p.$background};
	border-radius: 8px;
	margin-bottom: 8px;
	transition: all 0.3s;
	box-sizing: border-box;

	&:hover {
		background: ${(p) => p.$backgroundHover};
	}
`;

export const ActionTypeTag = styled(Tag)`
	margin-right: 8px;
`;

export const ActionDate = styled(Text)`
	color: #8c8c8c;
	font-size: 12px;
	display: block;
	margin-bottom: 4px;
`;

export const ActionAnimal = styled(Text)`
	font-weight: bold;
	display: block;
	margin-bottom: 2px;
`;

export const ActionDescription = styled(Paragraph)`
	margin-bottom: 4px;
`;

export const ActionQuantity = styled(Text)`
	color: #1890ff;
	font-size: 13px;
`;

export const FormItemGroup = styled.div`
	display: flex;
	gap: 16px;

	@media (max-width: 576px) {
		flex-direction: column;
	}
`;

export const PageHeader = styled.div`
	//background: #fff;
	padding: 16px 24px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
	margin-bottom: 24px;
`;
