const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// THE REGISTRATION ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, city, userRole } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 2. Create the user with the "Hire or Earn" role
        user = new User({ name, email, password, city, userRole });

        // 3. Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save to MongoDB
        await user.save();
        res.status(201).json({ msg: "User registered successfully!", role: user.userRole });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;