// Simplified time-ist without external dependencies
const IST = "Asia/Kolkata";

function getISTWeekBounds() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + 1); // Monday
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

function formatISTRange() {
  const { start, end } = getISTWeekBounds();
  return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
}

function clipDurationMs(durationMs) {
  return Math.max(0, Math.min(durationMs, 8 * 60 * 60 * 1000)); // Max 8 hours
}

module.exports = { 
  getISTWeekBounds, 
  formatISTRange, 
  clipDurationMs,
  IST 
};