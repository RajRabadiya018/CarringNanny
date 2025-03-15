const express = require('express');
const bookingController = require('../controllers/bookingController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// All booking routes require authentication
router.use(requireAuth);

// Parent routes
router.get('/parent', bookingController.getParentBookings);

// Nanny routes
router.get('/nanny', bookingController.getNannyBookings);

// Common routes
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/cancel', bookingController.cancelBooking);
router.put('/:id/confirm', bookingController.confirmBooking);
router.put('/:id/decline', bookingController.declineBooking);
router.put('/:id/complete', bookingController.completeBooking);

// Direct booking acceptance route (bypasses validation completely)
router.put('/:id/direct-accept', bookingController.directAcceptBooking);

module.exports = router;
