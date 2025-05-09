const { Schema, model } = require('mongoose');

const meetingSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User' },
  facultyId: { type: Schema.Types.ObjectId, ref: 'User' },
  dateTime: String
});

module.exports = model('Meeting', meetingSchema);
