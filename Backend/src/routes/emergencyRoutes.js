const express = require('express');
const router = express.Router();
const { 
  postHighEmergency, 
  acceptEmergency, 
  getNearbyEmergencies // Imported here
} = require('../controllers/emergencyController');
const auth = require('../middlewares/auth'); 

// SOS Routes
router.post('/high', auth, postHighEmergency); 
router.put('/accept/:id', auth, acceptEmergency);

// Volunteer Dashboard Route
router.get('/nearby', auth, getNearbyEmergencies); // Used here

module.exports = router;