// routes/projectRoutes.js
const express = require('express');
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const Project = require('../models/Project'); // ✅ Import Project model
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllProjects); // Public or protected for students
router.post('/', protect, createProject); // Faculty only
router.put('/:id', protect, updateProject); // Faculty only
router.delete('/:id', protect, deleteProject); // Faculty only

// ✅ New route to get a project by its title
router.get('/by-title/:title', protect, async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title);
    const project = await Project.findOne({ title });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

module.exports = router;
