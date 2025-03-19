// src/routes/ProtectedRoute.tsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useGeneralStore } from '../store/useGeneralStore';
import { secureStorage } from '../utils/token-storage';
import { usePostVerifyToken } from '../api/usePostVerifyToken';
import { EMAIL, TOKEN_STORAGE } from '../constants';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRoles?: string[]; // Опциональный массив разрешенных ролей
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredRoles = [],
}) => {
	const location = useLocation();
	const { getGeneralStore } = useGeneralStore();
	const { token, user } = getGeneralStore();
	const { mutate, isPending } = usePostVerifyToken();

	// Проверяем токен и пользователя в сторе
	const isAuthenticated = Boolean(token && user);

	// Проверка прав доступа, если указаны requiredRoles
	const hasRequiredRole =
		!requiredRoles.length || (user && requiredRoles.includes(user.role));

	// Эффект для проверки валидности токена при первом рендере
	useEffect(() => {
		const email = secureStorage.get(EMAIL);
		const token = secureStorage.get(TOKEN_STORAGE);
		if (email && token) {
			mutate({ email, token });
		}
	}, []);

	// Показываем индикатор загрузки при валидации токена
	if (isPending) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					flexDirection: 'column',
					gap: '16px',
				}}
			>
				<Spin size='large' />
				<div>Проверка авторизации...</div>
			</div>
		);
	}
	// Перенаправляем неавторизованных пользователей
	const localToken = secureStorage.get(TOKEN_STORAGE);
	if (!isAuthenticated && !localToken) {
		return <Navigate to='/signin' state={{ from: location }} replace />;
	}

	// Если не хватает прав доступа
	if (!hasRequiredRole) {
		message.error('У вас недостаточно прав для доступа к этой странице');

		// Перенаправляем на дашборд или другую страницу по умолчанию
		return <Navigate to='/admin/dashboard' replace />;
	}

	// Если все проверки пройдены успешно
	return <>{children}</>;
};

export default ProtectedRoute;
