const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient'); // Импортируем настроенный клиент Redis
const User = require('../models/User');

exports.createUser = async (req, res) => {
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

        const token = jwt.sign(
            { userId: newUser._id },
            'your_secret_key_here',
            { expiresIn: '24h' }
        );

        // Сохраняем токен в Redis
        await redisClient.set(
            `auth_tokens:${token}`,
            JSON.stringify({ userId: newUser._id }), // Лучше сохранять минимально необходимую информацию
            'EX',
            86400
        );

        res.status(201).json({
            message: 'User registered successfully',
            userId: newUser._id,
            token: token,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
