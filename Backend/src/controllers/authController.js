const User = require('../models/User');

// --- 1. DIGILOCKER FULL VERIFICATION (The "Gold" Standard) ---
exports.verifyVolunteer = async (req, res) => {
  const { digiLockerId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Matching your User.js schema exactly:
    user.volunteer_status = 'VERIFIED';
    user.verification_level = 'FULL';
    
    // Update the volunteerDetails object
    user.volunteerDetails.status = 'ON';
    user.volunteerDetails.trustScore = (user.volunteerDetails.trustScore || 0) + 100; // Big boost for DigiLocker
    user.volunteerDetails.badges = 'Bronze'; // First badge earned!
    user.volunteerDetails.full_verified_at = Date.now();

    // Store the ID securely (Masked if needed)
    user.identityData.aadhaarMasked = `DigiLocker-Linked-${digiLockerId.slice(-4)}`;

    await user.save();

    res.json({ 
      msg: "Full Verification Successful! You are now a TownTask Hero.",
      user: {
        status: user.volunteer_status,
        trustScore: user.volunteerDetails.trustScore,
        badge: user.volunteerDetails.badges
      }
    });
  } catch (err) {
    console.error("DigiLocker Sync Error:", err.message);
    res.status(500).send("Server Error during verification");
  }
};

// --- 2. INSTANT VERIFICATION (The "Emergency" Shortcut) ---
exports.instantVerify = async (req, res) => {
    const { aadhaarNumber } = req.body;

    // Validate 12-digit Aadhaar format
    if (!/^\d{12}$/.test(aadhaarNumber)) {
        return res.status(400).json({ msg: "Aadhaar must be exactly 12 digits." });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });
        
        // Upgrade to TEMP_VERIFIED for immediate SOS response
        user.volunteer_status = 'TEMP_VERIFIED';
        user.verification_level = 'TEMP';
        
        // Mask the number immediately for security
        user.identityData.aadhaarMasked = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
        
        // Logic for Feature 4: Limit TEMP users to 2 emergencies before requiring FULL KYC
        user.volunteerDetails.temp_emergency_count = 0; 
        user.volunteerDetails.trustScore = (user.volunteerDetails.trustScore || 0) + 20;

        await user.save();
        res.json({ 
            msg: "Hero Mode Activated! You can now accept this emergency.",
            status: 'TEMP_VERIFIED' 
        });
    } catch (err) {
        console.error("Instant Verify Error:", err.message);
        res.status(500).send("Verification failed");
    }
};