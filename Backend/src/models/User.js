const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // --- BASIC AUTH ---
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  mobile: { type: String, required: true }, 
  password: { type: String, required: true },
  avatar: { type: String, default: null },

  // --- USER ROLE (Poster or Worker) ---
  userRole: { 
    type: String, 
    required: true, 
    enum: ['poster', 'worker'] 
  },

  // --- LOCATION ---
  city: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] } // [longitude, latitude]
  },

  // --- WORKER-SPECIFIC FIELDS ---
  skills: {
    type: [String],
    default: [],
    lowercase: true,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  portfolio: {
    type: [String], // URLs to portfolio items/images
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },

  // --- ACCOUNT VERIFICATION ---
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocument: {
    type: String, // URL or document ID
    default: null
  },

  // --- PROFILE COMPLETION TRACKING ---
  profileCompletion: {
    basicInfo: { type: Boolean, default: false },
    location: { type: Boolean, default: false },
    skills: { type: Boolean, default: false },
    verification: { type: Boolean, default: false },
    portfolio: { type: Boolean, default: false }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- INDEXES ---
userSchema.index({ location: "2dsphere" });
userSchema.index({ city: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ email: 1 });

// --- VIRTUALS ---
userSchema.virtual('profilePercentage').get(function() {
  const completion = this.profileCompletion;
  const completed = Object.values(completion).filter(Boolean).length;
  return Math.round((completed / 5) * 100);
});

module.exports = mongoose.model('User', userSchema);