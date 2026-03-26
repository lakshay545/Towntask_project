/**
 * BACKGROUND TASK SCHEDULER
 * Handles periodic tasks like radius expansion
 * Uses setInterval for tasks (lightweight alternative to external job queues)
 */

const radiusExpansionService = require('./radiusExpansionService');

let scheduledTasks = [];

/**
 * Initialize all background tasks
 */
function initializeBackgroundTasks() {
  console.log('[Background Tasks] Initializing...');

  // Task 1: Expand radius every 1 minute for jobs
  const radiusExpandTask = setInterval(async () => {
    const jobResult = await radiusExpansionService.expandJobRadius();

    if (jobResult.success) {
      console.log('[Background Tasks] Radius expansion completed');
    }
  }, 60000); // Every 1 minute

  scheduledTasks.push(radiusExpandTask);

  console.log('[Background Tasks] ✅ All tasks initialized');
}

/**
 * Stop all background tasks
 */
function stopBackgroundTasks() {
  console.log('[Background Tasks] Stopping all tasks...');
  scheduledTasks.forEach(task => clearInterval(task));
  scheduledTasks = [];
  console.log('[Background Tasks] ✅ All tasks stopped');
}

/**
 * Get active tasks count
 */
function getActiveTasksCount() {
  return scheduledTasks.length;
}

module.exports = {
  initializeBackgroundTasks,
  stopBackgroundTasks,
  getActiveTasksCount
};
