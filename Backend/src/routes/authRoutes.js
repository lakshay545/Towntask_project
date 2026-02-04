const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
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
// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // 2. Compare the typed password with the encrypted one in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // 3. If everything is correct, send a success message
        // (In the next step, we will add a "Token" here for security)
        // ................................................................................................................


// 3. Create a Token
const payload = {
    user: {
        id: user.id,
        role: user.userRole // 'client' or 'freelancer'
    }
};

jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '24h' }, // User stays logged in for 24 hours
    (err, token) => {
        if (err) throw err;
        res.json({
            token,
            msg: "Login successful!",
            user: { name: user.name, role: user.userRole, city: user.city }
        });
    }
);
 
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;