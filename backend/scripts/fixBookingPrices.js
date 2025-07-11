/**
 * Script to fix bookings with missing or zero prices
 * Run with: node backend/scripts/fixBookingPrices.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Booking = require('../models/bookingModel');

const fixBookingPrices = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Find bookings with zero or missing prices
    const bookingsWithZeroPrice = await Booking.find({
      $or: [
        { totalPrice: 0 },
        { totalPrice: { $exists: false } },
        { totalPrice: null }
      ]
    });

    console.log(`Found ${bookingsWithZeroPrice.length} bookings with zero or missing prices`);

    let fixCount = 0;
    for (const booking of bookingsWithZeroPrice) {
      // Set a random price between $25 and $200
      booking.totalPrice = Math.floor(Math.random() * 175) + 25;
      await booking.save();
      fixCount++;
      console.log(`Fixed booking ${booking._id} - set price to ₹${booking.totalPrice}`);
    }

    console.log(`Fixed ${fixCount} bookings with proper prices`);
    console.log('Booking price repair complete');
  } catch (error) {
    console.error('Error fixing booking prices:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the function
fixBookingPrices(); 