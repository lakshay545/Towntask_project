const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // BASIC AUTH
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
  // CORE FEATURE 1 & 3: ROLE & LOCATION
  // Defines if they are a buyer (client) or seller (freelancer)
  userRole: { 
    type: String, 
    required: true, 
    enum: ['client', 'freelancer'] 
  },
  // GeoJSON for Radius Expansion and SOS
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [Longitude, Latitude]
  },

  // CORE FEATURE 2 & 4: VOLUNTEER & SOS SYSTEM
  // Independent of userRole (A freelancer can also be a volunteer)
  isVolunteer: { type: Boolean, default: false }, 
  volunteerDetails: {
    isVerified: { type: Boolean, default: false }, // Set true after DigiLocker/ID match
    status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' }, // Availability toggle
    trustScore: { type: Number, default: 0 },
    badges: { type: String, enum: ['None', 'Bronze', 'Silver', 'Gold'], default: 'None' },
    digiLockerLinked: { type: Boolean, default: false }
  },

  // MISUSE PREVENTION
  emergencyStats: {
    usageCountThisMonth: { type: Number, default: 0 },
    lastSOSDate: { type: Date },
    reportsAgainst: { type: Number, default: 0 } // For fake report tracking
  }
}, { timestamps: true });

// This index is MANDATORY for Feature 1 (Radius Search) to work
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', userSchema);