// import { camelToSnakeCase } from 'src/settings';

import { useStore } from './useStore';
import {
	BuildingPlan,
	ITag,
	ITask,
	ITaskStatistics,
	ITeam,
	IUser,
	IWallet,
} from '../types';
import { Plan } from '../types/planning.ts';

const STORE_KEY = `GENERAL_STORE_KEY`;

export const initialState = {
	token: '' as string,
	emailTemp: '' as string,
	email: '' as string,
	user: null as IUser | null,
	wallet: null as IWallet | null,
	team: null as ITeam | null,
	tasks: [] as ITask[],
	taskTags: [] as ITag[],
	taskStats: [] as ITaskStatistics[],
	buildingPlans: [] as BuildingPlan[],
	plans: [] as Plan[],
};

export type StoreType = typeof initialState;

export function useGeneralStore(externalState?: StoreType) {
	const {
		store: generalStore,
		getStore: getGeneralStore,
		updateStore: updateGeneralStore,
	} = useStore<StoreType>([STORE_KEY], externalState || { ...initialState });

	return { generalStore, getGeneralStore, updateGeneralStore };
}
