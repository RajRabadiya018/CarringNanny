const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('../models/bookingModel');
const Nanny = require('../models/nannyModel');

// Function to fix zero prices
async function fixZeroPrices() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Find all bookings with zero or null price
    const zeroBookings = await Booking.find({
      $or: [
        { totalPrice: 0 },
        { totalPrice: null },
        { totalPrice: { $exists: false } }
      ]
    });
    
    console.log(`Found ${zeroBookings.length} bookings with zero/null price`);
    
    let updatedCount = 0;
    
    // Update each booking
    for (const booking of zeroBookings) {
      try {
        // Find the associated nanny to get hourly rate
        const nanny = await Nanny.findById(booking.nannyId);
        
        if (!nanny) {
          console.log(`Nanny not found for booking ${booking._id}, skipping`);
          continue;
        }
        
        const hourlyRate = parseFloat(nanny.hourlyRate) || 30; // Default to 30 if not set
        
        // Calculate duration
        const startMs = booking.startTime.getTime();
        const endMs = booking.endTime.getTime();
        const durationHours = (endMs - startMs) / (1000 * 60 * 60);
        
        // Calculate number of days
        const days = booking.numberOfDays || 1;
        
        // Calculate price
        let price = hourlyRate * durationHours * days;
        
        // Apply discount for full-time
        if (booking.serviceType === 'full-time') {
          price = price * 0.95;
        }
        
        // Format price
        const formattedPrice = parseFloat(price.toFixed(2));
        
        // Ensure we never use 0
        const finalPrice = formattedPrice > 0 ? formattedPrice : hourlyRate;
        
        // Update the booking
        await Booking.updateOne(
          { _id: booking._id },
          { $set: { totalPrice: finalPrice } }
        );
        
        console.log(`Updated booking ${booking._id} price to ₹${finalPrice} (${hourlyRate}/hr * ${durationHours}hrs * ${days} days)`);
        updatedCount++;
      } catch (err) {
        console.error(`Error updating booking ${booking._id}:`, err);
      }
    }
    
    console.log(`Updated ${updatedCount} out of ${zeroBookings.length} bookings`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
fixZeroPrices(); 