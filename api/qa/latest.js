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

    // Get the most recent QA run
    const { data: latestRun, error } = await supabase
      .from('qa_runs')
      .select('ok, ts, build_id, total_ms, steps')
      .order('ts', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch latest QA run:', error);
      return res.status(500).json({ error: 'Failed to fetch latest QA run' });
    }

    if (!latestRun) {
      return res.status(404).json({ error: 'No QA runs found' });
    }

    // Extract failing step names
    const failingSteps = latestRun.steps
      ?.filter(step => !step.ok)
      ?.map(step => step.name) || [];

    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).json({
      ok: latestRun.ok,
      ts: latestRun.ts,
      build_id: latestRun.build_id,
      total_ms: latestRun.total_ms,
      failing_steps: failingSteps
    });

  } catch (error) {
    console.error('QA Latest error:', error);
    return res.status(500).json({ 
      error: 'Failed to get latest QA run',
      message: error.message 
    });
  }
};
