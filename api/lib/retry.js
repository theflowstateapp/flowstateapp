// Simplified retry without external dependencies
async function withDbRetry(fn) {
  // Just execute the function once and let it fail
  return await fn();
}

module.exports = { withDbRetry };