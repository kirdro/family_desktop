// AnimalCare.tsx
import React, { useState } from 'react';
import { Tabs, Card, Typography, Layout } from 'antd';
import AnimalCareCalendar from './AnimalCareCalendar';
import AnimalCareHistory from './AnimalCareHistory';
import AnimalsList from './AnimalsList';
import styled from 'styled-components';
import { PageHeader } from './styles';

const { Title } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const StyledContent = styled(Content)`
	padding: 0 24px 24px;
`;

const AnimalCare: React.FC = () => {
	const [activeKey, setActiveKey] = useState('calendar');

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<PageHeader>
				<Title level={3}>Учет ухода за животными</Title>
			</PageHeader>

			<StyledContent>
				<Tabs activeKey={activeKey} onChange={setActiveKey}>
					<TabPane tab='Календарь' key='calendar'>
						<AnimalCareCalendar />
					</TabPane>
					<TabPane tab='История' key='history'>
						<AnimalCareHistory />
					</TabPane>
					<TabPane tab='Животные' key='animals'>
						<AnimalsList />
					</TabPane>
				</Tabs>
			</StyledContent>
		</Layout>
	);
};

export default AnimalCare;
