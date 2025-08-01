const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 25,
  },
  caloriesPerMin: {  // Fixed rate per exercise
    type: Number,
    required: true
  },
  isDeleted: { type: Boolean, default: false } // Soft delete flag
});

module.exports = mongoose.model('Exercise', exerciseSchema);