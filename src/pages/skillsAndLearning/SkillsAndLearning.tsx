import { Tabs } from 'antd';
import SkillsTracker from '../../components/skillsAndLearning/SkillsTracker';
import LearningPlan from '../../components/skillsAndLearning/LearningPlan';
import FamilyLibrary from '../../components/skillsAndLearning/FamilyLibrary';
import KnowledgeExchange from '../../components/skillsAndLearning/KnowledgeExchange';
import OnlineCourses from '../../components/skillsAndLearning/OnlineCourses';


export default function SkillsAndLearning() {
	return (
		<div>
			<h2 style={{ marginBottom: 16 }}>Навыки и обучение</h2>
			<Tabs
				defaultActiveKey="skills"
				type="card"
				items={[
					{
						key: 'skills',
						label: 'Освоенные навыки',
						children: <SkillsTracker />,
					},
					{
						key: 'learning',
						label: 'План обучения',
						children: <LearningPlan />,
					},
					{
						key: 'library',
						label: 'Семейная библиотека',
						children: <FamilyLibrary />,
					},
					{
						key: 'exchange',
						label: 'Обмен знаниями',
						children: <KnowledgeExchange />,
					},
					{
						key: 'courses',
						label: 'Онлайн-курсы и материалы',
						children: <OnlineCourses />,
					},
				]}
			/>
		</div>
	);
}
