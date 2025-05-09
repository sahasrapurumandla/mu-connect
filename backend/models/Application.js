const { Schema, model } = require('mongoose');

const applicationSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  sop: { type: String },
  resume: { type: String }, // ✅ Added to store uploaded resume path
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
});

module.exports = model('Application', applicationSchema);
