import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import AppRouter from './routes';
import { secureStorage } from './utils/token-storage.ts';
import { usePostVerifyToken } from './api/usePostVerifyToken.ts';

function App() {
	return <AppRouter />;
}

export default App;
