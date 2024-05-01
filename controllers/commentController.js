const { sqs, queueUrl } = require('../src/config/awsConfig');
const User = require('../models/User');
const escapeHtml = require('escape-html');

exports.createComment = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const text = escapeHtml(req.body.text);
        // Включаем необходимые данные пользователя в сообщение
        const commentData = {
            text: text,
            userId: req.body.userId,
            user: {
                // Выберите поля, которые нужно включить
                username: user.username,

                // Добавьте другие поля по необходимости
            },
            fileUrl: req.file ? req.file.path : null,
        };

        const params = {
            MessageBody: JSON.stringify(commentData),
            QueueUrl: queueUrl,
        };

        const sendResult = await sqs.sendMessage(params).promise();
        console.log('Message sent to SQS:', sendResult.MessageId);
        res.status(202).send({ message: 'Comment is being processed' });
    } catch (error) {
        console.error('Failed to send message to SQS:', error);
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
