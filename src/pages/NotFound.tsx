// src/pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result, Typography, Space, Divider } from 'antd';
import {
	HomeOutlined,
	ArrowLeftOutlined,
	QuestionCircleOutlined,
	SearchOutlined,
	DatabaseOutlined,
} from '@ant-design/icons';
import { useGeneralStore } from '../store/useGeneralStore';
import styles from './NotFound.module.css';

const { Paragraph, Text, Title } = Typography;

const NotFoundPage: React.FC = () => {
	const navigate = useNavigate();
	const { generalStore } = useGeneralStore();

	// Проверяем, авторизован ли пользователь
	const isAuthenticated = Boolean(generalStore.token && generalStore.user);

	// Определяем URL для возврата на главную страницу
	const homeUrl = isAuthenticated ? '/admin/dashboard' : '/signin';

	// Получаем последнюю часть URL для отображения в сообщении
	const currentPath = window.location.pathname;

	// Функция для возврата на предыдущую страницу
	const goBack = () => {
		navigate(-1);
	};

	// Функция для перехода на главную страницу
	const goHome = () => {
		navigate(homeUrl);
	};

	return (
		<div className={styles.notFoundContainer}>
			<Result
				status='404'
				title='404'
				subTitle={
					<Title level={3} style={{ fontWeight: 'normal' }}>
						Страница не найдена
					</Title>
				}
				extra={
					<div className={styles.actionButtons}>
						<Button
							type='primary'
							icon={<HomeOutlined />}
							onClick={goHome}
							size='large'
						>
							На главную
						</Button>
						<Button
							icon={<ArrowLeftOutlined />}
							onClick={goBack}
							size='large'
						>
							Назад
						</Button>
					</div>
				}
			>
				<div className={styles.errorDetails}>
					<Paragraph>
						К сожалению, запрошенная страница не найдена. Возможные
						причины:
					</Paragraph>

					<ul className={styles.reasonsList}>
						<li>URL введен неправильно или содержит опечатку</li>
						<li>Страница была перемещена или удалена</li>
						<li>У вас нет прав для доступа к этому ресурсу</li>
					</ul>

					<Divider />

					<Title level={5}>
						<DatabaseOutlined /> Техническая информация
					</Title>

					<div className={styles.technicalInfo}>
						<Text code>Запрошенный путь: {currentPath}</Text>
					</div>

					<Divider />

					<Title level={5}>
						<QuestionCircleOutlined /> Что можно сделать?
					</Title>

					<Space
						direction='vertical'
						className={styles.suggestionsList}
					>
						<Paragraph>
							<SearchOutlined /> Попробуйте поискать нужную
							информацию через поиск
						</Paragraph>
						<Paragraph>
							<ArrowLeftOutlined /> Вернитесь на предыдущую
							страницу
						</Paragraph>
						<Paragraph>
							<HomeOutlined /> Перейдите на главную страницу
						</Paragraph>
						<Paragraph>
							Если вы считаете, что это ошибка, пожалуйста,
							свяжитесь с администратором:
							<a href='mailto:support@example.com'>
								{' '}
								support@example.com
							</a>
						</Paragraph>
					</Space>
				</div>
			</Result>
		</div>
	);
};

export default NotFoundPage;
