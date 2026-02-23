const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // BASIC AUTH (Step 1)
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true }, // Added for OTP requirement
  password: { type: String, required: true },
  userRole: { 
    type: String, 
    required: true, 
    enum: ['client', 'freelancer'] 
  },

  // CORE FEATURE 1 & 3: LOCATION
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', default: [0, 0] } 
  },

  // NEW VOLUNTEER & VERIFICATION LOGIC (Step 2 & Feature 4)
  volunteer_status: { 
    type: String, 
    enum: ['NOT_APPLIED', 'PENDING_VERIFICATION', 'TEMP_VERIFIED', 'VERIFIED', 'REJECTED'], 
    default: 'NOT_APPLIED' 
  },
  verification_level: {
    type: String,
    enum: ['NONE', 'TEMP', 'FULL'],
    default: 'NONE'
  },
  
  volunteerDetails: {
    status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' }, 
    trustScore: { type: Number, default: 0 },
    badges: { type: String, enum: ['None', 'Bronze', 'Silver', 'Gold'], default: 'None' },
    full_verified_at: { type: Date },
    temp_emergency_count: { type: Number, default: 0 } // Limit max 2 for TEMP
  },

  // IDENTITY SECURITY (Feature 4 Requirements)
  identityData: {
    aadhaarMasked: { type: String }, // Store as XXXX-XXXX-1234
    panMasked: { type: String },    // Store as ABCDE1234F
    isFaceMatched: { type: Boolean, default: false }
  },

  // REMINDER LOGIC (Step 2 Skip Logic)
  reminder_count: { type: Number, default: 0 }, // Max 3 reminders
  last_reminder_at: { type: Date },

  // MISUSE PREVENTION (Feature 2)
  emergencyStats: {
    usageCountThisMonth: { type: Number, default: 0 },
    lastSOSDate: { type: Date },
    reportsAgainst: { type: Number, default: 0 }
  }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('User', userSchema);