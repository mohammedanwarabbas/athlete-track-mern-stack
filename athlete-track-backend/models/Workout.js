const mongoose = require('mongoose');
const Exercise = require('./Exercise');

const workoutSchema = new mongoose.Schema({
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Workout must belong to an athlete']
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: [true, 'Exercise name is required']
  },
  duration: { // in minutes
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Minimum duration is 1 minute'],
    max: [600, 'Maximum duration is 10 hours']
  },
  calories: {
    type: Number,
    required: false// if true, valiedation error comes as we are not sending in request(calories are caluclted in pre-save hook, hooks always run after validation)
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes exceed 200 characters']
  }
}, { timestamps: true }); // Adds createdAt, updatedAt

// ======================
// MIDDLEWARE (HOOKS)
// ======================

// Auto-calculate calories before saving
workoutSchema.pre('save', async function (next) {
  if (!this.isModified('exercise')) return next(); // Only recalculate if exercise field is modified or new ecntry otherwise next

  // Fetch the exercise's caloriesPerMin rate
  const exercise = await Exercise.findById(this.exercise)
    .select('caloriesPerMin');

  if (!exercise) {
    throw new Error(`Exercise '${this.exercise}' not found in database`);
  }

  this.calories = exercise.caloriesPerMin * this.duration;
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);