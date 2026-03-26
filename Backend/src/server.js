const { app, server, io } = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { initializeBackgroundTasks } = require('./services/backgroundTaskScheduler');

// 1. Load Environment Variables
dotenv.config();

// 2. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ TownTask Database Connected!");
        // Initialize background tasks AFTER DB connection
        initializeBackgroundTasks();
    })
    .catch((err) => {
        console.log("❌ DB Connection Error:", err.message);
        process.exit(1);
    });

// 3. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io real-time support enabled`);
    console.log(`🔄 Background tasks running`);
});