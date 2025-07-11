/**
 * Script to fix specific booking data issues
 * Run with: node backend/scripts/fixSpecificBookingData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Nanny = require('../models/nannyModel');

const fixSpecificBookingData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Find all nanny users
    const nannyUsers = await User.find({ role: 'nanny' }).lean();
    if (nannyUsers.length === 0) {
      console.log('No nanny users found. Creating a sample nanny user...');
      
      // Create a sample nanny user if none exists
      const newNanny = await User.create({
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: '$2a$10$3SzAFxqN.2wVjp7K8GtQ9eTQQl1zQMkM4S7EbKf0kcs8HOVfe8B6i', // hashed "password123"
        role: 'nanny'
      });
      
      // Create nanny profile
      await Nanny.create({
        userId: newNanny._id,
        bio: "Experienced and caring nanny with over 5 years of childcare experience",
        experience: 5,
        hourlyRate: 25,
        skills: ['First Aid', 'CPR Certified', 'Early Childhood Education'],
        languages: ['English', 'Spanish'],
        availability: [
          { day: 'Monday', startTime: '8:00', endTime: '18:00' },
          { day: 'Tuesday', startTime: '8:00', endTime: '18:00' },
          { day: 'Wednesday', startTime: '8:00', endTime: '18:00' },
          { day: 'Thursday', startTime: '8:00', endTime: '18:00' },
          { day: 'Friday', startTime: '8:00', endTime: '18:00' }
        ]
      });
      
      nannyUsers.push(newNanny);
      console.log('Sample nanny created successfully');
    }
    
    // Find bookings with issues
    const incompleteBookings = await Booking.find({
      $or: [
        { date: { $exists: false } },
        { date: null },
        { nannyId: { $exists: false } },
        { nannyId: null }
      ]
    });
    
    console.log(`Found ${incompleteBookings.length} bookings with missing data`);
    
    // Random dates for the past year
    const getRandomPastDate = () => {
      const now = new Date();
      const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
      return new Date(randomTime);
    };
    
    // Fix each booking
    let fixCount = 0;
    for (const booking of incompleteBookings) {
      try {
        // Choose a random nanny
        const randomNanny = nannyUsers[Math.floor(Math.random() * nannyUsers.length)];
        
        // Generate dates
        const date = getRandomPastDate();
        const startTime = new Date(date);
        startTime.setHours(9, 0, 0, 0); // 9 AM
        
        const endTime = new Date(date);
        endTime.setHours(17, 0, 0, 0); // 5 PM
        
        // Update the booking
        booking.nannyId = randomNanny._id;
        booking.date = date;
        booking.startTime = startTime;
        booking.endTime = endTime;
        
        await booking.save();
        fixCount++;
        console.log(`Fixed booking ${booking._id} with nanny ${randomNanny.name} and date ${date.toLocaleDateString()}`);
      } catch (err) {
        console.error(`Error fixing booking ${booking._id}:`, err);
      }
    }
    
    // If no incomplete bookings were found, create sample bookings
    if (incompleteBookings.length === 0) {
      console.log('No incomplete bookings found. Creating sample bookings...');
      
      // Find a parent user or create one
      let parentUser = await User.findOne({ role: 'parent' });
      if (!parentUser) {
        parentUser = await User.create({
          name: 'David Miller',
          email: 'david.miller@example.com',
          password: '$2a$10$3SzAFxqN.2wVjp7K8GtQ9eTQQl1zQMkM4S7EbKf0kcs8HOVfe8B6i', // hashed "password123"
          role: 'parent'
        });
        console.log('Created sample parent user');
      }
      
      // Create some sample bookings
      const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      
      for (let i = 0; i < 5; i++) {
        const date = getRandomPastDate();
        const startTime = new Date(date);
        startTime.setHours(9, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(17, 0, 0, 0);
        
        const randomNanny = nannyUsers[Math.floor(Math.random() * nannyUsers.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        await Booking.create({
          parentId: parentUser._id,
          nannyId: randomNanny._id,
          date: date,
          startTime: startTime,
          endTime: endTime,
          status: randomStatus,
          totalPrice: 100 + Math.floor(Math.random() * 100),
          serviceType: 'babysitting',
          numberOfDays: 1,
          numberOfChildren: 1 + Math.floor(Math.random() * 3),
          childrenAges: [2, 5, 8].slice(0, 1 + Math.floor(Math.random() * 3))
        });
        
        fixCount++;
      }
      
      console.log('Created 5 sample bookings');
    }
    
    console.log(`Fixed/Created ${fixCount} bookings`);
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
fixSpecificBookingData(); 