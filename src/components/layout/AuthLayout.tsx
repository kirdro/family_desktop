// src/components/layout/AuthLayout.tsx
import { Outlet } from 'react-router-dom';
import { Layout, theme } from 'antd';

const AuthLayout: React.FC = () => {
	const { token } = theme.useToken();

	return (
		<Layout
			style={{
				minHeight: '100vh',
				// Замена устаревшего токена colorBgBody на bodyBg
				background: token.bodyBg, // было token.colorBgBody
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					maxWidth: 450,
					width: '100%',
					padding: '0 20px',
				}}
			>
				<Outlet />
			</div>
		</Layout>
	);
};

export default AuthLayout;
