const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // This allows us to send/receive JSON data

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('TownTask Backend is running!');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server is sprinting on port ${PORT}`);
});
