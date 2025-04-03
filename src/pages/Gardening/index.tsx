import { Card, Tabs } from 'antd';
import {
	CalendarOutlined,
	DropboxOutlined,
	ScheduleOutlined,
	TableOutlined,
	DatabaseOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import PlantingPlan from './components/PlantingPlan';
import WateringSchedule from './components/WateringSchedule';
import HarvestLog from './components/HarvestLog';
import PlantCatalog from './components/PlantCatalog';
import SeasonalTasks from './components/SeasonalTasks';

const { TabPane } = Tabs;

export default function GardeningPage() {
	const [activeTab, setActiveTab] = useState('plan');

	return (
		<Card title="Садоводство и огород">
			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<TabPane
					tab={
						<span>
              <CalendarOutlined /> Планирование посадок
            </span>
					}
					key="plan"
				>
					<PlantingPlan />
				</TabPane>
				<TabPane
					tab={
						<span>
              <ScheduleOutlined /> График полива и подкормки
            </span>
					}
					key="watering"
				>
					<WateringSchedule />
				</TabPane>
				<TabPane
					tab={
						<span>
              <DropboxOutlined /> Учет урожая
            </span>
					}
					key="harvest"
				>
					<HarvestLog />
				</TabPane>
				<TabPane
					tab={
						<span>
              <TableOutlined /> Каталог растений
            </span>
					}
					key="catalog"
				>
					<PlantCatalog />
				</TabPane>
				<TabPane
					tab={
						<span>
              <DatabaseOutlined /> Сезонные работы
            </span>
					}
					key="tasks"
				>
					<SeasonalTasks />
				</TabPane>
			</Tabs>
		</Card>
	);
}