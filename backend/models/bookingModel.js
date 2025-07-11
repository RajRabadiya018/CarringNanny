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
  nannyName: {
    type: String,
    default: 'Nanny'
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: props => `${props.value} is not a valid date!`
    },
    default: Date.now
  },
  startTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: props => `${props.value} is not a valid start time!`
    }
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: props => `${props.value} is not a valid end time!`
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  serviceType: {
    type: String,
    enum: ['part-time', 'full-time', 'babysitting'],
    required: true,
    default: 'babysitting'
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
    min: 1,
    default: 1
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
    // If totalPrice is missing or invalid, we need to calculate it
    if (this.totalPrice === undefined || this.totalPrice === null || isNaN(this.totalPrice) || this.totalPrice === 0) {
      console.log('Pre-save hook: Missing or invalid totalPrice, will calculate');
      
      // Ensure dates are valid before calculating
      if (!(this.startTime instanceof Date) || isNaN(this.startTime) ||
          !(this.endTime instanceof Date) || isNaN(this.endTime)) {
        console.error('Pre-save hook: Invalid dates, cannot calculate price');
        this.totalPrice = 0;
        return next();
      }
      
      // Calculate duration in hours using milliseconds for precision
      const startMs = this.startTime.getTime();
      const endMs = this.endTime.getTime();
      const durationMs = endMs - startMs;
      const durationHours = durationMs / (1000 * 60 * 60);
      
      console.log(`Pre-save hook: Duration calculated: ${durationHours} hours`);
      
      if (durationHours <= 0) {
        console.error('Pre-save hook: Duration is zero or negative');
        this.totalPrice = 0;
        return next();
      }
      
      // Get nanny's hourly rate
      try {
        const Nanny = mongoose.model('Nanny');
        const nanny = await Nanny.findById(this.nannyId);
        
        if (!nanny) {
          console.error('Pre-save hook: Nanny not found');
          this.totalPrice = 0;
          return next();
        }
        
        // Make sure hourlyRate is a valid number
        const hourlyRate = parseFloat(nanny.hourlyRate) || 0;
        
        if (hourlyRate <= 0) {
          console.error(`Pre-save hook: Invalid hourly rate: ${hourlyRate}`);
          this.totalPrice = 0;
          return next();
        }
        
        // Calculate total price considering number of days
        const days = this.numberOfDays || 1;
        
        // Base calculation
        let totalPrice = hourlyRate * durationHours * days;
        
        // Apply any service type adjustments
        if (this.serviceType === 'full-time') {
          totalPrice = totalPrice * 0.95; // 5% discount for full-time
        }
        
        // Round to 2 decimal places
        this.totalPrice = parseFloat(parseFloat(totalPrice).toFixed(2));
        
        console.log(`Pre-save hook: Calculated price: ₹${this.totalPrice} (${hourlyRate}/hr * ${durationHours}hrs * ${days} days)`);
        
        // Final check - if price is still 0 and we have a valid hourly rate, use hourly rate
        if (this.totalPrice === 0 && hourlyRate > 0) {
          console.log(`Pre-save hook: Price was 0, setting to hourly rate: ₹${hourlyRate}`);
          this.totalPrice = hourlyRate;
        }
      } catch (error) {
        console.error('Pre-save hook: Error calculating price:', error);
        // If we have an error and no price, try to set a minimum price
        if (this.totalPrice === 0) {
          try {
            const Nanny = mongoose.model('Nanny');
            const nanny = await Nanny.findById(this.nannyId);
            if (nanny && nanny.hourlyRate) {
              this.totalPrice = parseFloat(nanny.hourlyRate);
              console.log(`Pre-save hook: Set price to hourly rate: ₹${this.totalPrice}`);
            }
          } catch (e) {
            console.error('Pre-save hook: Could not set fallback price:', e);
          }
        }
      }
    } else {
      // Ensure existing price is formatted correctly
      this.totalPrice = parseFloat(parseFloat(this.totalPrice).toFixed(2));
      console.log(`Pre-save hook: Using existing price: ₹${this.totalPrice}`);
    }
    
    next();
  } catch (error) {
    console.error('Booking pre-save error:', error);
    next(error);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
