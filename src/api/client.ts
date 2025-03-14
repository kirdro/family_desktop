// src/api/client.ts
import axios from 'axios'
import { message } from 'antd'

// Базовая URL
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com'

// Создаем экземпляр axios с базовым URL
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Добавляем перехватчики для добавления токенов авторизации
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Обработка ошибок от API
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Получаем сообщение об ошибке от сервера или стандартное
        const errorMessage =
            error.response?.data?.message ||
            'Произошла ошибка при выполнении запроса'

        // Обработка конкретных статусов
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Перенаправление на логин при ошибке авторизации
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('user')
                    message.error('Сессия истекла. Пожалуйста, войдите снова.')
                    // Перенаправление на страницу входа
                    window.location.href = '/login'
                    break
                case 403:
                    message.error('У вас нет прав для выполнения этого действия')
                    break
                case 404:
                    message.error('Запрашиваемый ресурс не найден')
                    break
                case 500:
                    message.error('Ошибка сервера. Пожалуйста, попробуйте позже')
                    break
                default:
                    message.error(errorMessage)
            }
        } else if (error.request) {
            // Ошибка сети - нет ответа от сервера
            message.error('Не удалось связаться с сервером. Проверьте подключение')
        } else {
            message.error(errorMessage)
        }

        return Promise.reject(error)
    }
)

export default apiClient