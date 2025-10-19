const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Event code is required'],
    unique: true,
    trim: true,
    minlength: [8, 'Event code must be at least 8 characters'],
    maxlength: [8, 'Event code must be exactly 8 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['Food Donation', 'Tree Planting', 'Cleaning'],
      message: 'Invalid category. Must be one of: Food Donation, Tree Planting, Cleaning'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries on code
eventSchema.index({ code: 1 });

module.exports = mongoose.model('Event', eventSchema);