// Simplified date-fns without external dependencies
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date, options = {}) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day - (options.weekStartsOn || 0);
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date, options = {}) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day - (options.weekStartsOn || 0);
  d.setDate(d.getDate() + (6 - diff));
  d.setHours(23, 59, 59, 999);
  return d;
}

module.exports = { startOfDay, endOfDay, startOfWeek, endOfWeek };
