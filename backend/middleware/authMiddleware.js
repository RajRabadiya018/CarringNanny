const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Verify token
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findOne({ _id }).select('_id name email role');
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

// Middleware to check if user is a nanny
const requireNanny = (req, res, next) => {
  if (!req.user || req.user.role !== 'nanny') {
    return res.status(403).json({ error: 'Access denied. Nanny role required.' });
  }
  next();
};

// Middleware to check if user is a parent
const requireParent = (req, res, next) => {
  if (!req.user || req.user.role !== 'parent') {
    return res.status(403).json({ error: 'Access denied. Parent role required.' });
  }
  next();
};

// Middleware to check if user is an admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

module.exports = { requireAuth, requireNanny, requireParent, requireAdmin };
