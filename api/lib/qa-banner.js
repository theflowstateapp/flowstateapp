// QA Status Helper for App Banner
// This helper checks if the latest QA run failed and should show a banner

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports.checkQAStatus = async function() {
  try {
    // Get the most recent QA run
    const { data: latestRun, error } = await supabase
      .from('qa_runs')
      .select('ok, ts')
      .order('ts', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch latest QA run:', error);
      return { shouldShowBanner: false, reason: 'error' };
    }

    if (!latestRun) {
      return { shouldShowBanner: false, reason: 'no_data' };
    }

    // Check if QA failed and was within last 24 hours
    const now = new Date();
    const runTime = new Date(latestRun.ts);
    const hoursSinceRun = (now - runTime) / (1000 * 60 * 60);

    if (!latestRun.ok && hoursSinceRun <= 24) {
      return { 
        shouldShowBanner: true, 
        reason: 'qa_failed',
        runTime: latestRun.ts,
        hoursSinceRun: Math.round(hoursSinceRun * 10) / 10
      };
    }

    return { shouldShowBanner: false, reason: 'qa_passed_or_old' };

  } catch (error) {
    console.error('QA Status check error:', error);
    return { shouldShowBanner: false, reason: 'error' };
  }
};

module.exports.renderQABanner = function(qaStatus) {
  if (!qaStatus.shouldShowBanner) {
    return '';
  }

  return `
    <div style="
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 12px 16px;
      margin: 0 0 16px 0;
      color: #991b1b;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    ">
      <span style="font-size: 16px;">⚠️</span>
      <div>
        <strong>QA Alert:</strong> Some systems failed QA in the last run (${qaStatus.hoursSinceRun}h ago). 
        Demo may use Safe Mode.
        <a href="/api/admin/qa" style="color: #991b1b; text-decoration: underline; margin-left: 8px;">
          View Details
        </a>
      </div>
    </div>
  `;
};
