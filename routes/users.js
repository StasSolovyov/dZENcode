const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

// Маршрут для регистрации пользователя
router.post(
    '/',
    [
        body('username')
            .isAlphanumeric()
            .withMessage('Username must be alphanumeric and is required'),
        body('email').isEmail().withMessage('Invalid email format'),
        body('homepage').optional().isURL().withMessage('Invalid URL format'),
    ],
    userController.createUser
);

module.exports = router;
