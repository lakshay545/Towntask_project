const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Step 1: The "Hire vs Earn" Choice
    userRole: {
        type: String,
        enum: ['client', 'freelancer'], // User must choose one
        required: true
    },
    // Step 2: Basic Login Details
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if using Google/Facebook login
    googleId: { type: String }, 
    
    // Step 3: Location & Skills
    city: { type: String, required: true, lowercase: true },
    skills: [String], // Only needed for freelancers
    
    // Step 4: Trust & Verification (Optional but requested for "Working")
    isVerified: { type: Boolean, default: false },
    socialLinks: {
        linkedin: String,
        github: String
    },
    profilePhoto: String,
    
    // Step 5: Ratings
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);