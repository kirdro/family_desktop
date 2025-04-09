import { useGeneralStore } from '../store/useGeneralStore';
import { useGetAllTasks, useGetTeamTags } from '../api';
import { useGetTeam } from '../api/useGetTeam';
import { useGetPlans } from '../api/useGetPlans';
import { useGetAllPurchase } from '../api/useGetAllPurchase';
import { useGetAllSalary } from '../api/useGetAllSalary';

export const useInitialReq = () => {
	const { getGeneralStore } = useGeneralStore();
	const { user } = getGeneralStore();

	useGetAllTasks(user ? user.email : '');
	useGetTeamTags(user ? user.email : '');
	useGetTeam(user ? user.email : '');
	useGetPlans(user ? user.email : null);
	useGetAllPurchase()
	useGetAllSalary()
};
