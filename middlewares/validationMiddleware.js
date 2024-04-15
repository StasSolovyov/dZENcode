const { body, validationResult } = require('express-validator');

// Валидация данных пользователя
const validateUserRegistration = [
    body('username')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric and is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('homepage').optional().isURL().withMessage('Invalid URL format'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateUserRegistration,
};
