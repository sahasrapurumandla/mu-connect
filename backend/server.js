// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Debug: Confirm environment variable
console.log("✅ Loaded MONGO_URI:", process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded resumes publicly
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads', 'resumes')));

// ✅ Serve static frontend files (FEWEB outside backend folder)
app.use(express.static(path.join(__dirname, '..', 'FEWEB')));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Direct access to specific frontend pages
app.get('/studentdashboard/project', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'FEWEB', 'studentdashboard', 'project.html'));
});

// ✅ Basic home route
app.get('/', (req, res) => {
  res.send('🎉 MUConnect Backend is running!');
});

// ✅ Error handling middleware
app.use(errorHandler);

// ✅ MongoDB connection and server startup
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log(`✅ Connected to DB: ${mongoose.connection.name}`);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
