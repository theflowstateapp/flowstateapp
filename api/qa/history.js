const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get limit from query parameter, default to 20
    const limit = parseInt(req.query.limit) || 20;
    const maxLimit = Math.min(limit, 100); // Cap at 100

    // Get the last N QA runs
    const { data: runs, error } = await supabase
      .from('qa_runs')
      .select('ts, ok, total_ms, build_id, steps')
      .order('ts', { ascending: false })
      .limit(maxLimit);

    if (error) {
      console.error('Failed to fetch QA runs history:', error);
      return res.status(500).json({ error: 'Failed to fetch QA runs history' });
    }

    // Transform data to include failing steps count
    const history = runs?.map(run => ({
      ts: run.ts,
      ok: run.ok,
      total_ms: run.total_ms,
      build_id: run.build_id,
      failing_steps_count: run.steps?.filter(step => !step.ok)?.length || 0
    })) || [];

    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json(history);

  } catch (error) {
    console.error('QA History error:', error);
    return res.status(500).json({ 
      error: 'Failed to get QA runs history',
      message: error.message 
    });
  }
};
