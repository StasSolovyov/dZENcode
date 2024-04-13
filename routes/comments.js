const express = require('express');
const router = express.Router();
const multer = require('multer');
const commentController = require('../controllers/commentController');

// Настройки для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), commentController.uploadFile);
router.post('/', commentController.createComment);
router.get('/', commentController.getAllComments);

module.exports = router;
