const { body, validationResult } = require('express-validator');
const axios = require('axios');
const User = require('../models/User');

exports.createUser = async (req, res) => {
    console.log('Received recaptchaToken:', req.body.recaptchaToken); // Логирование токена reCAPTCHA
    console.log('Received form data:', req.body); // Логирование всех данных формы
    console.log('Received data:', req.body);
    // Извлекаем токен reCAPTCHA из запроса
    const recaptchaToken = req.body.recaptchaToken;

    if (!recaptchaToken) {
        return res
            .status(400)
            .json({ message: 'No reCAPTCHA token provided.' });
    }

    // Функция для верификации reCAPTCHA с помощью сервера Google
    const verifyRecaptcha = async (token) => {
        const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

        try {
            const response = await axios.post(url);
            return response.data.success;
        } catch (error) {
            console.error('Error verifying reCAPTCHA:', error);
            return false;
        }
    };

    // Проверяем reCAPTCHA
    const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isCaptchaValid) {
        return res.status(400).json({ message: 'Captcha validation failed' });
    }

    // Валидация данных формы
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            homepage: req.body.homepage,
        });
        await newUser.save();
        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
