const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
});

// Index for payment verification lookups
BookingSchema.index({ razorpayOrderId: 1 });

// Prevent duplicate pending bookings for the same user-event pair
BookingSchema.index({ event: 1, user: 1, status: 1 }, {
  unique: true,
  partialFilterExpression: { status: 'pending' }
});

module.exports = mongoose.model('Booking', BookingSchema);
