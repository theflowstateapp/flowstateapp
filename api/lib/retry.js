async function withDbRetry(fn, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try { 
      return await fn(); 
    } catch (e) {
      lastErr = e;
      const msg = String(e?.message ?? e);
      
      // Common transient signals
      if (
        /ETIMEDOUT|ECONNRESET|SQLSTATE 53300|too many clients|read ECONNRESET|timeout/i.test(msg) &&
        i < attempts - 1
      ) {
        // Exponential backoff with jitter
        const sleep = 150 * Math.pow(2, i) + Math.floor(Math.random() * 100);
        console.warn(`Database retry attempt ${i + 1}/${attempts} after ${sleep}ms: ${msg}`);
        await new Promise(r => setTimeout(r, sleep));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

module.exports = { withDbRetry };
