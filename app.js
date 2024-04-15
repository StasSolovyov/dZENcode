const express = require('express'); // Импорт библиотеки Express для создания серверных приложений
const authenticateToken = require('./middlewares/authenticateToken'); // Импорт middleware для аутентификации токенов
const { setCSP, setCSRF } = require('./middlewares/security'); // Импорт функций для установки политики безопасности
const commentRoutes = require('./routes/comments'); // Импорт маршрутов для работы с комментариями
const userRoutes = require('./routes/users'); // Импорт маршрутов для работы с пользователями
const cookieParser = require('cookie-parser'); // Импорт middleware для работы с куками
const mongoose = require('./db'); // Предполагается, что db.js экспортирует настройки mongoose

const app = express(); // Создание экземпляра приложения Express

// Настройка middleware для кук и CSRF
app.use(cookieParser({ secure: false })); // Подключение cookie-parser для работы с куками, secure: false для тестирования без HTTPS

setCSP(app); // Установка политики Content Security Policy
setCSRF(app); // Установка дополнительных настроек для защиты от CSRF

app.use(express.json()); // Включение парсера для JSON

// Endpoint для получения CSRF токена
app.get('/get-csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() }); // Отправка CSRF токена клиенту
});

// Регистрация маршрутов
app.use('/users', userRoutes); // Маршруты для работы с пользователями
app.use('/comments', authenticateToken, commentRoutes); // Маршруты для комментариев, с предварительной аутентификацией

// Обработка ошибок CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Проверка типа ошибки
        res.status(403); // Ошибка доступа, CSRF токен не совпадает
        res.send('Session has expired or form tampered with'); // Сообщение об ошибке
    } else {
        next(err); // Передача ошибки следующему обработчику, если она не связана с CSRF
    }
});

const PORT = 3000; // Номер порта
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`); // Запуск сервера и вывод сообщения о запуске
});
