const mongoose = require('mongoose');
const { KERALA_DISTRICTS } = require('../utils/constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    district: {
      type: String,
      required: [true, 'Please select a district'],
      enum: {
        values: KERALA_DISTRICTS,
        message: 'Please select a valid Kerala district',
      },
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    image: {
      type: String,
      default: 'no-image.jpg',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'finished'],
      default: 'pending',
    },
    latitude: {
      type: Number,
      required: false, // Optional for now
    },
    longitude: {
      type: Number,
      required: false, // Optional for now
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Temple Festivals', 'Sacred Rituals', 'Art Forms', 'Heritage Sites', 'Other'],
      default: 'Temple Festivals'
    },
    price: {
      type: Number,
      default: 0,
    },
    bookingLink: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Optional
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please provide a valid URL for the booking link'
      }
    },
    organizer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false, // Optional for legacy events
    },
    isSponsored: {
      type: Boolean,
      default: false,
    },
    analytics: {
        views: { type: Number, default: 0 },
        wishlists: { type: Number, default: 0 }
    },
    chatEnabled: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Soft duplicate check is done in the controller (not a DB unique constraint)
// because recurring annual festivals (e.g., Thrissur Pooram) have same name/district/approx date each year.
// A unique index would permanently block them after Year 1.


// Compound index for common query pattern (active approved events)
eventSchema.index({ status: 1, date: 1 });


// [REDACTED SEARCH] - Full-text search index for high-performance fuzzy matching
eventSchema.index({ 
    title: 'text', 
    description: 'text', 
    district: 'text',
    category: 'text' 
}, {
    weights: {
        title: 10,
        category: 5,
        district: 3,
        description: 1
    },
    name: 'EventSearchIndex'
});

// Virtual for auto-identifying expired events without DB storage
eventSchema.virtual('isExpired').get(function() {
  return this.date < new Date();
});

module.exports = mongoose.model('Event', eventSchema);

