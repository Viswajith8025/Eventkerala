const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please add a valid email'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'organizer'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      match: [/^[0-9+\-\s()]*$/, 'Please add a valid phone number'],
    },
    organization: {
      name: String,
      type: {
        type: String,
        enum: ['Temple Committee', 'Art Troupe', 'Tourism Body', 'Other'],
      },
      verificationDoc: String, // Path to ID/Doc
    },
    password: {

      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
      }
    ],
    followedDistricts: [
      {
        type: String,
      }
    ],
    interests: [
      {
        type: String, // e.g., 'Temple Festivals', 'Art Forms'
      }
    ],
  },
  {
    timestamps: true,
  }
);


// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
