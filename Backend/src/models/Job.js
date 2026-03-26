const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // --- BASIC JOB INFO ---
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Cleaning', 'Repair', 'Moving', 'Delivery', 'Tutoring', 'Design', 'Writing', 'Tech', 'Other'],
    default: 'Other'
  },

  // --- POSTER INFO ---
  posterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // --- ASSIGNED WORKER ---
  workerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // --- REQUIRED SKILLS ---
  requiredSkills: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // --- LOCATION INFO ---
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { 
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    },
    address: { 
      type: String,
      trim: true
    }
  },

  // --- BUDGET & TIMING ---
  budget: {
    type: Number,
    min: 0,
    required: true
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    default: 'fixed'
  },
  estimatedDuration: {
    type: String,
    default: 'Flexible',
    enum: ['Less than 1 hour', '1-3 hours', '3-8 hours', '1-3 days', '1+ weeks', 'Flexible']
  },
  deadline: {
    type: Date 
  },

  // --- JOB STATUS ---
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },

  // --- EXPANSION LOGIC (Proximity Rule with Automatic Expansion) ---
  isExpanded: {
    type: Boolean,
    default: false
  },
  currentRadius: {
    type: Number,
    default: 15 // Initial radius in km
  },
  lastExpandedAt: {
    type: Date
  },
  expansionHistory: [{
    radius: Number,
    expandedAt: { type: Date, default: Date.now }
  }],

  // --- VISIBILITY CONTROL ---
  visibleCities: {
    type: [String],
    default: function() { return [this.city]; }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// --- INDEXES FOR PERFORMANCE ---
jobSchema.index({ location: "2dsphere" });
jobSchema.index({ city: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ posterId: 1 });
jobSchema.index({ workerId: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);