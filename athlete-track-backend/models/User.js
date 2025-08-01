const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'], // or required: true
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    // select: false // Never return password in queries
  },
  role: {
    type: String,
    enum: ['admin', 'athlete'],
    default: 'athlete'
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    maxlength: 25,
  },
  height: {
    //only for athletes
    type: Number,
    // min: 100, 
    // max: 250, 
  },
  weight: {
    //only for athletes
    type: Number,
    // min: 30, 
    // max: 300, 
  },
},
  { timestamps: true });
// Add timestamps for createdAt and updatedAt fields

// Password hashing before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method for password verification
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);