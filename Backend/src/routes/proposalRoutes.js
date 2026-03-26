const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const auth = require('../middlewares/auth');

// === PROPOSAL CRUD ===

// Create a new proposal (worker bids on a job)
router.post('/', auth, proposalController.createProposal);

// Get all proposals for a specific job
router.get('/job/:jobId', auth, proposalController.getJobProposals);

// Get worker's own proposals
router.get('/my-proposals/list', auth, proposalController.getMyProposals);

// Get proposals by status
router.get('/status/:status', auth, proposalController.getProposalsByStatus);

// Get a single proposal
router.get('/:proposalId', auth, proposalController.getProposalById);

// === PROPOSAL ACTIONS ===

// Accept a proposal (assign job to worker)
router.post('/:proposalId/accept', auth, proposalController.acceptProposal);

// Reject a proposal
router.post('/:proposalId/reject', auth, proposalController.rejectProposal);

// Withdraw a proposal (worker withdraws their bid)
router.post('/:proposalId/withdraw', auth, proposalController.withdrawProposal);

// Update a proposal
router.put('/:proposalId', auth, proposalController.updateProposal);

module.exports = router;
