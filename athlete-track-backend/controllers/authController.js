const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// @desc    Login user (admin or athlete)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errorMessage: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ errorMessage: 'Invalid credentials' });
    }

    // 3. Generate and send token
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ errorMessage: err.message });
  }
};

// @desc    Register a new athlete
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { email, password, name, height, weight } = req.body;

  try {
    // 1. Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errorMessage: 'this email already exists' });
    }


    // 2. Create user (role defaults to 'athlete' per model)
    const user = await User.create({
      email, password, name, height, weight
    });

    // 3. Generate token for auto-login after registration
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name
      }
    });

  } catch (err) {
    res.status(500).json({ errorMessage: 'Registration failed' + err });
  }
};


// @desc    update admin/athlete profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const { email, currentPassword, newPassword, name, height, weight } = req.body;

  try {
    let user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ errorMessage: 'User not found' });

    if (email) {
      // 1. Check if email exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.userId.toString()) {
        return res.status(400).json({ errorMessage: 'email already taken' });
      }
      //2. add it to user obj save later
      user.email = email
    }

    if (currentPassword && newPassword) {
      // 1. Check if current password is correct
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ errorMessage: 'Invalid current password' });
      }
      // 2. add new password to user obj and save later
      user.password = newPassword;
    }

    if (name) {
      user.name = name;
    }

    // update height and weight only for user with role 'athlete'
    if (user.role === 'athlete') {
      if (height) {
        user.height = height;
      }
      if (weight) {
        user.weight = weight;
      }
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ errorMessage: 'Profile updation failed' + err });
  }
};