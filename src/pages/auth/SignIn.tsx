// src/pages/auth/SignIn.tsx

import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useGeneralStore } from '../../store/useGeneralStore';
import { usePostLogin } from '../../api/usePostLogin';

const { Title, Text } = Typography;

interface SignInForm {
	email: string;
}

const SignIn: React.FC = () => {
	const navigate = useNavigate();
	const { updateGeneralStore } = useGeneralStore();
	const { mutateAsync, isPending } = usePostLogin();

	const onFinish = async (values: SignInForm) => {
		try {
			await mutateAsync({
				email: values.email,
			});

			// Отправка запроса на серв

			// Сохранение токена и данных пользователя в сторе
			await updateGeneralStore({
				emailTemp: values.email,
			});

			// Успешное сообщение
			message.success('Вход выполнен успешно');

			// Перенаправление на главную страницу
			navigate('/verify');
		} catch (error: any) {
			// Отображение ошибки
			message.error(
				error.response?.data?.message || 'Ошибка входа в систему',
			);
		}
	};

	return (
		<Card
			bordered={false}
			style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
		>
			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<Title level={2}>Вход в систему</Title>
				<Text type='secondary'>
					Добро пожаловать! Пожалуйста, введите свои учетные данные.
				</Text>
			</div>

			<Form
				name='signin_form'
				initialValues={{ remember: true }}
				onFinish={onFinish}
				layout='vertical'
				requiredMark={false}
			>
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
							<UserOutlined
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
						loading={isPending}
					>
						Войти
					</Button>
				</Form.Item>

				<Divider plain>Или</Divider>

				<div style={{ textAlign: 'center' }}>
					<Text>Еще нет аккаунта?</Text>{' '}
					<Link to='/signup'>Зарегистрироваться</Link>
				</div>
			</Form>
		</Card>
	);
};

export default SignIn;
