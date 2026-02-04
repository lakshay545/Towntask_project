const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Import the route file at the top
const authRoutes = require('./routes/authRoutes');

// 2. Middleware (This MUST come before the routes)
app.use(express.json()); 

// 3. Connect the prefix to the file
// This makes the URL: http://localhost:5000/api/auth/register
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ TownTask Database Connected!"))
    .catch((err) => {
        console.log("❌  DB Connection Error Details:");
        console.log(err.message); // This will print the specific reason
    });

// Test Route
app.get('/', (req, res) => {
    res.send('TownTask API is live...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});