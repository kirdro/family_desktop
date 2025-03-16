import { useGeneralStore } from '../store/useGeneralStore.ts';
import { useGetAllTasks, useGetTeamTags } from '../api';
import { useGetTeam } from '../api/useGetTeam.ts';
import { useGetPlans } from '../api/useGetPlans.ts';

export const useInitialReq = () => {
	const { getGeneralStore } = useGeneralStore();
	const { user } = getGeneralStore();

	useGetAllTasks(user ? user.email : '');
	useGetTeamTags(user ? user.email : '');
	useGetTeam(user ? user.email : '');
	useGetPlans(user ? user.email : null);
};
