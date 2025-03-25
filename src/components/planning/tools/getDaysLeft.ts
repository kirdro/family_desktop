import dayjs from 'dayjs';
import { Plan } from '../../../types/planning';

export const getDaysLeft = (plan: Plan) => {
	const endDate = dayjs(plan?.endDate);
	const today = dayjs();
	return endDate.diff(today, 'day');
};
