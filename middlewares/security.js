const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Настройка CSP
function setCSP(app) {
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", 'https://fonts.googleapis.com/'],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", 'https://fonts.gstatic.com/'],
                objectSrc: ["'none'"],
                mediaSrc: ["'none'"],
                frameSrc: ["'none'"],
            },
        })
    );
}

// Настройка CSRF
function setCSRF(app) {
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));
}

module.exports = {
    setCSP,
    setCSRF,
};
