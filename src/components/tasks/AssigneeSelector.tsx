// src/components/tasks/AssigneeSelector.tsx
import React, { useState } from 'react';
import { Select, Avatar, Button, Typography, List, Space, Tag } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import styles from '../../pages/tasks/TasksStyles.module.css';

const { Text } = Typography;

interface AssigneeSelectorProps {
	selectedAssignees: any[];
	onChange: (assignees: any[]) => void;
}

const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
	selectedAssignees,
	onChange,
}) => {
	const { generalStore } = useGeneralStore();

	// Обработчик выбора исполнителей
	const handleAssigneeSelect = (selectedUserIds: string[]) => {
		if (!generalStore.team?.members) return;

		const newSelectedAssignees = selectedUserIds
			.map((userId) => {
				return generalStore.team?.members.find(
					(user) => user.id === userId,
				);
			})
			.filter(Boolean);

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
						value={selectedAssignees.map((user) => user.id)}
						onChange={handleAssigneeSelect}
						style={{ width: '100%' }}
						optionLabelProp='label'
						optionFilterProp='label'
						className={styles.assigneeSelect}
					>
						{generalStore.team.members?.map((user) => (
							<Select.Option
								key={user.id}
								value={user.id}
								label={user.name}
							>
								<div className={styles.assigneeOption}>
									<Avatar
										size='small'
										src={user.avatar}
										icon={!user.avatar && <UserOutlined />}
									/>
									<span>{user.name}</span>
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
											<Avatar
												src={user.avatar}
												icon={
													!user.avatar && (
														<UserOutlined />
													)
												}
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
