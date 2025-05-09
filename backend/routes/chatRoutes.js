const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getConversationsForUser
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Send message
router.post('/', protect, sendMessage);

// Get messages between two users
router.get('/:userId', protect, getMessages);

// ✅ Get students faculty has chatted with
router.get('/conversations', protect, getConversationsForUser);

module.exports = router;
