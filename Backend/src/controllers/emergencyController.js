const Emergency = require('../models/Emergency');
const User = require('../models/User');

// 1. Post a High Emergency SOS
exports.postHighEmergency = async (req, res) => {
  const { category, description, lng, lat } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user.volunteerDetails.isVerified && user.emergencyStats.usageCountThisMonth >= 1) {
      return res.status(429).json({ msg: "Unverified users are limited to 1 SOS per month." });
    }

    const newSOS = new Emergency({
      userId: req.user.id,
      category,
      description,
      urgencyLevel: 'High',
      location: { type: 'Point', coordinates: [lng, lat] }
    });

    await newSOS.save();

    user.emergencyStats.usageCountThisMonth += 1;
    user.emergencyStats.lastSOSDate = Date.now();
    await user.save();

    console.log(`🚨 SOS Posted! Initial broadcast: 10km radius for category: ${category}`);
    res.status(201).json({ msg: "High Emergency SOS Broadcasted!", sosId: newSOS._id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in SOS Posting");
  }
};

// 2. Get Nearby Emergencies (For Volunteer Dashboard)
exports.getNearbyEmergencies = async (req, res) => {
  try {
    const volunteer = await User.findById(req.user.id);
    
    if (!volunteer || !volunteer.location || !volunteer.location.coordinates) {
      return res.status(400).json({ msg: "Location not found for this user. Please update profile." });
    }

    const emergencies = await Emergency.find({
      status: 'OPEN',
      location: {
        $near: {
          $geometry: { 
            type: "Point", 
            coordinates: volunteer.location.coordinates 
          },
          $maxDistance: 50000 // 50km
        }
      }
    });

    res.json(emergencies);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error fetching nearby alerts");
  }
};

// 3. Accept an Emergency
exports.acceptEmergency = async (req, res) => {
  try {
    const sos = await Emergency.findById(req.params.id);

    if (!sos) return res.status(404).json({ msg: "Emergency not found" });
    if (sos.status !== 'OPEN') return res.status(400).json({ msg: "Already accepted by someone else" });

    sos.status = 'IN_PROGRESS';
    sos.acceptedBy = req.user.id;
    await sos.save();

    res.json({ msg: "You have accepted this emergency. Exact location shared.", location: sos.location });
  } catch (err) {
    res.status(500).send("Error accepting emergency");
  }
};
exports.acceptEmergency = async (req, res) => {
  try {
    const emergencyId = req.params.id;
    const volunteerId = req.user.id;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) return res.status(404).json({ msg: "Emergency not found" });

    // Check if it's already taken
    if (emergency.status !== 'OPEN') {
      return res.status(400).json({ msg: "This emergency has already been accepted." });
    }

    // Update Emergency Status
    emergency.status = 'ACCEPTED';
    emergency.acceptedBy = volunteerId;
    await emergency.save();

    // REWARD SYSTEM: Update Volunteer's Trust Score
    const user = await User.findById(volunteerId);
    
    // Logic: +10 for any help, +20 if they are FULLY VERIFIED
    const points = user.verification_level === 'FULL' ? 20 : 10;
    user.volunteerDetails.trustScore += points;

    // Badge Logic: Auto-upgrade based on score
    if (user.volunteerDetails.trustScore >= 100) user.volunteerDetails.badges = 'Gold';
    else if (user.volunteerDetails.trustScore >= 50) user.volunteerDetails.badges = 'Silver';
    else if (user.volunteerDetails.trustScore >= 10) user.volunteerDetails.badges = 'Bronze';

    await user.save();

    res.json({ 
      msg: "Emergency Accepted!", 
      pointsEarned: points,
      currentBadge: user.volunteerDetails.badges 
    });

  } catch (err) {
    res.status(500).send("Server Error");
  }
};