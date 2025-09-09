const { createClient } = require('@supabase/supabase-js');
const { requireQASecret } = require('../lib/qa-auth');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    requireQASecret(req);

    // Check what tables exist and their structure
    const tables = ['profiles', 'life_areas', 'areas', 'tasks', 'projects', 'workspaces'];
    const results = {};

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        results[table] = {
          exists: !error,
          error: error?.message,
          sampleData: data?.[0] || null
        };
      } catch (e) {
        results[table] = {
          exists: false,
          error: e.message
        };
      }
    }

    res.status(200).json({
      ok: true,
      tables: results
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
