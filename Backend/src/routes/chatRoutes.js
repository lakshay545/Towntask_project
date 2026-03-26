const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

// === MESSAGE SENDING ===

// Send a message
router.post('/', auth, chatController.sendMessage);

// === GETTING MESSAGES ===

// Get all messages for a specific job
router.get('/job/:jobId', auth, chatController.getJobMessages);

// Get conversation between two users on a specific job
router.get('/conversation/:jobId/:otherUserId', auth, chatController.getConversation);

// === MESSAGE MANAGEMENT ===

// Mark a message as read
router.put('/:messageId/read', auth, chatController.markAsRead);

// Mark all messages as read for a job
router.put('/job/:jobId/read-all', auth, chatController.markAllAsRead);

// Delete a message
router.delete('/:messageId', auth, chatController.deleteMessage);

// === USER CONVERSATIONS ===

// Get unread message count
router.get('/unread/count', auth, chatController.getUnreadCount);

// Get all conversations for the user
router.get('/list/all', auth, chatController.getUserConversations);

module.exports = router;

