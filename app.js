const express = require('express');
const { setCSP, setCSRF } = require('./middleware/security');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const mongoose = require('./db');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// Настройка middleware для кук и CSRF
app.use(cookieParser({ secure: false })); // Установка secure: false для тестирования без HTTPS
app.use(
    csrf({
        cookie: {
            key: '_csrf', // Имя куки
            path: '/', // Путь куки
            httpOnly: true, // Куки доступны только серверу
            secure: process.env.NODE_ENV === 'production', // Использовать куки только по HTTPS
            maxAge: 3600, // Время жизни куки в секундах
        },
    })
);

setCSP(app);
setCSRF(app);

app.use(express.json());

// Endpoint для получения CSRF токена
app.get('/get-csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Регистрация маршрутов
app.use('/users', userRoutes);
app.use('/comments', commentRoutes);

// Обработка ошибок CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403);
        res.send('Session has expired or form tampered with stas');
    } else {
        next(err);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
