// Simplified demo metrics without Supabase dependency
function getCompletedTasksForISTWeek(workspaceId) {
  // Return empty array for mock mode
  return [];
}

function getCarryOverTasksForISTWeek(workspaceId) {
  // Return empty array for mock mode
  return [];
}

function getScheduledTotalsForWeek(workspaceId) {
  // Return mock totals
  return { totalHours: 2, totalMinutes: 30 };
}

module.exports = { 
  getCompletedTasksForISTWeek, 
  getCarryOverTasksForISTWeek, 
  getScheduledTotalsForWeek 
};