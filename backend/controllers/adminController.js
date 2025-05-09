const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    .populate('facultyId', 'name department'); 
    console.log(projects);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Create a new project (Admin only)
exports.createProject = async (req, res) => {
  const { title, faculty, description, department, skills } = req.body;
  if (!title || !faculty || !description || !department) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const project = new Project({ title, faculty, description, department, skills });
    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

// Update a project (Admin only)
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, faculty, description, department, skills } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.faculty = faculty || project.faculty;
    project.description = description || project.description;
    project.department = department || project.department;
    project.skills = skills || project.skills;

    await project.save();
    res.json({ message: 'Project updated', project });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
};

// Delete a project (Admin only)
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('studentId', 'name email')
      .populate('projectId', 'title domain');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
