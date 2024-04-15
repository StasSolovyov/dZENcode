const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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
            'kPITNhRmGv9AonqY2NgO7T7j_nzdTQKuWUIqnHNJBDw', // Используйте переменную окружения для секретного ключа
            { expiresIn: '24h' }
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
