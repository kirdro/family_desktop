import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {ConfigProvider, theme} from 'antd'
import ruRU from 'antd/locale/ru_RU' // (или другая локаль)
import './index.css'
import {queryClient} from "./lib/queryClient.ts";


const darkTheme = {
    algorithm: theme.darkAlgorithm, // Используем встроенный темный алгоритм
    token: {
        colorPrimary: '#76ABAE',      // Акцентный цвет
        colorBgBase: '#222831',       // Базовый цвет фона
        colorTextBase: '#EEEEEE',     // Базовый цвет текста
        colorBgElevated: '#31363F',   // Цвет фона приподнятых элементов
        colorBorder: '#31363F',       // Цвет границ
        borderRadius: 6,              // Радиус границ для всех компонентов
    },
    components: {
        Card: {
            colorBgContainer: '#31363F', // Фон карточек
        },
        Table: {
            colorBgContainer: '#31363F', // Фон таблиц
            colorFillAlter: '#222831',   // Альтернативный фон строк в таблице
        },
        Layout: {
            colorBgHeader: '#31363F',    // Цвет фона Header
            colorBgBody: '#222831',      // Цвет фона Content
            colorBgTrigger: '#31363F',   // Цвет фона триггера сворачивания Sider
        },
        Menu: {
            colorItemBg: '#31363F',      // Фон элементов меню
            colorItemText: '#EEEEEE',    // Цвет текста меню
            colorItemTextSelected: '#76ABAE', // Цвет текста выбранного элемента
        },
        Button: {
            colorPrimaryHover: '#5D8A8D', // Цвет при наведении на кнопку
        },
    },
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <ConfigProvider
              locale={ruRU}
              theme={darkTheme}
          >
              <App />
          </ConfigProvider>
          <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  </StrictMode>,
)
