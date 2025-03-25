import { JSX } from 'react';
import { ITag, ITask, IUser, Priority, Status } from './index';
import dayjs from 'dayjs';

export interface IColumn {
	title: string;
	dataIndex?: string;
	key: string;
	render: TRender | TRenderText | TRenderTags | TRenderUser | TRenderPriority;
	width?: number;
}

export type TRender = (status: Status, record: ITask) => JSX.Element;
export type TRenderText = (text: string, record: ITask) => JSX.Element;
export type TRenderTags = (tags: ITag[]) => JSX.Element;
export type TRenderUser = (assignees: IUser[]) => JSX.Element;
export type TRenderPriority = (
	priority: Priority,
	record: ITask,
) => JSX.Element;

export interface IPriorityMap {
	[key: string]: {
		color: string;
		text: string;
	};
}

export interface IStatusTitles {
	[key: string]: string;
}

export interface IFilters {
	status: string[];
	priority: string[];
	tags: string[];
	assignees: string[];
	dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
}
export interface IParamTaskRelateByPlan {
	planId: string;
	taskId: string;
}
