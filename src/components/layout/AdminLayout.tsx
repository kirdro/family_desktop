// src/components/layout/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
	Layout,
	Menu,
	Button,
	Dropdown,
	Badge,
	theme,
	Typography,
	Drawer,
	Space,
	Divider,
	message,
	Modal,
	MenuProps,
} from 'antd';
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	DashboardOutlined,
	ProjectOutlined,
	SettingOutlined,
	LogoutOutlined,
	BellOutlined,
	TeamOutlined,
	ProfileOutlined,
	QuestionCircleOutlined,
	LineChartOutlined,
} from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import headerLogo from '../../assets/react.svg';
import styles from './AdminLayout.module.css';
import UserAvatar from '../common/UserAvatar';

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
	// Hooks и состояния
	const location = useLocation();
	const navigate = useNavigate();
	const { token } = theme.useToken();
	const { generalStore, updateGeneralStore, getGeneralStore } =
		useGeneralStore();
	const { user } = getGeneralStore();
	const { notificationStore } = useNotificationStore();
	const [collapsed, setCollapsed] = useState(false);
	const [mobileMode, setMobileMode] = useState(window.innerWidth < 768);
	const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
	const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
	const [helpModalVisible, setHelpModalVisible] = useState(false);

	// Отслеживание размера экрана для адаптивности
	useEffect(() => {
		const handleResize = () => {
			setMobileMode(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setMobileMenuVisible(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Непрочитанные уведомления
	const unreadNotifications = notificationStore.notifications.filter(
		(notification) => !notification.read,
	).length;

	// Обработчик выхода из системы
	const handleLogout = async () => {
		Modal.confirm({
			title: 'Выход из системы',
			content: 'Вы действительно хотите выйти?',
			okText: 'Да, выйти',
			cancelText: 'Отмена',
			onOk: async () => {
				try {
					// Вызов API для выхода
					await fetch('/api/auth/logout', {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${generalStore.token}`,
						},
					});
				} catch (error) {
					console.error('Logout error:', error);
				}

				// Очистка данных пользователя
				await updateGeneralStore({
					token: '',
					user: null,
					team: null,
				});

				message.success('Вы успешно вышли из системы');
				navigate('/signin');
			},
		});
	};

	// Пункты меню
	const menuItems: any[] = [
		{
			key: 'dashboard',
			icon: <DashboardOutlined />,
			label: <Link to='/admin/dashboard'>Дашборд</Link>,
		},
		{
			key: 'tasks',
			icon: <ProjectOutlined />,
			label: <Link to='/admin/tasks'>Задачи</Link>,
		},
		// generalStore.user?.role === 'admin' && {
		// 	key: 'users',
		// 	icon: <UserOutlined />,
		// 	label: <Link to='/admin/users'>Пользователи</Link>,
		// },
		{
			key: 'team',
			icon: <TeamOutlined />,
			label: <Link to='/admin/team'>Команда</Link>,
		},
		{
			key: 'plans',
			icon: <LineChartOutlined />,
			label: <Link to='/admin/plans'>Планы</Link>,
		},
		{
			key: 'settings',
			icon: <SettingOutlined />,
			label: 'Настройки',
			children: [
				{
					key: 'profile',
					icon: <ProfileOutlined />,
					label: <Link to='/admin/profile'>Профиль</Link>,
				},
				{
					key: 'app-settings',
					icon: <SettingOutlined />,
					label: <Link to='/admin/settings'>Приложение</Link>,
				},
			],
		},
	]; // Фильтрация null-значений (для скрытия пунктов по условию)

	// Контекстное меню пользователя
	const userMenu: MenuProps = {
		items: [
			{
				key: 'profile',
				icon: <ProfileOutlined />,
				label: 'Мой профиль',
				onClick: () => navigate('/admin/profile'),
			},
			{
				key: 'settings',
				icon: <SettingOutlined />,
				label: 'Настройки',
				onClick: () => navigate('/admin/settings'),
			},
			{
				type: 'divider',
			},
			{
				key: 'help',
				icon: <QuestionCircleOutlined />,
				label: 'Помощь',
				onClick: () => setHelpModalVisible(true),
			},
			{
				key: 'logout',
				icon: <LogoutOutlined />,
				label: 'Выйти',
				danger: true,
				onClick: handleLogout,
			},
		],
	};

	// Получение активного ключа для выделения пункта меню
	const getActiveMenuKey = () => {
		const path = location.pathname.split('/')[2] || 'dashboard';

		// Особая обработка для вложенных маршрутов
		if (path === 'profile' || path === 'settings') {
			return ['settings', path];
		}

		return [path];
	};

	// Компонент для отображения аватара пользователя

	return (
		<Layout className={styles.adminLayout}>
			{/* Сайдбар - в мобильном режиме заменяется на Drawer */}
			{mobileMode ?
				<Drawer
					title={
						<div className={styles.drawerHeader}>
							<img
								src={headerLogo}
								alt='Logo'
								className={styles.mobileLogo}
							/>
							<Typography.Title level={4} style={{ margin: 0 }}>
								Админ-панель
							</Typography.Title>
						</div>
					}
					placement='left'
					onClose={() => setMobileMenuVisible(false)}
					open={mobileMenuVisible}
					width={256}
					bodyStyle={{ padding: 0 }}
				>
					<Menu
						mode='inline'
						selectedKeys={getActiveMenuKey()}
						defaultOpenKeys={['settings']}
						items={menuItems}
						style={{
							border: 'none',
							backgroundColor: 'transparent',
						}}
					/>
				</Drawer>
			:	<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					width={256}
					style={{
						backgroundColor: token.colorBgElevated,
						borderRight: `1px solid ${token.colorBorder}`,
						overflow: 'auto',
						height: '100vh',
						position: 'fixed',
						left: 0,
						top: 0,
						bottom: 0,
						zIndex: 1000,
					}}
					theme='dark'
				>
					<div className={styles.logoContainer}>
						<img
							src={headerLogo}
							alt='Logo'
							className={styles.logo}
						/>
						{!collapsed && (
							<Typography.Title
								level={4}
								style={{
									margin: 0,
									color: token.colorTextBase,
								}}
							>
								Админ-панель
							</Typography.Title>
						)}
					</div>
					<Menu
						mode='inline'
						selectedKeys={getActiveMenuKey()}
						// defaultOpenKeys={['settings']}
						items={menuItems}
						style={{
							border: 'none',
							backgroundColor: 'transparent',
						}}
						theme='dark'
					/>
				</Sider>
			}

			<Layout
				style={{
					marginLeft:
						mobileMode ? 0
						: collapsed ? 80
						: 256,
					transition: 'all 0.2s',
				}}
			>
				<Header
					style={{
						padding: '0 16px',
						backgroundColor: token.colorBgElevated,
						borderBottom: `1px solid ${token.colorBorder}`,
						position: 'sticky',
						top: 0,
						zIndex: 1,
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{mobileMode ?
							<Button
								type='text'
								icon={<MenuUnfoldOutlined />}
								onClick={() => setMobileMenuVisible(true)}
								style={{ fontSize: '16px', marginRight: 12 }}
							/>
						:	<Button
								type='text'
								icon={
									collapsed ?
										<MenuUnfoldOutlined />
									:	<MenuFoldOutlined />
								}
								onClick={() => setCollapsed(!collapsed)}
								style={{ fontSize: '16px' }}
							/>
						}

						<Typography.Text
							strong
							style={{ fontSize: 16, margin: '0 12px' }}
						>
							{/* Динамический заголовок страницы */}
							{location.pathname.includes('/dashboard') &&
								'Дашборд'}
							{location.pathname.includes('/tasks') && 'Задачи'}
							{location.pathname.includes('/users') &&
								'Пользователи'}
							{location.pathname.includes('/team') && 'Команда'}
							{location.pathname.includes('/profile') &&
								'Профиль'}
							{location.pathname.includes('/settings') &&
								'Настройки'}
						</Typography.Text>
					</div>

					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Badge
							count={unreadNotifications}
							overflowCount={99}
							size='small'
						>
							<Button
								type='text'
								icon={<BellOutlined />}
								onClick={() => setNotificationDrawerOpen(true)}
								style={{ marginRight: 16 }}
							/>
						</Badge>

						<Dropdown menu={userMenu} trigger={['click']}>
							<div className={styles.userInfo}>
								<UserAvatar
									size='default'
									name={user ? user.name || '' : ''}
									email={user ? user.email : ''}
									avatar={user ? user.image || '' : ''}
								/>
								{!mobileMode && (
									<>
										<div className={styles.userName}>
											<Typography.Text strong>
												{generalStore.user?.name ||
													generalStore.user?.email}
											</Typography.Text>
											<Typography.Text
												type='secondary'
												style={{ fontSize: 12 }}
											>
												{(
													generalStore.user?.role ===
													'admin'
												) ?
													'Администратор'
												:	'Пользователь'}
											</Typography.Text>
										</div>
									</>
								)}
							</div>
						</Dropdown>
					</div>
				</Header>

				<Content
					style={{
						margin: '24px 16px',
						padding: 0,
						minHeight: 280,
						backgroundColor: 'transparent',
					}}
				>
					{/* Основной контент страницы */}
					<Outlet />
				</Content>

				<Footer
					style={{
						textAlign: 'center',
						backgroundColor: 'transparent',
						color: token.colorTextSecondary,
					}}
				>
					&copy; {new Date().getFullYear()} Админ-панель | Все права
					защищены
				</Footer>
			</Layout>

			{/* Drawer для уведомлений */}
			<Drawer
				title='Уведомления'
				placement='right'
				onClose={() => setNotificationDrawerOpen(false)}
				open={notificationDrawerOpen}
				width={320}
				extra={
					<Button
						type='link'
						disabled={!notificationStore.notifications.length}
						onClick={() => {
							/* Логика для отметки всех как прочитанных */
						}}
					>
						Отметить все как прочитанные
					</Button>
				}
			>
				{notificationStore.notifications.length === 0 ?
					<div style={{ textAlign: 'center', padding: '20px 0' }}>
						<BellOutlined
							style={{
								fontSize: 24,
								opacity: 0.5,
								marginBottom: 8,
							}}
						/>
						<Typography.Text
							type='secondary'
							style={{ display: 'block' }}
						>
							У вас нет уведомлений
						</Typography.Text>
					</div>
				:	<Space
						direction='vertical'
						style={{ width: '100%' }}
						split={<Divider style={{ margin: '8px 0' }} />}
					>
						{notificationStore.notifications.map((notification) => (
							<div
								key={notification.id}
								className={`${styles.notification} ${!notification.read ? styles.unread : ''}`}
							>
								<div className={styles.notificationHeader}>
									<Typography.Text strong>
										{notification.title}
									</Typography.Text>
									<Typography.Text
										type='secondary'
										style={{ fontSize: 12 }}
									>
										{new Date(
											notification.timestamp,
										).toLocaleString()}
									</Typography.Text>
								</div>
								<Typography.Paragraph
									ellipsis={{ rows: 2 }}
									style={{ margin: '4px 0 0' }}
								>
									{notification.message}
								</Typography.Paragraph>
							</div>
						))}
					</Space>
				}
			</Drawer>

			{/* Модальное окно справки */}
			<Modal
				title='Помощь и поддержка'
				open={helpModalVisible}
				onCancel={() => setHelpModalVisible(false)}
				footer={[
					<Button
						key='close'
						onClick={() => setHelpModalVisible(false)}
					>
						Закрыть
					</Button>,
				]}
			>
				<Typography.Title level={5}>
					Связаться с поддержкой
				</Typography.Title>
				<Typography.Paragraph>
					Email: support@example.com
				</Typography.Paragraph>
				<Typography.Paragraph>
					Телефон: +7 (XXX) XXX-XX-XX
				</Typography.Paragraph>

				<Divider />

				<Typography.Title level={5}>
					Часто задаваемые вопросы
				</Typography.Title>
				<Typography.Paragraph>
					<strong>Как добавить нового пользователя?</strong>
					<br />
					Перейдите в раздел "Пользователи" и нажмите кнопку "Добавить
					пользователя".
				</Typography.Paragraph>

				<Typography.Paragraph>
					<strong>Как создать новую задачу?</strong>
					<br />
					Перейдите в раздел "Задачи" и нажмите кнопку "Создать
					задачу".
				</Typography.Paragraph>

				<Typography.Paragraph>
					<strong>Как изменить настройки профиля?</strong>
					<br />
					Перейдите в раздел "Профиль" через выпадающее меню
					пользователя.
				</Typography.Paragraph>

				<Divider />

				<Typography.Title level={5}>Документация</Typography.Title>
				<Typography.Paragraph>
					<a href='#' target='_blank' rel='noopener noreferrer'>
						Руководство пользователя
					</a>
				</Typography.Paragraph>
				<Typography.Paragraph>
					<a href='#' target='_blank' rel='noopener noreferrer'>
						Документация API
					</a>
				</Typography.Paragraph>
			</Modal>
		</Layout>
	);
};

export default AdminLayout;
