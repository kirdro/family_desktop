import styles from "../../pages/tasks/TasksStyles.module.css";
import {Avatar, Button, DatePicker, Select, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {FC} from "react";
import {IFilters} from "../../types/tasks.ts";
import {useGeneralStore} from "../../store/useGeneralStore.ts";
import {ITag} from "../../types";
const { Option } = Select;
const { RangePicker } = DatePicker;

interface IProps {
    filters:IFilters;
    setFilters:React.Dispatch<React.SetStateAction<IFilters>>;
    tags: ITag[];
    handleResetFilters: () => void;
}

export const Filters:FC<IProps> = (props) => {
    const {
        filters,
        setFilters,
        tags,
        handleResetFilters
    } = props

    const {
        getGeneralStore
    } = useGeneralStore()
    const {
        team
    } = getGeneralStore()

    return (
        <div className={styles.filtersPopover}>
            <Typography.Title level={5}>Фильтры</Typography.Title>

            <div className={styles.filterGroup}>
                <label>Статус</label>
                <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '100%' }}
                    placeholder='Выберите статус'
                    value={filters.status}
                    onChange={(values) =>
                        setFilters({ ...filters, status: values })
                    }
                >
                    <Option value='TODO'>К выполнению</Option>
                    <Option value='IN_PROGRESS'>В процессе</Option>
                    <Option value='REVIEW'>На проверке</Option>
                    <Option value='DONE'>Выполнено</Option>
                    <Option value='ARCHIVED'>Архив</Option>
                </Select>
            </div>

            <div className={styles.filterGroup}>
                <label>Приоритет</label>
                <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '100%' }}
                    placeholder='Выберите приоритет'
                    value={filters.priority}
                    onChange={(values) =>
                        setFilters({ ...filters, priority: values })
                    }
                >
                    <Option value='LOW'>Низкий</Option>
                    <Option value='MEDIUM'>Средний</Option>
                    <Option value='HIGH'>Высокий</Option>
                    <Option value='URGENT'>Срочный</Option>
                </Select>
            </div>

            <div className={styles.filterGroup}>
                <label>Теги</label>
                <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '100%' }}
                    placeholder='Выберите теги'
                    value={filters.tags}
                    onChange={(values) =>
                        setFilters({ ...filters, tags: values })
                    }
                    optionLabelProp='label'
                >
                    {tags?.map((tag) => (
                        <Option key={tag.id} value={tag.id} label={tag.name}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: '50%',
                                        backgroundColor: tag.color,
                                        marginRight: 8,
                                    }}
                                />
                                <span>{tag.name}</span>
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>

            <div className={styles.filterGroup}>
                <label>Исполнители</label>
                <Select
                    mode='multiple'
                    allowClear
                    style={{ width: '100%' }}
                    placeholder='Выберите исполнителей'
                    value={filters.assignees}
                    onChange={(values) =>
                        setFilters({ ...filters, assignees: values })
                    }
                    optionLabelProp='label'
                >
                    {team?.members?.map((user) => (
                        <Option key={user.id} value={user.id} label={user.name}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar
                                    size='small'
                                    src={user.image}
                                    icon={!user.image && <UserOutlined />}
                                    style={{ marginRight: 8 }}
                                />
                                <span>{user.name}</span>
                            </div>
                        </Option>
                    ))}
                </Select>
            </div>

            <div className={styles.filterGroup}>
                <label>Период</label>
                <RangePicker
                    style={{ width: '100%' }}
                    onChange={(dates) =>
                        setFilters({
                            ...filters,
                            dateRange: dates as
                                | [dayjs.Dayjs, dayjs.Dayjs]
                                | null,
                        })
                    }
                    value={filters.dateRange}
                />
            </div>

            <div className={styles.filterActions}>
                <Button onClick={handleResetFilters}>Сбросить</Button>
                <Button type='primary'>Применить</Button>
            </div>
        </div>
    );
};
