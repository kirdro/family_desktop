import { QueryClient } from '@tanstack/react-query'

// Опции по умолчанию для запросов
export const queryClientOptions = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
        },
    },
}

// Создаем экземпляр клиента
export const queryClient = new QueryClient(queryClientOptions)