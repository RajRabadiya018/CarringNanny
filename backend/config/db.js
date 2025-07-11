const mongoose = require('mongoose');
const User = require('../models/userModel');

const connectDB = async () => {
  try {
    // Add options to avoid deprecation warnings
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      await User.signup(
        'Admin User',
        process.env.ADMIN_EMAIL,
        process.env.ADMIN_PASSWORD,
        'admin'
      );
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
