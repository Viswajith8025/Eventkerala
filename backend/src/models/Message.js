const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: false,
    },
    room: {
      type: String, // 'support' or 'event_id'
      default: 'global'
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    senderName: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

// Compound index for chat history lookups (event-based and user-based segregation)
messageSchema.index({ event: 1, sender: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
