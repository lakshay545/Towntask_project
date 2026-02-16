const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// 2. Global Middleware (The "Security & Translation" Layer)
app.use(cors()); 
app.use(express.json()); // This MUST be above routes to read SOS data

// 3. Routes (The "Traffic Lights")
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes')); // New SOS Routes

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ TownTask Database Connected!"))
    .catch((err) => {
        console.log("❌ DB Connection Error:", err.message);
    });

// 5. Base Test Route
app.get('/', (req, res) => {
    res.send('TownTask API is live...');
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});