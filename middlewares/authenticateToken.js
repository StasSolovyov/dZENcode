const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient'); // Импорт настроенного клиента Redis

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    redisClient.get(`auth_tokens:${token}`, (err, result) => {
        if (err) throw err;
        if (!result) return res.sendStatus(403); // Токен не найден в Redis

        jwt.verify(token, 'your_secret_key_here', (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    });
}

module.exports = authenticateToken;
