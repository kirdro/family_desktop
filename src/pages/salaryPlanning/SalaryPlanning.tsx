
import { Card, Row, Col, Divider, } from 'antd';


import { SalarySchedule } from '../../components/salaryPlanning/SalarySchedule';
import { PlannedPurchases } from '../../components/salaryPlanning/PlannedPurchases';
import { BudgetOverview } from '../../components/salaryPlanning/BudgetOverview';
import { SuggestedAdjustments } from '../../components/salaryPlanning/SuggestedAdjustments';
import { SalaryHistory } from '../../components/salaryPlanning/SalaryHistory';
import { useGeneralStore } from '../../store/useGeneralStore';




export const SalaryPlanningPage = ()=> {
	// const [salaries, setSalaries] = useState<SalaryEntry[]>([
	// 	{ id: '1', date: '2025-04-10', amount: 50000 },
	// 	{ id: '2', date: '2025-04-25', amount: 40000 },
	// ]);

	const {
		getGeneralStore
	} = useGeneralStore()

	const {
		salaries,
		purchases
	} = getGeneralStore()


	// const [purchases, setPurchases] = useState<PurchaseEntry[]>([
	// 	{ id: '1', name: 'Продукты', amount: 8000, plannedDate: '2025-04-11', priority: 'high' },
	// 	{ id: '2', name: 'Обувь', amount: 12000, plannedDate: '2025-04-26', priority: 'medium' },
	// 	{ id: '3', name: 'Подарок', amount: 15000, plannedDate: '2025-04-15', priority: 'low' },
	// ]);

	return (
		<div>
			<h2>Планирование покупок по зарплате</h2>
			<Row gutter={16}>
				<Col span={12}>
					<Card title="График зарплат">
						<SalarySchedule data={salaries} />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Обзор бюджета">
						<BudgetOverview salaries={salaries} purchases={purchases} />
					</Card>
				</Col>
			</Row>

			<Divider />

			<Card title="Планируемые покупки">
				<PlannedPurchases data={purchases}  />
			</Card>

			<Divider />

			<Card title="Рекомендации по корректировке">
				<SuggestedAdjustments salaries={salaries} purchases={purchases} />
			</Card>
			<Divider />
			<Card title="История выплат">
				<SalaryHistory salaries={salaries}  />
			</Card>
		</div>
	);
}