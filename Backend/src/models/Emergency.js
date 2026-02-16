const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  // The person who needs help
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // CORE FEATURE 2 & 3: CATEGORIES
  category: { 
    type: String, 
    enum: ['Crime', 'Medical', 'Personal Safety', 'Vehicle Breakdown', 'Light Repair', 'Tutor', 'Other'], 
    required: true 
  },
  
  // High = SOS (Red), Light = Priority (Orange)
  urgencyLevel: {
    type: String,
    enum: ['High', 'Urgent', 'Immediate', 'Normal'],
    required: true
  },

  description: { type: String, required: true },

  // GEOSPATIAL LOCATION
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },

  // BROADCAST LOGIC (Feature 2)
  status: { 
    type: String, 
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'EXPIRED', 'UNRESPONDED'], 
    default: 'OPEN' 
  },
  
  currentRadius: { type: Number, default: 10 }, // Expands over time (10, 25, 50...)
  
  // Track the helper
  acceptedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },

  // MISUSE PREVENTION (Feature 4)
  reports: [{
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String
  }]

}, { timestamps: true });

// Index for distance-based expansion
emergencySchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Emergency', emergencySchema);