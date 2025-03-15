// src/pages/auth/VerifyCode.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Input, message, Space, Form } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import apiClient from '../../api/client';
import { useGeneralStore } from '../../store/useGeneralStore';
import { usePostLogin } from '../../api/usePostLogin.ts';
import { usePostVerifyCode } from '../../api/usePostVerifyCode.ts';

const { Title, Text, Paragraph } = Typography;

const VerifyCode: React.FC = () => {
	const navigate = useNavigate();
	const { generalStore, getGeneralStore } = useGeneralStore();
	const { emailTemp } = getGeneralStore();
	const [timer, setTimer] = useState(0);
	const [form] = Form.useForm();
	const { mutateAsync: mutateLogin, isPending: isPandingLogin } =
		usePostLogin();
	const { isPending, mutateAsync } = usePostVerifyCode();

	// Проверка, есть ли email для верификации
	useEffect(() => {
		if (!generalStore.emailTemp) {
			navigate('/signin');
			message.warning('Сначала нужно зарегистрироваться');
		}
	}, [generalStore.emailTemp, navigate]);

	// Обработчик для таймера повторной отправки
	useEffect(() => {
		let interval: number | undefined;

		if (timer > 0) {
			interval = window.setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [timer]);

	// Форматирование времени для отображения
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	// Отправка кода верификации
	const onFinish = async (values: { code: string }) => {
		try {
			// Отправка кода на сервер
			await mutateAsync({
				email: generalStore.emailTemp,
				code: values.code,
			});

			// Успешное сообщение
			message.success('Email успешно подтвержден');

			// Перенаправление на главную страницу
			navigate('/admin/dashboard');
		} catch (error: any) {
			// Отображение ошибки
			message.error(
				error.response?.data?.message || 'Неверный код верификации',
			);
		}
	};

	// Повторная отправка кода
	const handleResendCode = async () => {
		try {
			// Отправка запроса на повторную отправку кода
			await mutateLogin({
				email: emailTemp,
			});

			// Установка таймера ожидания (60 секунд)
			setTimer(60);

			// Успешное сообщение
			message.success('Код верификации отправлен повторно');
		} catch (error: any) {
			// Отображение ошибки
			message.error(
				error.response?.data?.message || 'Не удалось отправить код',
			);
		}
	};

	return (
		<Card
			bordered={false}
			style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
		>
			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<Title level={2}>Подтверждение email</Title>
				<Paragraph type='secondary'>
					Мы отправили код подтверждения на адрес:
					<br />
					<strong>{generalStore.emailTemp}</strong>
				</Paragraph>
				<Paragraph type='secondary'>
					Введите код, чтобы завершить регистрацию
				</Paragraph>
			</div>

			<Form
				form={form}
				name='verify_code_form'
				onFinish={onFinish}
				layout='vertical'
			>
				<Form.Item
					name='code'
					rules={[
						{
							required: true,
							message: 'Пожалуйста, введите код верификации',
						},
						{ len: 6, message: 'Код должен содержать 6 цифр' },
					]}
				>
					<Input
						size='large'
						placeholder='Введите 6-значный код'
						maxLength={6}
						style={{
							textAlign: 'center',
							// letterSpacing: '0.5em',
							fontSize: '1.2em',
						}}
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
						Подтвердить
					</Button>
				</Form.Item>
			</Form>

			<div style={{ textAlign: 'center', marginTop: 16 }}>
				<Space direction='vertical' size='small'>
					<Text type='secondary'>Не получили код?</Text>

					{timer > 0 ?
						<Text type='secondary'>
							Отправить повторно через {formatTime(timer)}
						</Text>
					:	<Button
							type='link'
							onClick={handleResendCode}
							loading={isPandingLogin}
						>
							Отправить повторно
						</Button>
					}

					<Button
						type='link'
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate('/signin')}
						style={{ marginTop: 8 }}
					>
						Вернуться на страницу входа
					</Button>
				</Space>
			</div>
		</Card>
	);
};

export default VerifyCode;
