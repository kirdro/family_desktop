import styles from "../../pages/tasks/TasksStyles.module.css";
import {Badge, Button, Input, Popover, Segmented} from "antd";
import {AppstoreOutlined, FilterOutlined, SearchOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {FC, JSX} from "react"
import {IFilters} from "../../types/tasks.ts";

interface IProps {
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    filtersContent:JSX.Element;
    filters: IFilters;
    viewMode: 'table' | 'kanban';
    setViewMode:  React.Dispatch<React.SetStateAction<"table" | "kanban">>
}

export const SearchBox:FC<IProps> = (props) => {
    const {
        searchText,
        setSearchText,
        filtersContent,
        filters,
        viewMode,
        setViewMode
    } = props



    return (
        <div className={styles.searchContainer}>
            <Input
                placeholder='Поиск задач'
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={styles.searchInput}
            />

            <Popover
                content={filtersContent}
                title={null}
                trigger='click'
                placement='bottomRight'
                overlayClassName={styles.filtersPopoverOverlay}
            >
                <Button icon={<FilterOutlined />}>
                    Фильтры
                    {Object.values(filters).some((f) =>
                        Array.isArray(f) ?
                            f.length > 0
                            :	f !== null,
                    ) && <Badge dot style={{ marginLeft: 5 }} />}
                </Button>
            </Popover>

            <Segmented
                options={[
                    {
                        value: 'table',
                        icon: <UnorderedListOutlined />,
                    },
                    {
                        value: 'kanban',
                        icon: <AppstoreOutlined />,
                    },
                ]}
                value={viewMode}
                onChange={(value) =>
                    setViewMode(value as 'table' | 'kanban')
                }
            />
        </div>
    );
};
