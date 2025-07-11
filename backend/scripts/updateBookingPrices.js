const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('../models/bookingModel');
const Nanny = require('../models/nannyModel');

// Function to update all booking prices
async function updateAllBookingPrices() {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Find all bookings
    const allBookings = await Booking.find({});
    
    console.log(`Found ${allBookings.length} total bookings to process`);
    
    let updatedCount = 0;
    
    // Update each booking
    for (const booking of allBookings) {
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
        
        // Format price to 2 decimal places
        const formattedPrice = Math.round(price * 100) / 100;
        
        // Ensure we have a positive price
        const finalPrice = formattedPrice > 0 ? formattedPrice : hourlyRate;
        
        console.log(`Booking ${booking._id}:`);
        console.log(`- Current price: ₹${booking.totalPrice || 0}`);
        console.log(`- Calculated price: ₹${finalPrice} (${hourlyRate}/hr × ${durationHours}hrs × ${days} days)`);
        
        // Skip update if price is already correct (within 1 cent)
        if (Math.abs((booking.totalPrice || 0) - finalPrice) < 0.01) {
          console.log('- Price is already correct, skipping');
          continue;
        }
        
        // Update the booking
        await Booking.updateOne(
          { _id: booking._id },
          { $set: { totalPrice: finalPrice } }
        );
        
        console.log(`- Updated price to ₹${finalPrice}`);
        updatedCount++;
      } catch (err) {
        console.error(`Error updating booking ${booking._id}:`, err);
      }
    }
    
    console.log(`\nSummary: Updated ${updatedCount} out of ${allBookings.length} bookings`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
updateAllBookingPrices(); 