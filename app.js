const express = require('express');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const mongoose = require('./db'); // Подключаем конфигурацию базы данных

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware для разбора JSON-тел запросов

// Регистрация маршрутов
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
