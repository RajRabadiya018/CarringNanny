const express = require('express');
const { 
  getAllUsers, 
  deleteUser, 
  getAllNannies, 
  deleteNanny,
  getAllBookings,
  getAdminStats
} = require('../controllers/adminController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// All admin routes are protected
router.use(requireAuth);
router.use(requireAdmin);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Nanny management
router.get('/nannies', getAllNannies);
router.delete('/nannies/:id', deleteNanny);

// Booking management
router.get('/bookings', getAllBookings);

// Dashboard stats
router.get('/stats', getAdminStats);

module.exports = router; 