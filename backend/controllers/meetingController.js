const Meeting = require('../models/Meeting');
const User = require('../models/User');

// ✅ Schedule a new meeting using facultyId
exports.scheduleMeeting = async (req, res) => {
  const { facultyId, studentId, dateTime } = req.body;

  try {
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const meeting = await Meeting.create({
      studentId,
      facultyId,
      dateTime
    });

    res.status(201).json({ message: 'Meeting scheduled successfully', meeting });
  } catch (err) {
    console.error("❌ Error scheduling meeting:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get meetings for authenticated user (student or faculty)
exports.getMeetings = async (req, res) => {
  const userId = req.user.id;

  try {
    const meetings = await Meeting.find({
      $or: [{ studentId: userId }, { facultyId: userId }]
    })
      .populate('studentId', 'name email')
      .populate('facultyId', 'name email');

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get meetings for a specific student (for dashboard)
exports.getMeetingsForStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const meetings = await Meeting.find({ studentId })
      .populate('facultyId', 'name email')
      .sort({ dateTime: 1 });

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
