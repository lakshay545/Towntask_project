const Message = require('../models/Message');
const Job = require('../models/Job');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  const { jobId, receiverId, message, messageType, attachmentUrl } = req.body;

  try {
    if (!jobId || !receiverId || !message) {
      return res.status(400).json({ msg: "Job ID, Receiver ID, and message are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }

    const newMessage = new Message({
      jobId,
      senderId: req.user.id,
      receiverId,
      message,
      messageType: messageType || 'text',
      attachmentUrl: attachmentUrl || null,
      isRead: false
    });

    await newMessage.save();

    await newMessage.populate('senderId', 'name avatar');
    await newMessage.populate('receiverId', 'name avatar');

    res.status(201).json({ msg: "Message sent", message: newMessage });
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ msg: "Error sending message", error: err.message });
  }
};

// Get messages for a job conversation
exports.getJobMessages = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.posterId.toString() !== req.user.id && job.workerId?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to view messages for this job" });
    }

    const messages = await Message.find({ jobId })
      .populate('senderId', 'name avatar userRole')
      .populate('receiverId', 'name avatar userRole')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get Job Messages Error:", err);
    res.status(500).json({ msg: "Error fetching messages", error: err.message });
  }
};

// Get direct conversation between two users on a specific job
exports.getConversation = async (req, res) => {
  const { jobId, otherUserId } = req.params;

  try {
    const messages = await Message.find({
      jobId,
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    })
      .populate('senderId', 'name avatar userRole email')
      .populate('receiverId', 'name avatar userRole email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get Conversation Error:", err);
    res.status(500).json({ msg: "Error fetching conversation", error: err.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (message.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to mark this message as read" });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({ msg: "Message marked as read", message });
  } catch (err) {
    console.error("Mark As Read Error:", err);
    res.status(500).json({ msg: "Error marking message as read", error: err.message });
  }
};

// Mark all messages as read for a job
exports.markAllAsRead = async (req, res) => {
  const { jobId } = req.params;

  try {
    const result = await Message.updateMany(
      { jobId, receiverId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ msg: "All messages marked as read", result });
  } catch (err) {
    console.error("Mark All As Read Error:", err);
    res.status(500).json({ msg: "Error marking messages as read", error: err.message });
  }
};

// Get unread message count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverId: req.user.id,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (err) {
    console.error("Get Unread Count Error:", err);
    res.status(500).json({ msg: "Error fetching unread count", error: err.message });
  }
};

// Get all conversations for the user
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user.id },
            { receiverId: req.user.id }
          ]
        }
      },
      {
        $group: {
          _id: {
            jobId: '$jobId',
            otherUser: {
              $cond: [
                { $eq: ['$senderId', req.user.id] },
                '$receiverId',
                '$senderId'
              ]
            }
          },
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$receiverId', req.user.id] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    for (let conv of conversations) {
      const user = await User.findById(conv._id.otherUser).select('name avatar email userRole');
      const job = await Job.findById(conv._id.jobId).select('title');
      conv.otherUser = user;
      conv.job = job;
    }

    res.json(conversations);
  } catch (err) {
    console.error("Get Conversations Error:", err);
    res.status(500).json({ msg: "Error fetching conversations", error: err.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this message" });
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (message.createdAt < fiveMinutesAgo) {
      return res.status(400).json({ msg: "Can only delete messages within 5 minutes of sending" });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ msg: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete Message Error:", err);
    res.status(500).json({ msg: "Error deleting message", error: err.message });
  }
};

module.exports = exports;
