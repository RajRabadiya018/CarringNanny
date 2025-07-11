/**
 * Script to fix booking data issues
 * Run with: node backend/scripts/fixBookingData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

const fixBookingData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Find all bookings
    const bookings = await Booking.find({}).lean();
    console.log(`Found ${bookings.length} bookings to check`);

    let fixCount = 0;

    // Process each booking
    for (const booking of bookings) {
      let needsUpdate = false;
      const updateData = {};

      // Check for valid date
      if (!booking.date || !(booking.date instanceof Date) || isNaN(booking.date.getTime())) {
        updateData.date = new Date();
        needsUpdate = true;
        console.log(`Fixing invalid date for booking ${booking._id}`);
      }

      // Check parent reference
      if (!booking.parentId) {
        // Find a parent user to assign
        const parentUser = await User.findOne({ role: 'parent' });
        if (parentUser) {
          updateData.parentId = parentUser._id;
          needsUpdate = true;
          console.log(`Fixing missing parentId for booking ${booking._id}`);
        }
      }

      // Check nanny reference
      if (!booking.nannyId) {
        // Find a nanny user to assign
        const nannyUser = await User.findOne({ role: 'nanny' });
        if (nannyUser) {
          updateData.nannyId = nannyUser._id;
          needsUpdate = true;
          console.log(`Fixing missing nannyId for booking ${booking._id}`);
        }
      }

      // Update if needed
      if (needsUpdate) {
        await Booking.findByIdAndUpdate(booking._id, updateData);
        fixCount++;
      }
    }

    console.log(`Fixed ${fixCount} bookings`);
    console.log('Booking data repair complete');
  } catch (error) {
    console.error('Error fixing booking data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the function
fixBookingData(); 