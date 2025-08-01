// scripts/seedWorkouts.js
// this will create n number of workouts for a specific athlete
// make sure to set ATHLETE_ID before running
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const connectDB = require('../config/db');

// Configuration
const ATHLETE_ID = '68729fc2d3ba0bafc93a8280';
const NUM_WORKOUTS = 10;
const DATE_RANGE = {
  from: new Date('2025-07-01'),
  to: new Date('2025-07-30')
};

// Sample notes
const SAMPLE_NOTES = [
  "Great session!",
  "Felt tired but pushed through",
  "Need to improve stamina",
  "Perfect weather for workout",
  "Tried new technique",
  "Focused on form",
  "Workout with friends",
  "Early morning session",
  null
];

connectDB().then(async () => {
  try {
    // 1. Get all active exercises
    const exercises = await Exercise.find({ isDeleted: false });
    if (!exercises.length) throw new Error('No exercises found');

    // 2. Clear existing workouts (optional)
    await Workout.deleteMany({ athlete: ATHLETE_ID });
    console.log(`♻️ Cleared workouts for athlete ${ATHLETE_ID}`);

    // 3. Generate and insert workouts
    const workoutPromises = Array(NUM_WORKOUTS).fill().map(async () => {
      const exercise = exercises[Math.floor(Math.random() * exercises.length)];
      const duration = faker.number.int({ min: 5, max: 120 });
      const date = faker.date.between(DATE_RANGE);
      const notes = SAMPLE_NOTES[Math.floor(Math.random() * SAMPLE_NOTES.length)];

      return Workout.create({
        athlete: ATHLETE_ID,
        exercise: exercise._id,
        duration,
        date,
        notes
      });
    });

    await Promise.all(workoutPromises);
    console.log(`✅ Created ${NUM_WORKOUTS} workouts`);

    // Show sample
    const sample = await Workout.find({ athlete: ATHLETE_ID })
      .populate('exercise', 'name')
      .sort('-date')
      .limit(3);

    console.log('\nSample workouts:');
    sample.forEach(w => console.log({
      exercise: w.exercise.name,
      duration: `${w.duration} mins`,
      calories: w.calories,
      date: w.date.toDateString(),
      notes: w.notes || 'None'
    }));

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    mongoose.connection.close();
  }
});