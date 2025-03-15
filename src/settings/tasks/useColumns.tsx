import {IColumn} from "../../types/tasks.ts";
import styles from "../../pages/tasks/TasksStyles.module.css";
import {Avatar, Badge, Button, Dropdown, Menu, Tooltip, Typography} from "antd";
import TaskStatusDropdown from "../../components/tasks/TaskStatusDropdown.tsx";
import TaskPrioritySelector from "../../components/tasks/TaskPrioritySelector.tsx";
import TaskTags from "../../components/tasks/TaskTags.tsx";
import {CheckOutlined, ClockCircleOutlined, MinusOutlined, MoreOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {ITag, ITask, IUser} from "../../types";
import {darkTheme} from "../../main.tsx";
import UserAvatar from "../../components/common/UserAvatar.tsx";

const { Text } = Typography;

const handleStatusChange = async (taskId: string, newStatus: string) => {
    // Здесь будет логика обновления статуса задачи
    console.log('Изменение статуса задачи:', taskId, newStatus);
};

// Обработчик переключения приоритета задачи
const handlePriorityChange = async (
    taskId: string,
    newPriority: string,
) => {
    // Здесь будет логика обновления приоритета задачи
    console.log('Изменение приоритета задачи:', taskId, newPriority);
};

// Форматирование даты
const formatDate = (date: string | null | undefined | Date) => {
    if (!date) return '-';
    return dayjs(date).format('DD.MM.YYYY');
};



export const useColumns = () => {
    const navigate = useNavigate();
    const columns:IColumn[] = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: ITask) => {

                return (
                    <div className={styles.taskTitleCell}>
                        <Text
                            strong
                            ellipsis={{ tooltip: text }}
                            className={styles.taskTitle}
                            onClick={() => navigate(`/admin/tasks/${record.id}`)}
                        >
                            {text}
                        </Text>
                        {record.subTasks?.length > 0 && (
                            <Badge
                                count={record.subTasks.length}
                                size='default'
                                color={'lime'}
                                className={styles.subTaskBadge}
                            />
                        )}
                    </div>
                )
            },
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: ITask) => (
                <TaskStatusDropdown
                    value={status}
                    onChange={(newStatus) =>
                        handleStatusChange(record.id, newStatus)
                    }
                />
            ),
            width: 150,
        },
        {
            title: 'Выполнено',
            dataIndex: 'completed',
            key: 'completed',
            render: (_: string, record: ITask) => (
                <div className={styles.completedContainer}>
                    {record.completed ?
                        <CheckOutlined style={{ fontSize: '22px' , color: 'lime'}} /> :
                        <MinusOutlined style={{ fontSize: '22px' , color: 'darkred'}} />}
                </div>
            ),
            width: 150,
        },
        {
            title: 'Приоритет',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority: string, record: ITask) => (
                <TaskPrioritySelector
                    value={priority}
                    onChange={(newPriority) =>
                        handlePriorityChange(record.id, newPriority)
                    }
                />
            ),
            width: 130,
        },
        {
            title: 'Теги',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: ITag[]) => <TaskTags tags={tags} maxDisplay={2} />,
            width: 150,
        },
        {
            title: 'Исполнители',
            dataIndex: 'assignees',
            key: 'assignees',
            render: (assignees: IUser[]) => (
                <Avatar.Group
                    maxCount={3}
                    maxStyle={{ color: '#EEEEEE', backgroundColor: '#76ABAE' }}
                >
                    {assignees.map((user: IUser) => (
                        <Tooltip title={user.name} key={user.id}>
                            <UserAvatar
                                name={user.name || ''}
                                email={user.email}
                                avatar={user.image || undefined}

                            />
                        </Tooltip>
                    ))}
                </Avatar.Group>
            ),
            width: 120,
        },
        {
            title: 'Сроки',
            key: 'dates',
            render: (_: unknown, record: ITask) => (
                <div className={styles.datesContainer}>
                    <Text type='secondary'>
                        {record.startDate ?
                            <span>С {formatDate(record.startDate)}</span>
                            :	<span>Не начата</span>}
                    </Text>
                    {record.endDate && (
                        <Text type='secondary'>
                            - {formatDate(record.endDate)}
                        </Text>
                    )}
                </div>
            ),
            width: 180,
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_:unknown, record: ITask) => (
                <Dropdown
                    overlay={
                        <Menu
                            items={[
                                {
                                    key: 'edit',
                                    label: 'Редактировать',
                                    onClick: () =>
                                        navigate(
                                            `/admin/tasks/${record.id}/edit`,
                                        ),
                                },
                                {
                                    key: 'startTask',
                                    label:
                                        record.startDate ? 'Завершить' : (
                                            'Начать'
                                        ),
                                    icon:
                                        record.startDate ?
                                            <CheckOutlined />
                                            :	<ClockCircleOutlined />,
                                    onClick: () =>
                                        console.log('Start/complete task'),
                                },
                                {
                                    key: 'divider1',
                                    type: 'divider',
                                },
                                {
                                    key: 'delete',
                                    label: 'Удалить',
                                    danger: true,
                                    onClick: () => console.log('Delete task'),
                                },
                            ]}
                        />
                    }
                    trigger={['click']}
                >
                    <Button
                        type='text'
                        icon={<MoreOutlined />}
                        className={styles.actionButton}
                    />
                </Dropdown>
            ),
            width: 80,
        },
    ];


    return columns
};
