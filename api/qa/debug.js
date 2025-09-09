const { requireQASecret } = require('../lib/qa-auth');

module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-qa-secret');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    requireQASecret(req);

    // Test IST functions
    const { getISTToday, getISTTomorrow } = require('../lib/daily-shutdown-ist');
    
    const debug = {
      ok: true,
      ist: {
        today: getISTToday(),
        tomorrow: getISTTomorrow()
      },
      env: {
        supabaseUrl: !!process.env.SUPABASE_URL,
        supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        qaSecret: !!process.env.QA_SECRET
      }
    };

    res.status(200).json(debug);
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      ok: false,
      error: error.message,
      stack: error.stack
    });
  }
};
