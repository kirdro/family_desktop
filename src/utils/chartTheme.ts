// src/utils/chartTheme.ts
import { theme } from 'antd';
import { darkTheme } from '../main.tsx';

// Получение токенов темы
const { useToken } = theme;

/**
 * Создает конфигурацию темы для графиков
 */
export function useChartTheme() {
	const { token } = useToken();

	console.log('>>>>>><<<<<<<>>>>>', token);
	// Базовые настройки темы для всех графиков
	const getBaseTheme = () => ({
		// Цвета для графиков
		colors10: [
			'#76ABAE',
			'#5D8A8D',
			'#4D7A7D',
			'#3D6A6D',
			'#2D5A5D',
			'#1D4A4D',
			'#0D3A3D',
			'#002A2D',
			'#001A1D',
			'#000A0D',
		],

		// Настройки осей
		axisCommon: {
			label: {
				style: {
					fill: darkTheme.token.colorPrimary,
					opacity: 0.8,
				},
			},
			line: {
				style: {
					stroke: darkTheme.token.colorPrimary,
				},
			},
			tickLine: {
				style: {
					stroke: darkTheme.token.colorPrimary,
				},
			},
		},

		// Сетка
		grid: {
			line: {
				style: {
					stroke: token.colorBorder,
					lineWidth: 1,
					lineDash: [4, 4],
				},
			},
		},

		// Легенда
		legend: {
			itemName: {
				style: {
					fill: token.colorTextBase,
					fontSize: 14,
				},
			},
		},

		// Тултип
		tooltip: {
			domStyles: {
				'g2-tooltip': {
					backgroundColor: token.colorBgElevated,
					boxShadow: `0 2px 8px rgba(0, 0, 0, 0.25)`,
					color: token.colorTextBase,
					padding: '12px 16px',
					borderRadius: `${token.borderRadius}px`,
				},
				'g2-tooltip-title': {
					color: token.colorTextBase,
					fontWeight: 'bold',
				},
				'g2-tooltip-list-item': {
					color: token.colorTextBase,
					marginBottom: '8px',
				},
			},
		},
	});

	return {
		getBaseTheme,
		// Функция для создания темы для конкретного типа графика
		getLineConfig: (config) => ({
			...getBaseTheme(),
			...config,
			xAxis: {
				...getBaseTheme().axisCommon,
				...config.xAxis,
			},
			yAxis: {
				...getBaseTheme().axisCommon,
				grid: getBaseTheme().grid,
				...config.yAxis,
			},
		}),
		// Аналогично для других типов графиков
		getPieConfig: (config) => ({
			...getBaseTheme(),
			...config,
			label: {
				style: {
					fill: token.colorTextBase,
					...config.label?.style,
				},
				...config.label,
			},
		}),
		getColumnConfig: (config) => ({
			...getBaseTheme(),
			...config,
			xAxis: {
				...getBaseTheme().axisCommon,
				...config.xAxis,
			},
			yAxis: {
				...getBaseTheme().axisCommon,
				grid: getBaseTheme().grid,
				...config.yAxis,
			},
		}),
	};
}
