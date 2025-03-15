const Booking = require('../models/bookingModel');
const Nanny = require('../models/nannyModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Get all bookings for a parent
const getParentBookings = async (req, res) => {
  try {
    // Check if user is a parent
    const user = await User.findById(req.user._id);
    if (user.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can access this resource' });
    }

    // Find all bookings for this parent
    const bookings = await Booking.find({ parentId: req.user._id })
      .populate({
        path: 'nannyId',
        populate: {
          path: 'userId',
          select: 'name email phone profileImage'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all bookings for a nanny
const getNannyBookings = async (req, res) => {
  try {
    // Find the nanny profile for this user
    const nanny = await Nanny.findOne({ userId: req.user._id });
    if (!nanny) {
      return res.status(404).json({ error: 'Nanny profile not found' });
    }

    // Find all bookings for this nanny
    const bookings = await Booking.find({ nannyId: nanny._id })
      .populate({
        path: 'parentId',
        select: 'name email phone profileImage'
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such booking' });
    }

    const booking = await Booking.findById(id)
      .populate({
        path: 'nannyId',
        populate: {
          path: 'userId',
          select: 'name email phone profileImage'
        }
      })
      .populate('parentId', 'name email phone profileImage');

    if (!booking) {
      return res.status(404).json({ error: 'No such booking' });
    }

    // Verify that the requesting user is either the parent or the nanny
    const nanny = await Nanny.findById(booking.nannyId);
    if (
      booking.parentId._id.toString() !== req.user._id.toString() &&
      nanny.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Verify user is a parent
    const user = await User.findById(req.user._id);
    if (user.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can create bookings' });
    }

    const {
      nannyId,
      startTime,
      endTime,
      numberOfDays,
      numberOfChildren,
      childrenAges,
      specialRequests,
      serviceType,
      location
    } = req.body;

    // Validate required fields
    if (!nannyId || !startTime || !endTime || !numberOfChildren || !childrenAges || !location || !serviceType) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Validate nannyId
    if (!mongoose.Types.ObjectId.isValid(nannyId)) {
      return res.status(400).json({ error: 'Invalid nanny ID' });
    }

    // Validate service type
    if (serviceType !== 'part-time' && serviceType !== 'full-time') {
      return res.status(400).json({ error: 'Service type must be either part-time or full-time' });
    }

    // Check if nanny exists
    const nanny = await Nanny.findById(nannyId);
    if (!nanny) {
      return res.status(404).json({ error: 'Nanny not found' });
    }

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    if (start < new Date()) {
      return res.status(400).json({ error: 'Start time cannot be in the past' });
    }

    // Calculate duration in hours
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);

    // Get number of days (default to 1 if not provided)
    const days = numberOfDays || 1;

    // Calculate total price accounting for multiple days
    const totalPrice = nanny.hourlyRate * durationHours * days;

    // Create the booking
    const booking = await Booking.create({
      parentId: req.user._id,
      nannyId,
      startTime: start,
      endTime: end,
      status: 'pending',
      totalPrice,
      numberOfChildren,
      childrenAges,
      specialRequests,
      serviceType,
      numberOfDays: days,
      location
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel a booking (parent only)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such booking' });
    }

    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'No such booking' });
    }

    // Verify that the requesting user is the parent
    if (booking.parentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ error: `Cannot cancel a booking with status: ${booking.status}` });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Confirm a booking (nanny only)
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    console.log('Confirm booking request:', { id, message, userId: req.user._id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such booking - invalid ID format' });
    }

    // Find the booking without using Mongoose
    const db = mongoose.connection.db;
    const bookingsCollection = db.collection('bookings');
    
    // First find the booking directly using MongoDB driver
    const booking = await bookingsCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!booking) {
      return res.status(404).json({ error: 'No such booking found' });
    }

    console.log('Found booking:', JSON.stringify(booking));

    // Find nanny manually
    const nanniesCollection = db.collection('nannies');
    const nanny = await nanniesCollection.findOne({ _id: new mongoose.Types.ObjectId(booking.nannyId) });

    if (!nanny) {
      return res.status(404).json({ error: 'Nanny not found' });
    }

    console.log('Found nanny:', JSON.stringify(nanny));

    // Verify that the requesting user is the nanny
    if (!nanny.userId || nanny.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to confirm this booking' });
    }

    // Check if booking can be confirmed
    if (booking.status !== 'pending') {
      return res.status(400).json({ error: `Cannot confirm a booking with status: ${booking.status}` });
    }

    // Update using raw MongoDB operations to completely bypass Mongoose
    const result = await bookingsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { 
        $set: { 
          status: 'confirmed',
          nannyMessage: message || ''
        } 
      }
    );

    console.log('Direct MongoDB update result:', result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update booking' });
    }

    // Fetch the updated booking
    const updatedBooking = await bookingsCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
    console.log('Booking confirmed successfully:', updatedBooking);
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error in confirmBooking controller:', error);
    res.status(400).json({ error: error.message });
  }
};

// Decline a booking (nanny only)
const declineBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    console.log('Decline booking request:', { id, message, userId: req.user._id });

    if (!message) {
      return res.status(400).json({ error: 'Please provide a reason for declining' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such booking' });
    }

    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'No such booking' });
    }

    console.log('Found booking:', JSON.stringify(booking));

    // Find nanny
    const nanny = await Nanny.findById(booking.nannyId);

    if (!nanny) {
      return res.status(404).json({ error: 'Nanny not found' });
    }

    // Verify that the requesting user is the nanny
    if (!nanny.userId || nanny.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to decline this booking' });
    }

    // Check if booking can be declined
    if (booking.status !== 'pending') {
      return res.status(400).json({ error: `Cannot decline a booking with status: ${booking.status}` });
    }

    // BYPASS the save() method and use updateOne directly
    // This avoids triggering any middleware or validation issues
    const result = await Booking.updateOne(
      { _id: id },
      { 
        $set: { 
          status: 'cancelled',
          cancellationReason: message
        } 
      }
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update booking' });
    }

    // Fetch the updated booking
    const updatedBooking = await Booking.findById(id);
    console.log('Booking declined successfully:', updatedBooking);
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error in declineBooking controller:', error);
    res.status(400).json({ error: error.message });
  }
};

// Mark booking as completed (nanny only)
const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { completionNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such booking' });
    }

    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'No such booking' });
    }

    // Find nanny
    const nanny = await Nanny.findById(booking.nannyId);

    // Verify that the requesting user is the nanny
    if (nanny.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to complete this booking' });
    }

    // Check if booking can be completed
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ error: `Cannot mark as completed a booking with status: ${booking.status}` });
    }

    // Update booking status
    booking.status = 'completed';
    booking.completionNotes = completionNotes;
    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Direct booking acceptance - simplified (nanny only)
const directAcceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    console.log('Direct accept booking request:', { id, message, userId: req.user._id });

    // Skip validation and directly update the booking
    const result = await mongoose.connection.db.collection('bookings').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { 
        $set: { 
          status: 'confirmed',
          nannyMessage: message || ''
        } 
      }
    );

    console.log('Direct accept result:', result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update booking' });
    }

    // Return success without fetching the updated booking
    res.status(200).json({ success: true, message: "Booking accepted successfully" });
  } catch (error) {
    console.error('Error in directAcceptBooking:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getParentBookings,
  getNannyBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  confirmBooking,
  declineBooking,
  completeBooking,
  directAcceptBooking
};
