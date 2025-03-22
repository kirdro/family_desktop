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

# Копируем файлы сборки
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем ваш пользовательский конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]