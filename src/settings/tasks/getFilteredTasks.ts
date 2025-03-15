import dayjs from "dayjs";
import {ITask} from "../../types";
import {IFilters} from "../../types/tasks.ts";

interface IGetFilteredTasks {
    tasks: ITask[];
    searchText: string;
    filters: IFilters;
    
}



export const getFilteredTasks = (params:IGetFilteredTasks) => {
    const {
        tasks,
        searchText,
        filters,
    } = params

    if (tasks.length === 0) return [];

    return tasks?.filter((task) => {
        // Фильтрация по поисковому запросу
        if (
            searchText &&
            !task.title.toLowerCase().includes(searchText.toLowerCase())
        ) {
            return false;
        }

        // Фильтрация по статусу
        if (
            filters.status.length > 0 &&
            !filters.status.includes(task.status)
        ) {
            return false;
        }

        // Фильтрация по приоритету
        if (
            filters.priority.length > 0 &&
            !filters.priority.includes(task.priority)
        ) {
            return false;
        }

        // Фильтрация по тегам
        if (
            filters.tags.length > 0 &&
            !task.tags.some((tag) => filters.tags.includes(tag.id))
        ) {
            return false;
        }

        // Фильтрация по исполнителям
        if (
            filters.assignees.length > 0 &&
            !task.assignees.some((user) =>
                filters.assignees.includes(user.id),
            )
        ) {
            return false;
        }

        // Фильтрация по диапазону дат
        if (filters.dateRange) {
            const [startDate, endDate] = filters.dateRange;
            const taskStartDate =
                task.startDate ? dayjs(task.startDate) : null;
            const taskEndDate = task.endDate ? dayjs(task.endDate) : null;

            if (taskStartDate && taskEndDate) {
                return (
                    (taskStartDate.isAfter(startDate) ||
                        taskStartDate.isSame(startDate)) &&
                    (taskEndDate.isBefore(endDate) ||
                        taskEndDate.isSame(endDate))
                );
            } else if (taskStartDate) {
                return (
                    taskStartDate.isAfter(startDate) ||
                    taskStartDate.isSame(startDate)
                );
            } else if (taskEndDate) {
                return (
                    taskEndDate.isBefore(endDate) ||
                    taskEndDate.isSame(endDate)
                );
            } else {
                return false;
            }
        }

        return true;
    });
};