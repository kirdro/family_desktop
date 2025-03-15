import {JSX} from "react";
import {ITag, ITask, IUser} from "./index.ts";
import dayjs from "dayjs";

export interface IColumn {
    title: string
    dataIndex?: string
    key: string
    render: TRender | TRenderText | TRenderTags | TRenderUser
    width?: number
}

export type TRender = (status: string, record: unknown) => JSX.Element
export type TRenderText = (text: string, record: ITask) => JSX.Element
export type TRenderTags = (tags: ITag[]) => JSX.Element
export type TRenderUser = (assignees: IUser[]) => JSX.Element

export interface IPriorityMap {
    [key: string]: {
        color: string;
        text: string;
    }
}

export interface IStatusTitles {
    [key: string]: string;
}

export interface IFilters {
    status: string[]
    priority: string[]
    tags: string[]
    assignees: string[]
    dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null
}