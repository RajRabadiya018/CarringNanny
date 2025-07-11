const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    console.log('Auth middleware: No authorization header provided');
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Format should be 'Bearer token'
  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Auth middleware: Invalid authorization format');
    return res.status(401).json({ error: 'Invalid authorization format. Format should be "Bearer token"' });
  }
  
  const token = parts[1];

  try {
    // Verify token
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Token verified for user:', _id);

    // Find user and attach to request - include more data for admin routes
    const user = await User.findOne({ _id }).select('_id role name email');
    
    if (!user) {
      console.log('Auth middleware: User not found for ID:', _id);
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }
    
    req.user = user;
    console.log('Auth middleware: User authenticated as:', user.role);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
