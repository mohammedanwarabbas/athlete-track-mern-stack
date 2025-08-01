const express = require('express');
const router = express.Router();
const {
  logWorkout,
  getWorkoutHistory,
  deleteWorkout,
  updateWorkout,
  getExerciseList,
  getDashboardStats
} = require('../controllers/athleteController');
const { authenticate, isAthlete } = require('../middlewares/authMiddleware');

// @desc    Log a new workout
// @route   POST /api/athlete/workouts
// @access  Private (Athlete only)
router.post('/workouts', authenticate, isAthlete, logWorkout);

// @desc    Get workout history
// @route   GET /api/athlete/workouts
// @access  Private (Athlete only)
router.get('/workouts', authenticate, isAthlete, getWorkoutHistory);

// @desc    Delete a workout
// @route   DELETE /api/athlete/workouts/:id
// @access  Private (Athlete only)
router.delete('/workouts/:id', authenticate, isAthlete, deleteWorkout);

// @desc    Update a workout
// @route   PUT /api/athlete/workouts/:id
// @access  Private (Athlete only)
router.put('/workouts/:id', authenticate, isAthlete, updateWorkout);

// @desc    Get available exercises
// @route   GET /api/athlete/exercises
// @access  Private (Athlete only)
router.get('/exercises', authenticate, isAthlete, getExerciseList);

// @desc    Get dashboard statistics
// @route   GET /api/athlete/dashboard-stats
// @access  Private (Athlete only)
router.get('/dashboard-stats', authenticate, isAthlete, getDashboardStats);

module.exports = router;