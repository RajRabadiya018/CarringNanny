const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const nannySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  skills: [{
    type: String
  }],
  languages: [{
    type: String
  }],
  education: {
    type: String
  },
  certifications: [{
    name: String,
    issuedBy: String,
    year: Number
  }],
  availability: [availabilitySchema],
  reviews: [reviewSchema],
  gallery: [{
    type: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  specialNeeds: {
    type: Boolean,
    default: false
  },
  ageGroupsServed: [{
    type: String,
    enum: ['Infant (0-1)', 'Toddler (1-3)', 'Preschool (3-5)', 'School-age (5-12)', 'Teenager (13-18)']
  }],
  servicesOffered: [{
    type: String,
    enum: ['Babysitting', 'Full-time care', 'Part-time care', 'Overnight care', 'Homework help', 'Cooking', 'Light housekeeping', 'Transportation', 'School pickup/dropoff', 'Weekend care']
  }],
  phoneNumber: {
    type: String
  },
  location: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate average rating when a review is added or modified
nannySchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Nanny', nannySchema);
