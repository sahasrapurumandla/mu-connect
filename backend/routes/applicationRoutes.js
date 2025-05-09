const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  applyForProject,
  viewApplications,
  updateApplicationStatus,
  getApplicationsByStudent,
  getApplicationsByFaculty
} = require('../controllers/applicationController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where resumes will be saved
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

// ✅ File filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Student applies (with optional resume)
router.post('/', protect, upload.single('resume'), applyForProject);

// ✅ Student views their own applications
router.get('/byStudent/:studentId', protect, getApplicationsByStudent);
router.get('/faculty/:facultyId', protect, getApplicationsByFaculty);

// ✅ Faculty views applications by project
router.get('/:projectId', protect, viewApplications);

// ✅ Faculty approves/rejects application
router.put('/update/:applicationId', protect, updateApplicationStatus);

module.exports = router;
