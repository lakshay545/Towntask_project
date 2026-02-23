// Placeholder for authentication controller logic
exports.register = async (req, res) => {
  res.send('Register endpoint');
};

exports.login = async (req, res) => {
  res.send('Login endpoint');
};
// Verify User via DigiLocker ID
exports.verifyVolunteer = async (req, res) => {
  const { digiLockerId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // In a real app, you'd call DigiLocker API here to validate the ID
    // For the project, we simulate a successful verification
    user.isVolunteer = true;
    user.volunteerDetails.isVerified = true;
    user.volunteerDetails.digiLockerLinked = true;
    user.volunteerDetails.trustScore = 50; // Initial trust boost
    user.volunteerDetails.status = 'ON'; // Automatically set them to active

    await user.save();

    res.json({ 
      msg: "Verification Successful! You are now a TownTask Volunteer.",
      user: {
        isVerified: user.volunteerDetails.isVerified,
        trustScore: user.volunteerDetails.trustScore
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during verification");
  }
};
// Instant Verification for "Skip" users during a live emergency
exports.instantVerify = async (req, res) => {
    const { aadhaarNumber } = req.body;

    // Validate 12-digit Aadhaar format
    if (!/^\d{12}$/.test(aadhaarNumber)) {
        return res.status(400).json({ msg: "Aadhaar must be exactly 12 digits." });
    }

    try {
        const user = await User.findById(req.user.id);
        
        // Upgrade to TEMP_VERIFIED
        user.volunteer_status = 'TEMP_VERIFIED';
        user.verification_level = 'TEMP';
        user.identityData.aadhaarMasked = `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
        user.volunteerDetails.temp_emergency_count = 0; 

        await user.save();
        res.json({ 
            msg: "Hero Mode Activated! You can now accept this emergency.",
            status: 'TEMP_VERIFIED' 
        });
    } catch (err) {
        res.status(500).send("Verification failed");
    }
};