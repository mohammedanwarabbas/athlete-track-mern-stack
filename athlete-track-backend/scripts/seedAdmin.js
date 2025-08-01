// use run [node scripts/seedAdmin.js](to run mannually once) or [npm run seed:admin]
require('dotenv').config(); // Load .env variables
const User = require('../models/User');
const connectDB = require('../config/db');

// Admin credentials from .env (or defaults for development)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Don';

connectDB().then(async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
      role: 'admin'
    });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return process.exit(0);
    }

    // Create new admin
    await User.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // Auto-hashed by User model
      name: ADMIN_NAME,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    process.exit();
  }
});