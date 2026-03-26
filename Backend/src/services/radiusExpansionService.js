const Job = require('../models/Job');

/**
 * RADIUS EXPANSION SERVICE
 * Automatically expands search radius for jobs when no proposals received
 * When not bidden: 15km -> 25km (15 min) -> 40km (30 min) -> 60km (45 min)
 */

// Configuration for radius expansion
const EXPANSION_CONFIG = {
  jobs: [
    { radius: 15, afterMinutes: 0, description: "Local (15km)" },
    { radius: 25, afterMinutes: 15, description: "Expanded (25km)" },
    { radius: 40, afterMinutes: 30, description: "Extended (40km)" },
    { radius: 60, afterMinutes: 45, description: "Regional (60km)" }
  ]
};

/**
 * Get the current radius based on elapsed time for job expansion
 * @param {number} elapsedMinutes - Minutes since job creation
 * @returns {number} The current radius in km
 */
function getCurrentRadius(elapsedMinutes) {
  const config = EXPANSION_CONFIG.jobs;

  for (let i = config.length - 1; i >= 0; i--) {
    if (elapsedMinutes >= config[i].afterMinutes) {
      return config[i].radius;
    }
  }

  return config[0].radius;
}

/**
 * Expand job search radius
 * Called periodically to update jobs with new search radius
 */
exports.expandJobRadius = async () => {
  try {
    // Find all open jobs
    const openJobs = await Job.find({ status: 'open' });

    for (const job of openJobs) {
      const createdAt = new Date(job.createdAt);
      const now = new Date();
      const elapsedMinutes = Math.floor((now - createdAt) / (1000 * 60));

      const newRadius = getCurrentRadius(elapsedMinutes, 'job');

      // Only update if radius has changed
      if (newRadius !== job.currentRadius) {
        job.currentRadius = newRadius;
        job.lastRadiusExpandAt = new Date();

        // Log expansion history
        if (!job.radiusExpansionHistory) {
          job.radiusExpansionHistory = [];
        }
        job.radiusExpansionHistory.push({
          radius: newRadius,
          expandedAt: new Date()
        });

        await job.save();
        console.log(`[Radius Expansion] Job ${job._id} expanded to ${newRadius}km`);
      }

      // Auto-cancel jobs that have been open for 60+ minutes with no acceptance
      if (elapsedMinutes > 60) {
        job.status = 'cancelled';
        await job.save();
        console.log(`[Auto-Cancel] Job ${job._id} cancelled after 60 minutes with no acceptance`);
      }
    }

    return { success: true, jobsProcessed: openJobs.length };
  } catch (err) {
    console.error("[Radius Expansion Error] Jobs:", err);
    return { success: false, error: err.message };
  }
};

/**
 * Get nearby jobs with current radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} jobId - Optional job ID to exclude
 * @returns {Array} Nearby jobs
 */
exports.getNearbyJobsWithCurrentRadius = async (lat, lng, jobId = null) => {
  try {
    const job = jobId ? await Job.findById(jobId) : null;
    const radius = job ? job.currentRadius : 15;

    let query = {
      status: 'open',
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    };

    if (jobId) {
      query._id = { $ne: jobId };
    }

    return await Job.find(query).populate('job_provider', 'name email mobile');
  } catch (err) {
    console.error("[Get Nearby Jobs Error]:", err);
    return [];
  }
};


/**
 * Get expansion status for a job
 * @param {string} id - Job ID
 * @returns {Object} Expansion status
 */
exports.getExpansionStatus = async (id) => {
  try {
    const doc = await Job.findById(id);

    if (!doc) return null;

    const createdAt = new Date(doc.createdAt);
    const now = new Date();
    const elapsedMinutes = Math.floor((now - createdAt) / (1000 * 60));
    const config = EXPANSION_CONFIG.jobs;

    return {
      id: doc._id,
      currentRadius: doc.currentRadius,
      elapsedMinutes,
      status: doc.status,
      expansionHistory: doc.expansionHistory || [],
      nextExpansion: config.find(c => c.afterMinutes > elapsedMinutes) || null,
      createdAt,
      updatedAt: doc.updatedAt
    };
  } catch (err) {
    console.error("[Get Expansion Status Error]:", err);
    return null;
  }
};

module.exports.EXPANSION_CONFIG = EXPANSION_CONFIG;
