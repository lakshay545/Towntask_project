const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  reviewer: { // The user who is writing the review
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: { // The user who is being reviewed (worker or job_provider)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  trust_impact: { // How this review affects the reviewee's trust score
    type: Number,
    min: -1,
    max: 1,
    default: 0 // Can be positive, negative, or neutral
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
