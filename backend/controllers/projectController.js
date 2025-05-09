const Project = require('../models/Project');

// Create a new project (faculty only)
exports.createProject = async (req, res) => {
  const { title, description, skills, availableSlots,facultyId } = req.body;
 // const facultyId = req.user.id;

  const project = await Project.create({
    title,
    description,
    skills,
    availableSlots,
    facultyId
  });

  res.status(201).json({ message: 'Project created', project });
};

// Get all available projects (students can view)
exports.getAllProjects = async (req, res) => {
  const projects = await Project.find({ status: 'Open' }).populate('facultyId', 'name email department');
  console.log(projects);
  res.json(projects);
};

// Update a project (faculty only)
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const project = await Project.findByIdAndUpdate(id, updates, { new: true });
  res.json({ message: 'Project updated', project });
};

// Delete a project (faculty only)
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.json({ message: 'Project deleted' });
};
