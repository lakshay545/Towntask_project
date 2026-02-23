const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const auth = require('../middlewares/auth'); 
const { verifyVolunteer } = require('../controllers/authController');

// --- 1. REGISTRATION (STEP 1) ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, mobile, city, userRole } = req.body;

        // Validation
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Create user with new tiered verification fields
        user = new User({ 
            name, 
            email, 
            mobile, // New field required by updated User.js
            password, 
            city, 
            userRole,
            volunteer_status: 'NOT_APPLIED', // Default status for Step 2
            verification_level: 'NONE',
            location: { type: 'Point', coordinates: [0, 0] } 
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Send token immediately so they can see the "Volunteer Choice" page
        const payload = { user: { id: user.id, role: user.userRole } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ 
                token, 
                msg: "Registration Successful! Moving to Step 2...",
                user: { name: user.name, role: user.userRole }
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error during registration");
    }
});

// --- 2. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const payload = { user: { id: user.id, role: user.userRole } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                msg: "Login successful!",
                user: { 
                    name: user.name, 
                    role: user.userRole, 
                    volunteer_status: user.volunteer_status, // Track for Dashboard UI
                    isVerified: user.volunteer_status === 'VERIFIED'
                }
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error during login");
    }
});

// --- 3. SKIP VOLUNTEER (STEP 2 LOGIC) ---
router.post('/skip-volunteer', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        user.volunteer_status = 'NOT_APPLIED';
        user.last_reminder_at = Date.now(); // Start the 48-hour timer
        user.reminder_count = 0;

        await user.save();
        res.json({ msg: "Selection skipped. You will be reminded later." });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// --- 4. VERIFICATION ROUTES ---
router.post('/verify-volunteer', auth, verifyVolunteer);

module.exports = router;