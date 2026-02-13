const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load Environment Variables
dotenv.config();

const app = express();

// 2. Global Middleware
app.use(cors()); // Allows Frontend (5173) to talk to Backend (5000)
app.use(express.json()); // Parses incoming JSON data into req.body

// 3. Import and Initialize Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // URLs will be http://localhost:5000/api/auth/...

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ TownTask Database Connected!"))
    .catch((err) => {
        console.log("❌ DB Connection Error Details:");
        console.log(err.message); 
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