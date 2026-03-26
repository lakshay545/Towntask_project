const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // --- JOB CONTEXT ---
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },

  // --- CHAT PARTICIPANTS ---
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // --- MESSAGE CONTENT ---
  message: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  attachmentUrl: {
    type: String,
    default: null
  },

  // --- MESSAGE STATUS ---
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  // createdAt and updatedAt are automatically added
  collection: 'messages',
  indexes: [
    { jobId: 1, createdAt: -1 },
    { senderId: 1, receiverId: 1, jobId: 1 }
  ]
});

module.exports = mongoose.model('Message', messageSchema);
