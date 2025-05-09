const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// ✅ Get all students for faculty dropdown
router.get('/students', protect, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name _id');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// ✅ Get all students for faculty dropdown
router.get('/faculty', protect, async (req, res) => {
    try {
      const faculty = await User.find({ role: 'faculty' }).select('name _id');
      res.json(faculty);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  router.get('/user/:id', protect, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('name department');
      console.log(user);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
module.exports = router;

