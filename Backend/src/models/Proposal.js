const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  // --- RELATIONSHIP TO JOB ---
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },

  // --- WORKER INFO ---
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // --- PROPOSAL DETAILS ---
  proposedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDays: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  attachments: {
    type: [String], // URLs for portfolio or sample work
    default: []
  },

  // --- STATUS ---
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
    index: true
  },

  // --- TIMESTAMPS ---
  acceptedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  indexes: [
    { jobId: 1, status: 1 },
    { workerId: 1, status: 1 },
    { jobId: 1, workerId: 1, unique: true }
  ]
});

module.exports = mongoose.model('Proposal', proposalSchema);
