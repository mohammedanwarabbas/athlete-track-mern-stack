const express = require('express');
const router = express.Router();
const {
  getAllExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getAllAthletes,
  getWorkoutHistory,
  deleteWorkout,
  restoreExercise,
  getDashboardStats,
} = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// @desc    Get all exercises
router.get('/exercises', authenticate, isAdmin, getAllExercises);

// @desc    Create a new exercise
router.post('/exercises', authenticate, isAdmin, createExercise);

// @desc    Restore a deleted exercise
router.patch('/exercises/:id/restore', authenticate, isAdmin, restoreExercise);

// @desc    Update an existing exercise
router.put('/exercises/:id', authenticate, isAdmin, updateExercise);

// @desc    Delete an exercise (soft delete)
router.delete('/exercises/:id', authenticate, isAdmin, deleteExercise);

// @desc    Get all athletes
router.get('/athletes', authenticate, isAdmin, getAllAthletes);

// @desc    Get all athletes workout history
router.get('/workouts', authenticate, isAdmin, getWorkoutHistory);

// @esc   Delete a athlete's workout
router.delete('/workouts/:id', authenticate, isAdmin, deleteWorkout);

// @desc    Get dashboard statistics
router.get("/dashboard-stats", authenticate, isAdmin, getDashboardStats);

module.exports = router;