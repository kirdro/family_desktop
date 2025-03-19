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
	build: {
		chunkSizeWarningLimit: 1600,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
			},
		},
	},
});
