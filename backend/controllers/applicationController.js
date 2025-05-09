const Application = require('../models/Application');
const Project = require('../models/Project');

// Student applies for a project
exports.applyForProject = async (req, res) => {
  const { projectId, sop } = req.body;
  const studentId = req.user.id;

  try {
    // Check if already applied
    const alreadyApplied = await Application.findOne({ studentId, projectId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this project' });
    }

    // Check if project is valid and open
    const project = await Project.findById(projectId);
    if (!project || project.status === 'Closed') {
      return res.status(400).json({ message: 'Project not available' });
    }

    // ✅ Get resume file path (if uploaded)
    const resumePath = req.file ? req.file.path : null;

    // Create new application
    const application = await Application.create({
      studentId,
      projectId,
      sop,
      resume: resumePath // Save resume file path
    });

    res.status(201).json({ message: 'Application submitted', application });

  } catch (err) {
    console.error('❌ Error submitting application:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Faculty views applications for a project
exports.viewApplications = async (req, res) => {
  const { projectId } = req.params;

  try {
    const applications = await Application.find({ projectId })
      .populate('studentId', 'name email')
      .populate('projectId', 'title');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Faculty approves or rejects an application
exports.updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: `Application ${status.toLowerCase()}`, application });
  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ✅ Student views their own applications
exports.getApplicationsByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const applications = await Application.find({ studentId })
      .populate('projectId', 'title domain status');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getApplicationsByFaculty = async (req, res) => {
  const { facultyId } = req.params;

  try {
    const applications = await Application.find()
      .populate({
        path: 'projectId',
        match: { facultyId: facultyId }, // Only populate if this matches
        select: 'title domain status facultyId'
      })
      .populate('studentId', 'name email');

    // Filter out applications where the projectId did not match
    const filteredApps = applications.filter(app => app.projectId !== null);
 
    res.json(filteredApps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
