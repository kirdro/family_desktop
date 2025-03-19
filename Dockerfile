# Stage 1: Сборка приложения
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm i --legacy-peer-deps

# Копируем остальной исходный код
COPY . .

# Собираем проект (папка сборки по умолчанию: /dist)
RUN npm run build

# Stage 2: Создание финального образа с Nginx
FROM nginx:alpine

# Копируем сгенерированные файлы сборки в директорию, которую Nginx использует для обслуживания статики
COPY --from=builder /app/dist /usr/share/nginx/html

# Если требуется, можно скопировать свой конфиг для Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx в foreground режиме
CMD ["nginx", "-g", "daemon off;"]