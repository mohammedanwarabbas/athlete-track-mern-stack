const express = require('express');
const router = express.Router();
const { login, register, updateProfile } = require('../controllers/authController');
const { authenticate } = require('./../middlewares/authMiddleware')

//Public routes
// POST /api/auth/login
router.post('/login', login);
// POST /api/auth/register (Writer registration only)
router.post('/register', register);

//Protected routes
// POST /api/auth/update-profile (both admin and athlete)
router.put('/update-profile', authenticate, updateProfile);

module.exports = router;