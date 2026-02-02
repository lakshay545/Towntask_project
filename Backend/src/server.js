const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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