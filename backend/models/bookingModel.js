const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nannyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nanny',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  serviceType: {
    type: String,
    enum: ['part-time', 'full-time'],
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  specialRequests: {
    type: String
  },
  numberOfChildren: {
    type: Number,
    required: true,
    min: 1
  },
  childrenAges: [{
    type: Number,
    min: 0
  }],
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  nannyMessage: {
    type: String
  },
  parentReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: Date
  }
}, {
  timestamps: true
});

// Calculate booking duration and total price before saving
bookingSchema.pre('save', async function(next) {
  try {
    // Only recalculate price if start time, end time, or number of days has changed
    // or if this is a new booking being created
    // Skip recalculation if we're just updating status or messages
    if (this.isNew || 
        (this.isModified('startTime') || 
         this.isModified('endTime') || 
         this.isModified('numberOfDays'))) {
      
      // Calculate duration in hours
      const durationMs = this.endTime - this.startTime;
      const durationHours = durationMs / (1000 * 60 * 60);
      
      // Get nanny's hourly rate
      const Nanny = mongoose.model('Nanny');
      const nanny = await Nanny.findById(this.nannyId);
      
      if (!nanny) {
        throw new Error('Nanny not found');
      }
      
      // Calculate total price considering number of days
      const days = this.numberOfDays || 1;
      this.totalPrice = nanny.hourlyRate * durationHours * days;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
