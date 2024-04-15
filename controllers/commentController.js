const Comment = require('../models/Comment');
const User = require('../models/User');
const escapeHtml = require('escape-html');

exports.createComment = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const text = escapeHtml(req.body.text);
        const newComment = new Comment({
            text: text,
            user: req.body.userId,
            fileUrl: req.file ? req.file.path : null, // Сохраняем ссылку на файл, если загружен
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
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments();

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
