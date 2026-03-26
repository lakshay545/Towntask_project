const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// ======= SOCKET.IO EVENT HANDLERS =======

// Track active users by their ID
const activeUsers = new Map(); // { userId: socketId }

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // === USER AUTHENTICATION & REGISTRATION ===
  socket.on('userLogin', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.join(`user:${userId}`); // Private room for this user
    console.log(`✅ User ${userId} registered with socket ${socket.id}`);
  });

  // === CHAT & JOB REAL-TIME MESSAGING ===
  
  // Send direct message between users on a job
  socket.on('sendDirectMessage', (message) => {
    const { jobId, recipientId, senderId, content, timestamp } = message;
    
    io.to(`user:${recipientId}`).emit('receiveDirectMessage', {
      jobId,
      senderId,
      content,
      timestamp: timestamp || new Date()
    });
    
    console.log(`💬 Message from ${senderId} to ${recipientId} on job ${jobId}`);
  });

  // === JOB MARKETPLACE REAL-TIME ===
  
  // Broadcast new job to all workers
  socket.on('jobBroadcast', (jobId, jobData) => {
    io.emit('newJobAvailable', {
      jobId,
      ...jobData,
      timestamp: new Date()
    });
    console.log(`📢 New job broadcast: ${jobId}`);
  });

  // Broadcast job status change
  socket.on('jobStatusChange', (jobId, newStatus) => {
    io.emit('jobStatusUpdated', {
      jobId,
      newStatus,
      timestamp: new Date()
    });
    console.log(`📊 Job ${jobId} status updated to: ${newStatus}`);
  });

  // Notify user of proposal on their job
  socket.on('proposalNotification', (userId, proposalData) => {
    io.to(`user:${userId}`).emit('newProposal', {
      ...proposalData,
      timestamp: new Date()
    });
    console.log(`🔔 Proposal notification sent to ${userId}`);
  });

  // === NOTIFICATIONS ===
  
  socket.on('sendNotification', (userId, notification) => {
    io.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date()
    });
    console.log(`📬 Notification sent to ${userId}`);
  });

  // === CLEANUP & DISCONNECTION ===
  
  socket.on('disconnect', () => {
    const userId = socket.userId;
    if (userId) {
      activeUsers.delete(userId);
      console.log(`👤 User ${userId} disconnected (Socket: ${socket.id})`);
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`⚠️ Socket error for ${socket.id}:`, error);
  });
});

// ======= EXPRESS MIDDLEWARE =======

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/chat', chatRoutes);

// ======= SOCKET.IO INSTANCE EXPORT =======
// Make io accessible to routes for sending notifications
app.io = io;

// Basic route
app.get('/', (req, res) => {
  res.send('Towntask Backend API with Real-Time Support');
});

module.exports = { app, server, io };
