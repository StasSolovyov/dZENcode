const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/create', commentController.createComment);
router.get('/allUserComment', commentController.getAllComments);

module.exports = router;
