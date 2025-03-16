import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), checker({ typescript: true }), tsconfigPaths()],
	resolve: {
		alias: {
			// '@focus/front-lib': resolve(__dirname, '../focus-front-lib/src'),
			'styled-components/macro': 'styled-components', // resplve macro of styled-components

			//         // styles: resolve(__dirname, 'src/styles'),
			//         'src': resolve(__dirname, 'src'),
			//         '~': resolve(__dirname, 'src'),

			//         '@fluentui/react/lib/ThemeGenerator': require('@fluentui/react'),
			//         // 'styled-components': require.resolve('styled-components'),
			//         // '@fluentui/react-components': require.resolve('@fluentui/react-components'),
			//         // '@fluentui/react': require.resolve('@fluentui/react'),
			//         // // './runtimeConfig': './runtimeConfig.browser',
			//         // 'react': resolve(__dirname, 'node_modules/react'),  // Explicitly specify the path to react
		},
		//     extensions: ['.tsx', '.ts', '.js', '.scss', '.sass'],
		//     preserveSymlinks: true  // Add this line
	},
});
