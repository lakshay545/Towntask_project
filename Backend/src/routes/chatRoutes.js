const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:userId1/:userId2', protect, chatController.getChatMessages);
router.post('/send', protect, chatController.sendMessage);

module.exports = router;
