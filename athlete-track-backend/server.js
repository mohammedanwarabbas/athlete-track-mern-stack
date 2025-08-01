require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors'); // Import CORS for handling cross-origin requests(if frontend needs CORS)

// Initialize Express
const app = express();


// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Use CORS middleware

// Routes
const authRoutes = require('./routes/authRoutes');
const athleteRoutes = require('./routes/athleteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const demoDataRoutes = require('./routes/demoDataRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/athlete', athleteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/demo-data', demoDataRoutes);

// Error Handling (Basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start the server if db gets connected
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});