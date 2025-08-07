const express = require('express');
const router = express.Router();
const {
    seedDemoWorkouts
} = require('../controllers/demoDataController');

// @desc    Seed daily 2 demo workout data (time-based)
// @route   POST /api/demo-data/seed-workouts
// @access  Private (Cron Job only)

// Secure endpoint for cron jobs only
// vercel cron jobs always uses GET so dont use POST.
router.get('/seed-workouts', (req, res, next) => {
    console.log('Received secret:', req.headers['x-cron-secret']);
  console.log('Expected secret:', process.env.CRON_SECRET);
    if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
        return res.status(403).json({ error: 'Forbidden: Invalid cron token' });
    }
    next();
}, seedDemoWorkouts);

module.exports = router;
