const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Берем токен из заголовка Authorization

    if (token == null) return res.sendStatus(401); // Если токен отсутствует, отправляем ошибку 401

    jwt.verify(
        token,
        'kPITNhRmGv9AonqY2NgO7T7j_nzdTQKuWUIqnHNJBDw',
        (err, user) => {
            if (err) return res.sendStatus(403); // Если токен не действителен, отправляем ошибку 403
            req.user = user;
            next(); // Переходим к следующему middleware
        }
    );
}

module.exports = authenticateToken;
