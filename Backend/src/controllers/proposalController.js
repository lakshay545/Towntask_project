const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const User = require('../models/User');

// Create a proposal (worker bids on a job)
exports.createProposal = async (req, res) => {
  const { jobId, proposedPrice, deliveryDays, description, attachments } = req.body;

  try {
    // Validation
    if (!jobId || !proposedPrice || !deliveryDays || !description) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Check if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({ msg: "Cannot bid on a job that is not open" });
    }

    // Check if worker already has a proposal on this job
    const existingProposal = await Proposal.findOne({ 
      jobId, 
      workerId: req.user.id,
      status: { $ne: 'withdrawn' }
    });

    if (existingProposal) {
      return res.status(400).json({ msg: "You already have a proposal on this job" });
    }

    // Get worker info for validation
    const worker = await User.findById(req.user.id);
    if (!worker || worker.userRole !== 'worker') {
      return res.status(403).json({ msg: "Only workers can create proposals" });
    }

    const newProposal = new Proposal({
      jobId,
      workerId: req.user.id,
      proposedPrice: parseFloat(proposedPrice),
      deliveryDays: parseInt(deliveryDays),
      description,
      attachments: attachments || [],
      status: 'pending'
    });

    await newProposal.save();

    res.status(201).json({ msg: "Proposal submitted successfully!", proposal: newProposal });
  } catch (err) {
    console.error("Create Proposal Error:", err);
    res.status(500).json({ msg: "Error creating proposal", error: err.message });
  }
};

// Get all proposals for a specific job
exports.getJobProposals = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Only job poster can view proposals
    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to view proposals for this job" });
    }

    const proposals = await Proposal.find({ jobId, status: 'pending' })
      .populate('workerId', 'name email mobile rating skills avatar reviewCount')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    console.error("Get Job Proposals Error:", err);
    res.status(500).json({ msg: "Error fetching proposals", error: err.message });
  }
};

// Get worker's proposals
exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ workerId: req.user.id })
      .populate('jobId', 'title budget category city status deadline')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    console.error("Get My Proposals Error:", err);
    res.status(500).json({ msg: "Error fetching your proposals", error: err.message });
  }
};

// Get a single proposal
exports.getProposalById = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findById(proposalId)
      .populate('jobId', 'title description budget category city deadline')
      .populate('workerId', 'name email mobile rating skills avatar bio');

    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    res.json(proposal);
  } catch (err) {
    console.error("Get Proposal Error:", err);
    res.status(500).json({ msg: "Error fetching proposal", error: err.message });
  }
};

// Accept a proposal (assign job to worker)
exports.acceptProposal = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    const job = await Job.findById(proposal.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Only job poster can accept proposals
    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to accept proposals" });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ msg: "Proposal is no longer pending" });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ msg: "Job is no longer available" });
    }

    // Update proposal
    proposal.status = 'accepted';
    proposal.acceptedAt = new Date();
    await proposal.save();

    // Update job
    job.workerId = proposal.workerId;
    job.status = 'assigned';
    await job.save();

    // Reject all other proposals for this job
    await Proposal.updateMany(
      { jobId: proposal.jobId, _id: { $ne: proposalId }, status: 'pending' },
      { status: 'rejected', rejectedAt: new Date() }
    );

    res.json({ msg: "Proposal accepted. Job assigned to worker!", proposal });
  } catch (err) {
    console.error("Accept Proposal Error:", err);
    res.status(500).json({ msg: "Error accepting proposal", error: err.message });
  }
};

// Reject a proposal
exports.rejectProposal = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    const job = await Job.findById(proposal.jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Only job poster can reject proposals
    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to reject proposals" });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ msg: "Proposal is no longer pending" });
    }

    proposal.status = 'rejected';
    proposal.rejectedAt = new Date();
    await proposal.save();

    res.json({ msg: "Proposal rejected", proposal });
  } catch (err) {
    console.error("Reject Proposal Error:", err);
    res.status(500).json({ msg: "Error rejecting proposal", error: err.message });
  }
};

// Withdraw a proposal (worker withdraws their bid)
exports.withdrawProposal = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    // Only the worker who created the proposal can withdraw
    if (proposal.workerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to withdraw this proposal" });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ msg: "Cannot withdraw a proposal that is no longer pending" });
    }

    proposal.status = 'withdrawn';
    await proposal.save();

    res.json({ msg: "Proposal withdrawn successfully", proposal });
  } catch (err) {
    console.error("Withdraw Proposal Error:", err);
    res.status(500).json({ msg: "Error withdrawing proposal", error: err.message });
  }
};

// Update a proposal (butto only if status is pending)
exports.updateProposal = async (req, res) => {
  const { proposalId } = req.params;
  const { proposedPrice, deliveryDays, description, attachments } = req.body;

  try {
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ msg: "Proposal not found" });
    }

    if (proposal.workerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this proposal" });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ msg: "Cannot update a proposal that is no longer pending" });
    }

    if (proposedPrice) proposal.proposedPrice = parseFloat(proposedPrice);
    if (deliveryDays) proposal.deliveryDays = parseInt(deliveryDays);
    if (description) proposal.description = description;
    if (attachments) proposal.attachments = attachments;

    await proposal.save();

    res.json({ msg: "Proposal updated successfully", proposal });
  } catch (err) {
    console.error("Update Proposal Error:", err);
    res.status(500).json({ msg: "Error updating proposal", error: err.message });
  }
};

// Get proposals with specific status
exports.getProposalsByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    if (!['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const proposals = await Proposal.find({ workerId: req.user.id, status })
      .populate('jobId', 'title budget category city')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (err) {
    console.error("Get Proposals By Status Error:", err);
    res.status(500).json({ msg: "Error fetching proposals", error: err.message });
  }
};

module.exports = exports;
