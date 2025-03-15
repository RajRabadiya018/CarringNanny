const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const nannyRoutes = require('./routes/nannyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nannies', nannyRoutes);
app.use('/api/bookings', bookingRoutes);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Listen for requests
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
