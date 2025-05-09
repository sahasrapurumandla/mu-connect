const Chat = require('../models/Chat');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, message } = req.body;

  try {
    const newChat = await Chat.create({ senderId, receiverId, message });
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all messages between current user and another user
exports.getMessages = async (req, res) => {
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  try {
    const messages = await Chat.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get all students the current faculty has chatted with
exports.getConversationsForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId receiverId', 'name role');

    const studentMap = {};

    chats.forEach(chat => {
      const other =
        chat.senderId._id.toString() === userId
          ? chat.receiverId
          : chat.senderId;

      if (other.role === 'student') {
        studentMap[other._id] = other;
      }
    });

    res.json(Object.values(studentMap));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
