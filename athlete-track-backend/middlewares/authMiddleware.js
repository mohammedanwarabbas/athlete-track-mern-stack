// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ errorMessage: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    // console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    res.status(400).json({ errorMessage: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ errorMessage: "Admin access required" });
  }
  next();
};

exports.isAthlete = (req, res, next) => {
  if (req.user.role !== 'athlete') {
    return res.status(403).json({ errorMessage: "Athlete access required" });
  }
  next();
};