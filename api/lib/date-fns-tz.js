// Simplified date-fns-tz without external dependencies
function utcToZonedTime(date, timeZone) {
  // Simple implementation - just return the date as-is
  return new Date(date);
}

function zonedTimeToUtc(date, timeZone) {
  // Simple implementation - just return the date as-is
  return new Date(date);
}

function format(date, formatStr, options = {}) {
  // Simple implementation - just return ISO string
  return date.toISOString();
}

module.exports = { utcToZonedTime, zonedTimeToUtc, format };
