const Job = require('../models/Job');
const User = require('../models/User');
const Proposal = require('../models/Proposal');

// HELPER: Check for proposals on a job
const checkJobProposals = async (jobId) => {
  const count = await Proposal.countDocuments({ jobId, status: 'pending' });
  return count;
};

// HELPER: Get neighboring cities (for expansion logic)
const getNeighboringCities = async (city) => {
  const cityNeighbors = {
    'New York': ['Jersey City', 'Newark'],
    'Los Angeles': ['Santa Monica', 'Long Beach'],
    'Chicago': ['Evanston', 'Oak Park'],
    'Mumbai': ['Thane', 'Navi Mumbai'],
    'Delhi': ['Gurugram', 'Noida']
  };
  return cityNeighbors[city] || [];
};

// Create a new job (post a task)
exports.createJob = async (req, res) => {
  const { title, description, budget, budgetType, category, lng, lat, city, address, requiredSkills, estimatedDuration, deadline } = req.body;
  try {
    if (!title || !description || !budget || !category || !lng || !lat || !city) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    const newJob = new Job({
      posterId: req.user.id,
      title,
      description,
      budget: parseFloat(budget),
      budgetType: budgetType || 'fixed',
      category,
      city,
      requiredSkills: requiredSkills || [],
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        address: address || ''
      },
      estimatedDuration: estimatedDuration || 'Flexible',
      deadline: deadline ? new Date(deadline) : null,
      status: 'open',
      isExpanded: false,
      currentRadius: 15,
      visibleCities: [city]
    });

    await newJob.save();
    res.status(201).json({ msg: "Job posted successfully!", job: newJob });
  } catch (err) {
    console.error("Job Creation Error:", err);
    res.status(500).json({ msg: "Server Error in Job Posting", error: err.message });
  }
};

// Get jobs for a worker (matching skills and location)
exports.getAvailableJobs = async (req, res) => {
  const { lat, lng, skills, city } = req.query;
  
  try {
    let query = { status: 'open' };

    if (city) {
      query.city = city;
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
      query.requiredSkills = { $in: skillsArray };
    }

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 25000
        }
      };
    }

    const jobs = await Job.find(query)
      .populate('posterId', 'name email mobile rating avatar city')
      .populate('workerId', 'name email mobile')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (err) {
    console.error("Get Available Jobs Error:", err);
    res.status(500).json({ msg: "Error fetching available jobs", error: err.message });
  }
};

// Get jobs posted by a specific user (Poster dashboard)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ posterId: req.user.id })
      .populate('posterId', 'name email mobile')
      .populate('workerId', 'name email mobile rating')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Get My Jobs Error:", err);
    res.status(500).json({ msg: "Error fetching your jobs", error: err.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('posterId', 'name email mobile rating avatar city bio')
      .populate('workerId', 'name email mobile rating avatar skills');

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const proposals = await Proposal.find({ jobId: job._id, status: 'pending' })
      .populate('workerId', 'name email mobile rating skills avatar');

    res.json({ job, proposals });
  } catch (err) {
    console.error("Get Job Error:", err);
    res.status(500).json({ msg: "Error fetching job", error: err.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this job" });
    }

    const { title, description, budget, category, status, requiredSkills } = req.body;
    if (title) job.title = title;
    if (description) job.description = description;
    if (budget) job.budget = parseFloat(budget);
    if (category) job.category = category;
    if (status) job.status = status;
    if (requiredSkills) job.requiredSkills = requiredSkills;

    job = await job.save();
    res.json({ msg: "Job updated successfully!", job });
  } catch (err) {
    console.error("Update Job Error:", err);
    res.status(500).json({ msg: "Error updating job", error: err.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this job" });
    }

    if (!['open', 'cancelled'].includes(job.status)) {
      return res.status(400).json({ msg: "Cannot delete a job that is assigned or completed" });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ jobId: req.params.id });

    res.json({ msg: "Job deleted successfully!" });
  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({ msg: "Error deleting job", error: err.message });
  }
};

// Expand job visibility to neighboring cities
exports.expandJobRadius = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const proposalCount = await checkJobProposals(job._id);
    if (proposalCount > 0) {
      return res.status(400).json({ msg: "Cannot expand: job already has proposals" });
    }

    const radiusSteps = [15, 25, 40, 60];
    const currentIndex = radiusSteps.indexOf(job.currentRadius);
    
    if (currentIndex === -1 || currentIndex === radiusSteps.length - 1) {
      return res.status(400).json({ msg: "Job radius is already at maximum" });
    }

    const newRadius = radiusSteps[currentIndex + 1];
    
    job.currentRadius = newRadius;
    job.isExpanded = true;
    job.lastExpandedAt = new Date();
    job.expansionHistory.push({
      radius: newRadius,
      expandedAt: new Date()
    });

    const neighbors = await getNeighboringCities(job.city);
    job.visibleCities = [job.city, ...neighbors];

    await job.save();

    res.json({ msg: `Job visibility expanded to ${newRadius}km radius`, job });
  } catch (err) {
    console.error("Expand Job Error:", err);
    res.status(500).json({ msg: "Error expanding job", error: err.message });
  }
};

// Search jobs with filters
exports.searchJobs = async (req, res) => {
  const { q, category, minBudget, maxBudget, city, skills } = req.query;

  try {
    let query = { status: 'open' };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (city) query.city = city;

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
      query.requiredSkills = { $in: skillsArray };
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseFloat(minBudget);
      if (maxBudget) query.budget.$lte = parseFloat(maxBudget);
    }

    const jobs = await Job.find(query)
      .populate('posterId', 'name email mobile rating avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (err) {
    console.error("Search Jobs Error:", err);
    res.status(500).json({ msg: "Error searching jobs", error: err.message });
  }
};

// Get jobs by category
exports.getJobsByCategory = async (req, res) => {
  const { category, city } = req.query;

  try {
    if (!category) {
      return res.status(400).json({ msg: "Category parameter required" });
    }

    let query = { status: 'open', category };

    if (city) query.city = city;

    const jobs = await Job.find(query)
      .populate('posterId', 'name email mobile rating avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(jobs);
  } catch (err) {
    console.error("Get Jobs By Category Error:", err);
    res.status(500).json({ msg: "Error fetching jobs by category", error: err.message });
  }
};

// Mark job as completed
exports.completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to complete this job" });
    }

    if (job.status !== 'assigned') {
      return res.status(400).json({ msg: "Only assigned jobs can be completed" });
    }

    job.status = 'completed';
    await job.save();

    res.json({ msg: "Job marked as completed!", job });
  } catch (err) {
    console.error("Complete Job Error:", err);
    res.status(500).json({ msg: "Error completing job", error: err.message });
  }
};

// Cancel a job
exports.cancelJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.posterId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to cancel this job" });
    }

    job.status = 'cancelled';
    await job.save();

    res.json({ msg: "Job cancelled successfully!", job });
  } catch (err) {
    console.error("Cancel Job Error:", err);
    res.status(500).json({ msg: "Error cancelling job", error: err.message });
  }
};

module.exports = exports;
