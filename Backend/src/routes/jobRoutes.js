const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middlewares/auth');

// === JOB DISCOVERY & SEARCH ===

// Get available jobs for workers (with skill/location matching)
router.get('/available/for-me', auth, jobController.getAvailableJobs);

// Get jobs posted by current user
router.get('/my-jobs/list', auth, jobController.getMyJobs);

// Search jobs with filters
router.get('/search/query', auth, jobController.searchJobs);

// Get jobs by category
router.get('/search/category', auth, jobController.getJobsByCategory);

// === BASIC CRUD ===

// Create a new job
router.post('/', auth, jobController.createJob);

// Get a single job by ID (with proposals)
router.get('/:id', auth, jobController.getJobById);

// Update a job
router.put('/:id', auth, jobController.updateJob);

// Delete a job
router.delete('/:id', auth, jobController.deleteJob);

// === JOB ACTIONS ===

// Expand job visibility/radius to neighboring cities
router.post('/:id/expand-radius', auth, jobController.expandJobRadius);

// Mark job as completed
router.post('/:id/complete', auth, jobController.completeJob);

// Cancel a job
router.post('/:id/cancel', auth, jobController.cancelJob);

module.exports = router;

