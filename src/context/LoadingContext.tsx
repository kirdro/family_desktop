// src/context/LoadingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Spin } from 'antd';
import styles from './LoadingContext.module.css';

interface LoadingContextType {
	showLoading: (message?: string) => void;
	hideLoading: () => void;
	isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
	children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
	children,
}) => {
	const [loadingCount, setLoadingCount] = useState(0);
	const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
		undefined,
	);

	const showLoading = (message?: string) => {
		setLoadingCount((prev) => prev + 1);
		if (message) {
			setLoadingMessage(message);
		}
	};

	const hideLoading = () => {
		setLoadingCount((prev) => Math.max(0, prev - 1));
	};

	const isLoading = loadingCount > 0;

	return (
		<LoadingContext.Provider
			value={{
				showLoading,
				hideLoading,
				isLoading,
			}}
		>
			{children}
			{isLoading && (
				<div className={styles.spinnerOverlay}>
					<div className={styles.spinnerContainer}>
						<Spin size='large' />
						{loadingMessage && (
							<div className={styles.spinnerMessage}>
								{loadingMessage}
							</div>
						)}
					</div>
				</div>
			)}
		</LoadingContext.Provider>
	);
};
export const useLoading = (): LoadingContextType => {
	const context = useContext(LoadingContext);
	if (context === undefined) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
};
