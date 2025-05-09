const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  title: String,
  description: String,
  skills: [String],
  facultyId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  availableSlots: Number
});

module.exports = model('Project', projectSchema);
