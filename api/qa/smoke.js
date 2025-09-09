const { requireQASecret } = require('../lib/qa-auth');
const { runSmoke } = require('../lib/qa-smoke');

module.exports = async function handler(req, res) {
  try {
    // Set headers
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Site-Build', process.env.VERCEL_GIT_COMMIT_SHA || 'local');
    res.setHeader('X-QA', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-QA-Secret');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Require QA secret
    requireQASecret(req);

    // Run the smoke test
    const report = await runSmoke();

    res.status(200).json(report);

  } catch (error) {
    console.error('QA Smoke test error:', error);
    
    if (error.message === 'Forbidden') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.status(500).json({ 
      ok: false,
      error: 'Smoke test failed',
      message: error.message 
    });
  }
};
