const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
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
    minlength: 20,
    maxlength: 1000
  },
  job_provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: { // The worker assigned to the job (optional)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  skills_required: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { // [longitude, latitude]
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    address: { // Optional, for display purposes
      type: String,
      trim: true
    }
  },
  budget: {
    type: Number,
    min: 0,
    required: true
  },
  duration: {
    type: String, // e.g., "2 hours", "1 day", "short-term"
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed', 'cancelled'],
    default: 'open'
  },
  emergency: {
    type: Boolean,
    default: false
  },
  posted_date: {
    type: Date,
    default: Date.now
  },
  deadline_date: {
    type: Date // Optional deadline for the job
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
