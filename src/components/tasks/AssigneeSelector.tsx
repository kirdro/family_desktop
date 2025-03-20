// src/components/tasks/AssigneeSelector.tsx
import React from 'react';
import { Select, Avatar, Button, Typography, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import styles from '../../pages/tasks/TasksStyles.module.css';
import UserAvatar from '../common/UserAvatar';
import { IUser } from '../../types';

const { Text } = Typography;

interface AssigneeSelectorProps {
	selectedAssignees: IUser[];
	onChange: (assignees: IUser[]) => void;
	type?: 'task' | 'plan';
}

const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
	selectedAssignees,
	onChange,
	type = 'plan',
}) => {
	const { generalStore } = useGeneralStore();

	// Обработчик выбора исполнителей
	const handleAssigneeSelect = (selectedUserIds: string[]) => {
		if (!generalStore.team?.members) return;

		const newSelectedAssignees = selectedUserIds
			.map((userId) => {
				return generalStore.team?.members.find(
					(user) =>
						(type === 'task' ? user.email : user.id) === userId,
				);
			})
			.filter((item) => !!item);

		onChange(newSelectedAssignees);
	};

	return (
		<div className={styles.assigneeSelector}>
			<div className={styles.assigneeSelectorHeader}>
				<Text>Выбранные исполнители ({selectedAssignees.length})</Text>
			</div>

			{!generalStore.team ?
				<Text type='warning'>
					У вас нет активной команды. Создайте команду, чтобы
					назначать исполнителей.
				</Text>
			:	<>
					<Select
						mode='multiple'
						placeholder='Выберите исполнителей'
						value={selectedAssignees.map((user) =>
							type === 'task' ? user.email : user.id,
						)}
						onChange={handleAssigneeSelect}
						style={{ width: '100%' }}
						optionLabelProp='label'
						optionFilterProp='label'
						className={styles.assigneeSelect}
					>
						{generalStore.team.members?.map((user) => (
							<Select.Option
								key={user.id}
								value={type === 'task' ? user.email : user.id}
								label={user.name}
							>
								<div className={styles.assigneeOption}>
									<UserAvatar
										name={user.name || ''}
										email={user.email}
										avatar={user.image || undefined}
									/>
									<span>{user.name || user.email}</span>
								</div>
							</Select.Option>
						))}
					</Select>

					{selectedAssignees.length > 0 && (
						<List
							className={styles.selectedAssigneesList}
							itemLayout='horizontal'
							dataSource={selectedAssignees}
							renderItem={(user) => (
								<List.Item
									className={styles.itemList}
									actions={[
										<Button
											type='text'
											size='small'
											onClick={() => {
												onChange(
													selectedAssignees.filter(
														(u) => u.id !== user.id,
													),
												);
											}}
										>
											Удалить
										</Button>,
									]}
								>
									<List.Item.Meta
										avatar={
											<UserAvatar
												name={user.name || ''}
												email={user.email}
												avatar={user.image || undefined}
											/>
										}
										title={user.name}
										description={user.email}
									/>
								</List.Item>
							)}
						/>
					)}
				</>
			}
		</div>
	);
};

export default AssigneeSelector;
