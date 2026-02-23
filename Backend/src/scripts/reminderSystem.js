const User = require('../models/User');

const sendReminders = async () => {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  
  const usersToRemind = await User.find({
    volunteer_status: 'NOT_APPLIED',
    reminder_count: { $lt: 3 },
    last_reminder_at: { $lte: fortyEightHoursAgo }
  });

  usersToRemind.forEach(user => {
    console.log(`📧 Sending Reminder to ${user.email}: Be a Hero today!`);
    user.reminder_count += 1;
    user.last_reminder_at = Date.now(); // Reset timer for next 15 days
    user.save();
  });
};