const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const mongoose = require('mongoose');
const moment = require('moment');

// @desc    Get all active/inactive exercises
// @route   GET /api/admin/exercises
// @access  Private (Admin only)
exports.getAllExercises = async (req, res) => {
  try {
    const { showDeleted } = req.query;

    const filter = {};
    if (showDeleted !== 'true') {
      filter.isDeleted = false;
    }

    const exercises = await Exercise.find(filter).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error fetching exercises'
    });
  }
}

// @desc    create a new exercise
// @route   POST /api/admin/exercises
// @access  Private (Admin only)
exports.createExercise = async (req, res) => {
  try {
    const { name, caloriesPerMin } = req.body;

    // Validate input
    if (!name || !caloriesPerMin) {
      return res.status(400).json({ errorMessage: 'Name and calories per minute are required' });
    }

    // Check for existing exercise (including soft-deleted ones)
    const existingExercise = await Exercise.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive match
    });

    if (existingExercise) {
      if (existingExercise.isDeleted) {
        return res.status(409).json({
          errorMessage: 'Exercise with this name exists but is deleted',
          isDeleted: true,
          exerciseId: existingExercise._id
        });
      }
      return res.status(409).json({
        errorMessage: 'Exercise with this name already exists'
      });
    }

    // Create new exercise
    const exercise = await Exercise.create({
      name: name.trim(),
      caloriesPerMin,
    });

    res.status(201).json({ message: 'Exercise created successfully' });

  } catch (error) {
    console.error('Exercise creation error:', error);

    // Handle duplicate key error (fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        errorMessage: 'Exercise name already exists'
      });
    }

    res.status(500).json({ errorMessage: 'Failed to create exercise' });
  }
};

// @desc    Restore a soft-deleted exercise
// @route   PATCH /api/admin/exercises/:id/restore
// @access  Private (Admin only)
exports.restoreExercise = async (req, res) => {
  const { id } = req.params;
  const { caloriesPerMin } = req.body;

  try {
    // Find the soft-deleted exercise
    const exercise = await Exercise.findOne({
      _id: id,
      isDeleted: true
    });

    if (!exercise) {
      return res.status(404).json({
        errorMessage: 'Deleted exercise not found or already restored'
      });
    }

    // Restore and update if caloriesPerMin provided
    exercise.isDeleted = false;
    if (caloriesPerMin) {
      exercise.caloriesPerMin = caloriesPerMin;
    }
    await exercise.save();

    res.status(200).json({
      message: 'Exercise restored successfully',
      exercise
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Failed to restore exercise'
    });
  }
}


/// @desc    Update an existing exercise
// @route   PUT /api/admin/exercises/:id
// @access  Private (Admin only)
exports.updateExercise = async (req, res) => {
  const { id } = req.params;
  const { name, caloriesPerMin } = req.body;

  try {
    // Validate input
    if (!name || !caloriesPerMin) {
      return res.status(400).json({
        errorMessage: 'Name and calories per minute are required'
      });
    }

    // Check if exercise exists and is active
    const exercise = await Exercise.findOne({
      _id: id,
      isDeleted: false
    });

    if (!exercise) {
      return res.status(404).json({
        errorMessage: 'Exercise not found or is deleted'
      });
    }

    // Check if new name conflicts with another exercise (active or deleted)
    const existingExercise = await Exercise.findOne({
      _id: { $ne: id }, // Not the same exercise
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingExercise) {
      if (existingExercise.isDeleted) {
        return res.status(409).json({
          errorMessage: 'Exercise with this name exists but is deleted',
          isDeleted: true,
          exerciseId: existingExercise._id
        });
      }
      return res.status(409).json({
        errorMessage: 'Exercise with this name already exists'
      });
    }

    // Update exercise
    exercise.name = name.trim();
    exercise.caloriesPerMin = caloriesPerMin;
    await exercise.save();

    res.status(200).json({
      message: 'Exercise updated successfully',
      exercise
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Failed to update exercise'
    });
  }
}

// @desc    Delete an exercise (soft delete)
// @route   DELETE /api/admin/exercises/:id
// @access  Private (Admin only)
exports.deleteExercise = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if exercise exists
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({ errorMessage: 'Exercise not found' });
    }

    // Soft delete the exercise
    exercise.isDeleted = true;
    await exercise.save();

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ errorMessage: 'Failed to delete exercise' });
  }
}

// @desc    Get all athletes
// @route   GET /api/admin/athletes
// @access  Private (Admin only)
exports.getAllAthletes = async (req, res) => {
  try {
    const athletes = await User.find({ role: 'athlete' }).select('-password').sort({ name: 1 });
    res.status(200).json(athletes);
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error fetching athletes' });
  }
}


// @desc    Get all athletes workout history (Admin only)
// @route   GET /api/admin/workouts
// @access  Private (Admin only)
exports.getWorkoutHistory = async (req, res) => {
  try {
    const workouts = await Workout.find({})
      .populate({
        path: 'athlete',
        select: 'name email' // Include both name and email
      })
      .populate('exercise', 'name') // Include exercise name
      .sort({ date: -1 }); // Newest first

    // Transform the data for better frontend consumption
    const formattedWorkouts = workouts.map(workout => ({
      _id: workout._id,
      exercise: {
        _id: workout.exercise._id,
        name: workout.exercise.name
      },
      athlete: {
        _id: workout.athlete._id,
        name: workout.athlete.name,
        email: workout.athlete.email
      },
      duration: workout.duration,
      calories: workout.calories,
      date: workout.date,
      notes: workout.notes,
      createdAt: workout.createdAt
    }));

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: formattedWorkouts
    });

  } catch (error) {
    console.error('Admin workout history error:', error);
    res.status(500).json({
      success: false,
      errorMessage: 'Error fetching all workouts history',
      error: error.message
    });
  }
};

// @desc    Delete a workout (Admin only)
// @route   DELETE /api/admin/workouts/:id
// @access  Private (Admin only)
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ errorMessage: 'Workout not found' });
    }
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error deleting workout' });
  }
}

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
// Same timeframe helper as athlete controller
const getStartOf = (unit) => {
  return {
    today: () => new Date(new Date().setHours(0, 0, 0, 0)),
    week: () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(now.setDate(diff)).setHours(0, 0, 0, 0);
    },
    month: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    year: () => new Date(new Date().getFullYear(), 0, 1),
    all: () => new Date('1970-01-01')
  }[unit]();
};

const timeframes = ['today', 'week', 'month', 'year', 'all'];

// @desc    Get admin dashboard stats (athlete stats + workout stats)
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const results = {};

    for (const timeframe of timeframes) {
      const start = getStartOf(timeframe);

      // 1. Athlete Join Stats (NEW ADDITION)
      const newAthletes = await User.countDocuments({
        role: 'athlete',
        createdAt: { $gte: start }
      });

      // 2. Workout Stats (Same as athlete controller but for all users)
      const workouts = await Workout.find({
        date: { $gte: start }
      }).populate('exercise').populate('athlete', 'name email');

      let topCalorieWorkout = null;
      let mostTimeExerciseMap = {};
      let totalCalories = 0;
      let totalDuration = 0;
      let exerciseTimeMap = {};

      workouts.forEach((workout) => {
        const { calories, duration, exercise } = workout;

        if (!topCalorieWorkout || calories > topCalorieWorkout.calories) {
          topCalorieWorkout = workout;
        }

        const exerciseName = exercise.name;
        mostTimeExerciseMap[exerciseName] = (mostTimeExerciseMap[exerciseName] || 0) + duration;
        exerciseTimeMap[exerciseName] = (exerciseTimeMap[exerciseName] || 0) + duration;

        totalCalories += calories;
        totalDuration += duration;
      });

      const mostTimeSpentExercise = Object.keys(mostTimeExerciseMap).reduce((a, b) =>
        mostTimeExerciseMap[a] > mostTimeExerciseMap[b] ? a : b, null);

      const exerciseBreakdown = Object.entries(exerciseTimeMap).map(([name, time]) => ({
        name,
        percentage: totalDuration > 0 ? ((time / totalDuration) * 100).toFixed(2) : 0,
        totalDuration: time
      }));

      // Combined response (workout stats + athlete stats)
      results[timeframe] = {
        // Workout stats (same as athlete controller)
        topCalorieWorkout,
        mostTimeSpentExercise,
        totalCalories,
        totalDuration,
        exerciseBreakdown,

        // New athlete stats
        newAthletes, // Number of athletes joined in this timeframe
        totalAthletes: timeframe === 'all'
          ? await User.countDocuments({ role: 'athlete' })
          : undefined // Only include all-time count in 'all' timeframe
      };
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: 'Failed to fetch admin dashboard stats' });
  }
};