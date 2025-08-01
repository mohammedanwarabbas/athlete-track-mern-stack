// Use: [node scripts/seedExercises.js] (run manually once) or [npm run seed:exercises]
require('dotenv').config();
const Exercise = require('../models/Exercise');
const connectDB = require('../config/db');

// Default exercises if not in .env
const DEFAULT_EXERCISES = [
  {
    name: 'Running (6 mph)',
    caloriesPerMin: 10
  },
  {
    name: 'Cycling (moderate)',
    caloriesPerMin: 8
  },
  {
    name: 'Swimming (freestyle)',
    caloriesPerMin: 12
  },
  {
    name: 'Weight Training',
    caloriesPerMin: 5
  },
  {
    name: 'Jump Rope',
    caloriesPerMin: 15
  }
];

connectDB().then(async () => {
  try {
    // 1. Get exercises from .env or use defaults
    const exercisesToSeed = process.env.EXERCISE_DATA
      ? JSON.parse(process.env.EXERCISE_DATA)
      : DEFAULT_EXERCISES;

    // 2. Clear existing exercises (optional)
    await Exercise.deleteMany({});
    console.log('♻️ Cleared existing exercises');

    // 3. Insert new exercises
    await Exercise.insertMany(exercisesToSeed);

    const count = await Exercise.countDocuments();
    console.log(`✅ Successfully seeded ${count} exercises:`);
    console.log(await Exercise.find().select('name caloriesPerMin -_id'));

  } catch (err) {
    console.error('❌ Exercise seed failed:', err.message);
  } finally {
    process.exit();
  }
});