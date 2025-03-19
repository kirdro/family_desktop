import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: {
				tsconfigPath: './tsconfig.json',
				buildMode: false,
			},
			// ESLint часть удалена, так как она вызывает проблемы
		}),
		tsconfigPaths(),
	],
	resolve: {
		alias: {
			'styled-components/macro': 'styled-components',
		},
	},
});
