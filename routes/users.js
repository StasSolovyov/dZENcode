// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const verifyRecaptcha = require('../middlewares/recaptchaMiddleware');
const { createUser } = require('../controllers/userController');
const {
    validateUserRegistration,
} = require('../middlewares/validationMiddleware');

router.post('/register', verifyRecaptcha, validateUserRegistration, createUser);

module.exports = router;
