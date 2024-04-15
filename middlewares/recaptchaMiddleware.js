// middlewares/recaptchaMiddleware.js
const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
    const recaptchaToken = req.body.recaptchaToken;
    if (!recaptchaToken) {
        return res
            .status(400)
            .json({ message: 'No reCAPTCHA token provided.' });
    }

    const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Убедитесь, что этот ключ хранится в переменных окружения
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
        const response = await axios.post(url);
        if (!response.data.success) {
            return res
                .status(400)
                .json({ message: 'Captcha validation failed' });
        }
        next();
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        res.status(500).json({ message: 'Error verifying reCAPTCHA' });
    }
};

module.exports = verifyRecaptcha;
