const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' }
});

module.exports = model('User', userSchema);
