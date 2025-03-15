import {useGeneralStore} from "../store/useGeneralStore.ts";
import {useGetAllTasks, useGetTeamTags} from "../api";

export const useInitialReq = () => {
    const {
        getGeneralStore
    } = useGeneralStore()
    const {
        user
    } = getGeneralStore()

    useGetAllTasks(user ? user.email : "")
    useGetTeamTags(user ? user.email : "")
}