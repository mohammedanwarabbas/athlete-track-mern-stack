const express = require('express');
const router = express.Router();
const {
    seedDemoWorkouts
} = require('../controllers/demoDataController');

// @desc    Seed daily 2 demo workout data (time-based)
// @route   POST /api/demo-data/seed-workouts
// @access  Private (Cron Job only)

// Secure endpoint for cron jobs only
router.post('/seed-workouts', (req, res, next) => {
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(403).json({ error: 'Forbidden: Invalid cron token' });
    }
    next();
}, seedDemoWorkouts);

module.exports = router;