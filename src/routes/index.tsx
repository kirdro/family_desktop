// src/routes/index.tsx
import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
// import AdminLayout from '../components/layout/AdminLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import TasksList from '../pages/tasks/TasksList';
import TaskDetail from '../pages/tasks/TaskDetail';
import TaskCreate from '../pages/tasks/TaskCreate';
import PlansList from '../pages/plannings/PlansList';
import PlanForm from '../components/planning/PlanForm';
import PlanDetail from '../pages/plannings/PlanDetail';
import TaskEdit from '../pages/tasks/TaskEdit';
import AnimalCare from '../components/animal/AnimalCare';
// import ProtectedRoute from './ProtectedRoute';

// Страницы авторизации
const SignInPage = lazy(() => import('../pages/auth/SignIn'));
const SignUpPage = lazy(() => import('../pages/auth/SignUp'));
const VerifyCodePage = lazy(() => import('../pages/auth/VerifyCode'));

// Страницы админ-панели
const DashboardPage = lazy(() => import('../pages/Dashboard'));
const GardeningPage = lazy(() => import('../pages/Gardening'));
// const UsersListPage = lazy(() => import('../pages/users/UsersList'));
// const UserDetailsPage = lazy(() => import('../pages/users/UserDetails'));
// const ProductsListPage = lazy(() => import('../pages/products/ProductsList'));
// const ProductDetailsPage = lazy(
// 	() => import('../pages/products/ProductDetails'),
// );
// const TasksListPage = lazy(() => import('../pages/tasks/TasksList'));
// const TaskDetailsPage = lazy(() => import('../pages/tasks/TaskDetails'));
// const SettingsPage = lazy(() => import('../pages/settings/Settings'));
// const ProfilePage = lazy(() => import('../pages/settings/Profile'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

// Компонент для обертывания страниц в Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
	<Suspense
		fallback={
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Spin size='large' />
			</div>
		}
	>
		{children}
	</Suspense>
);

// Создание роутера
const router = createBrowserRouter([
	// Маршруты авторизации
	{
		path: '/',
		element: <AuthLayout />,
		children: [
			{ path: '', element: <Navigate to='/signin' replace /> },
			{
				path: 'signin',
				element: (
					<SuspenseWrapper>
						<SignInPage />
					</SuspenseWrapper>
				),
			},
			{
				path: 'signup',
				element: (
					<SuspenseWrapper>
						<SignUpPage />
					</SuspenseWrapper>
				),
			},
			{
				path: 'verify',
				element: (
					<SuspenseWrapper>
						<VerifyCodePage />
					</SuspenseWrapper>
				),
			},
			// {
			// 	path: 'forgot-password',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<ForgotPasswordPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'reset-password',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<ResetPasswordPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
		],
	},

	// Защищенные маршруты админ-панели
	{
		path: '/admin',
		element: (
			<ProtectedRoute>
				<AdminLayout />
			</ProtectedRoute>
		),
		children: [
			{ path: '', element: <Navigate to='/admin/dashboard' replace /> },
			{
				path: 'dashboard',
				element: (
					<SuspenseWrapper>
						<DashboardPage />
					</SuspenseWrapper>
				),
			},
			{
				path: 'tasks',
				element: (
					<SuspenseWrapper>
						<TasksList />
					</SuspenseWrapper>
				),
			},
			{
				path: 'tasks/create',
				element: (
					<SuspenseWrapper>
						<TaskCreate />
					</SuspenseWrapper>
				),
			},
			{
				path: 'tasks/:id',
				element: <TaskDetail />,
			},
			{
				path: 'tasks/:id/edit',
				element: (
					<SuspenseWrapper>
						<TaskEdit />
					</SuspenseWrapper>
				),
			},
			{
				path: 'plans',
				element: (
					<SuspenseWrapper>
						<PlansList />
					</SuspenseWrapper>
				),
			},
			{
				path: 'plans/create',
				element: (
					<SuspenseWrapper>
						<PlanForm />
					</SuspenseWrapper>
				),
			},
			{
				path: 'plans/:id',
				element: (
					<SuspenseWrapper>
						<PlanDetail />
					</SuspenseWrapper>
				),
			},
			{
				path: 'plans/:id/edit',
				element: (
					<SuspenseWrapper>
						<PlanForm />
					</SuspenseWrapper>
				),
			},
			{
				path: 'animals',
				element: (
					<SuspenseWrapper>
						<AnimalCare />
					</SuspenseWrapper>
				),
			},
			{
				path: 'gardening',
				element: (
					<SuspenseWrapper>
						<GardeningPage />
					</SuspenseWrapper>
				),
			},
			// {
			// 	path: 'users',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<UsersListPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'users/:id',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<UserDetailsPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'products',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<ProductsListPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'products/:id',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<ProductDetailsPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'tasks',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<TasksListPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'tasks/:id',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<TaskDetailsPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'settings',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<SettingsPage />
			// 		</SuspenseWrapper>
			// 	),
			// },
			// {
			// 	path: 'profile',
			// 	element: (
			// 		<SuspenseWrapper>
			// 			<ProfilePage />
			// 		</SuspenseWrapper>
			// 	),
			// },
		],
	},

	// Маршрут 404
	{
		path: '*',
		element: (
			<SuspenseWrapper>
				<NotFoundPage />
			</SuspenseWrapper>
		),
	},
]);

// Компонент провайдера роутера
const AppRouter = () => {
	return <RouterProvider router={router} />;
};

export default AppRouter;
