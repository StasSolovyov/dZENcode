const csrf = require('csurf');

// Настройка CSRF protection middleware
const csrfProtection = csrf({
    cookie: {
        key: '_csrf',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600, // 1 час
    },
    value: (req) => req.headers['x-csrf-token'] || req.body['_csrf'],
});

module.exports = csrfProtection;
