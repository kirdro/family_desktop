// src/pages/auth/SignUp.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import {
	UserOutlined,
	MailOutlined,
	LockOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import apiClient from '../../api/client';
import { useGeneralStore } from '../../store/useGeneralStore';

const { Title, Text } = Typography;

interface SignUpForm {
	name: string;
	email: string;
	password: string;
	team_name?: string;
}

const SignUp: React.FC = () => {
	const navigate = useNavigate();
	const { updateGeneralStore } = useGeneralStore();
	const [loading, setLoading] = useState(false);

	const onFinish = async (values: SignUpForm) => {
		try {
			setLoading(true);

			// Отправка запроса на сервер
			const { data } = await apiClient.post('/auth/signup', values);

			// Сохранение email для верификации кода
			await updateGeneralStore({
				emailTemp: values.email,
			});

			// Успешное сообщение
			message.success(
				'Регистрация успешна. Пожалуйста, подтвердите ваш email.',
			);

			// Перенаправление на страницу верификации
			navigate('/verify');
		} catch (error: any) {
			// Отображение ошибки
			message.error(
				error.response?.data?.message || 'Ошибка регистрации',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card
			bordered={false}
			style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
		>
			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<Title level={2}>Регистрация</Title>
				<Text type='secondary'>
					Создайте свой аккаунт, чтобы начать работу
				</Text>
			</div>

			<Form
				name='signup_form'
				onFinish={onFinish}
				layout='vertical'
				requiredMark={false}
			>
				<Form.Item
					name='name'
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите ваше имя',
						},
					]}
				>
					<Input
						prefix={
							<UserOutlined
								style={{ color: 'rgba(0,0,0,.25)' }}
							/>
						}
						placeholder='Имя'
						size='large'
					/>
				</Form.Item>
				<Form.Item
					name='email'
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите ваш email',
						},
						{
							type: 'email',
							message: 'Пожалуйста, введите корректный email',
						},
					]}
				>
					<Input
						prefix={
							<MailOutlined
								style={{ color: 'rgba(0,0,0,.25)' }}
							/>
						}
						placeholder='Email'
						size='large'
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type='primary'
						htmlType='submit'
						size='large'
						block
						loading={loading}
					>
						Зарегистрироваться
					</Button>
				</Form.Item>
				<Divider plain>Или</Divider>
				<div style={{ textAlign: 'center' }}>
					<Text>Уже есть аккаунт?</Text>{' '}
					<Link to='/signin'>Войти</Link>
				</div>
			</Form>
		</Card>
	);
};

export default SignUp;
