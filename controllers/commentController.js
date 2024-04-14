const Comment = require('../models/Comment');
const User = require('../models/User');
const escapeHtml = require('escape-html'); // Добавлено для экранирования HTML

exports.createComment = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const text = escapeHtml(req.body.text); // Экранирование ввода пользователя
        const newComment = new Comment({
            text: text, // Использование экранированного текста
            user: req.body.userId,
        });
        await newComment.save();
        res.status(201).send(newComment);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllComments = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    try {
        const comments = await Comment.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 }) // Сортировка по убыванию даты создания
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments(); // Общее количество комментариев для пагинации

        res.status(200).json({
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
            comments,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = req.file.path;
        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
