const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const mongoose = require('mongoose');

// @desc    Log a new workout
// @route   POST /api/athlete/workouts
// @access  Private (Athlete only)
exports.logWorkout = async (req, res) => {
  try {
    const { exercise, duration, date, notes } = req.body;
    const workout = await Workout.create({
      athlete: req.user.userId,
      exercise,
      duration,
      date: date || new Date(),
      notes: notes || undefined,//notes is optional
    });

    // to send the populated workout with exercise name instead exercise id
    const populatedWorkout = await Workout.findById(workout._id)
      .populate('exercise', 'name');
    console.log('Logged workout:', populatedWorkout);
    res.status(201).json({ message: "workout logged in successfully", workout: populatedWorkout });
  } catch (error) {
    res.status(400).json({ errorMessage: "Error logging workout" });
  }
};

// @desc    Get workout history
// @route   GET /api/athlete/workouts
// @access  Private (Athlete only)
exports.getWorkoutHistory = async (req, res) => {
  try {
    const workouts = await Workout.find({ athlete: req.user.userId })
      .populate('exercise', 'name') // Populate exercise name. only the name field from Exercise model
      .sort({ date: -1 }); // Newest first

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error fetching workout history' });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/athlete/workouts/:id
// @access  Private (Athlete only)
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

// @desc    Update a workout
// @route   PUT /api/athlete/workouts/:id
// @access  Private (Athlete only)
exports.updateWorkout = async (req, res) => {
  const { exercise, duration, date, notes } = req.body;
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ errorMessage: 'Workout not found' });
    }

    // Only allow updating fields that are provided
    if (exercise) workout.exercise = exercise;
    if (duration) workout.duration = duration;
    if (notes) workout.notes = notes;
    if (date) workout.date = new Date(date);

    await workout.save();
    // to send the populated workout with exercise name instead exercise id
    const populatedWorkout = await Workout.findById(workout._id)
      .populate('exercise', 'name');
    res.status(200).json({ message: 'Workout updated successfully', workout: populatedWorkout });
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error updating workout' + error.message });
  }
}

// @desc    Get available exercises
// @route   GET /api/athlete/exercises
// @access  Private (Athlete only)
exports.getExerciseList = async (req, res) => {
  try {
    const exercises = await Exercise.find({ isDeleted: { $ne: true } })
      .select('name _id caloriesPerMin') // Include caloriesPerMin if needed for frontend
      .sort({ name: 1 }); // Sort alphabetically by name
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ errorMessage: 'Error fetching exercise list' });
  }
}

// @desc    Get dashboard statistics (itshoud returns the json with below details so taht we can use it in frotnned for chart/pie or any tother visualization1)top one exerces that burned more callory(this should show that one workout recrod containing all field where high callories burned)(today,this week, this month,this year,sofar)2)most time spent exercise (today,this wee,month,year,sofar)2)exercises visuzliation data(all the exercises should come with percentage, like running 80% , walikng 10%,cycling 10%) this shouold be of 5 categoris:today,this week,this month,this year,so far(how u caluclate percentage?? based on time or calories?? i think time right)3)calories burned(today,this week, this month,this year,sofar/lifetime)4)todal duration(today,this week,this month,this year,sofar)
// @route   GET /api/athlete/dashboard-stats
// @access  Private (Athlete only)
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

exports.getDashboardStats = async (req, res) => {
  try {
    const athleteId = req.user.userId;
    const results = {};

    for (const timeframe of timeframes) {
      const start = getStartOf(timeframe);

      const workouts = await Workout.find({
        athlete: athleteId,
        date: { $gte: start },
      }).populate('exercise');

      let topCalorieWorkout = null;
      let mostTimeExerciseMap = {};
      let totalCalories = 0;
      let totalDuration = 0;
      let exerciseTimeMap = {}; // { "Running": 90, "Cycling": 30 }

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
        percentage: ((time / totalDuration) * 100).toFixed(2),
      }));

      results[timeframe] = {
        topCalorieWorkout,
        mostTimeSpentExercise,
        totalCalories,
        totalDuration,
        exerciseBreakdown,
      };
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: 'Failed to fetch dashboard stats' });
  }
};
