import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import ruRU from 'antd/locale/ru_RU'; // (или другая локаль)
import './index.css';
import { queryClient } from './lib/queryClient';
import { LoadingProvider } from './context/LoadingContext';
import { Toaster } from 'react-hot-toast';

export const darkTheme = {
	algorithm: theme.darkAlgorithm,
	token: {
		colorPrimary: '#76ABAE',
		colorBgBase: '#222831',
		colorTextBase: '#EEEEEE',
		colorBgElevated: '#31363F',
		colorBorder: '#31363F',
		borderRadius: 6,
	},
	components: {
		Card: {
			colorBgContainer: '#31363F',
		},
		Table: {
			colorBgContainer: '#31363F',
			colorFillAlter: '#222831',
		},
		Layout: {
			// Замена устаревших токенов на новые
			bodyBg: '#222831', // было colorBgBody
			headerBg: '#31363F', // было colorBgHeader
			siderBg: '#31363F', // было colorBgSider
			// Другие токены Layout
			footerBg: '#222831', // было colorBgFooter, если используется
			triggerBg: '#31363F', // было colorBgTrigger
		},
		Menu: {
			colorItemBg: '#31363F',
			colorItemText: '#EEEEEE',
			colorItemTextSelected: '#76ABAE',
		},
		Button: {
			colorPrimaryHover: '#5D8A8D',
		},
	},
};

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ConfigProvider locale={ruRU} theme={darkTheme}>
				<AntApp>
					<LoadingProvider>
						<App />
					</LoadingProvider>
					<Toaster position='top-center' reverseOrder={false} />
				</AntApp>
			</ConfigProvider>

			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
