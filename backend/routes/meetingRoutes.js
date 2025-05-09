const express = require('express');
const {
  scheduleMeeting,
  getMeetings,
  getMeetingsForStudent
} = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Create meeting
router.post('/', protect, scheduleMeeting);

// ✅ Get all meetings for logged-in user
router.get('/', protect, getMeetings);

// ✅ Get meetings for a specific student
router.get('/student/:studentId', protect, getMeetingsForStudent);

module.exports = router;
