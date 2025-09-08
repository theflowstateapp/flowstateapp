// GET /api/day/status
// Returns status of today's review and tomorrow's plan

const { createClient } = require('@supabase/supabase-js');
const { getISTToday, getISTTomorrow } = require('../lib/daily-shutdown-ist');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // For demo purposes, use demo workspace
    const workspaceId = 'demo-workspace-1';
    const userId = 'demo-user-1';
    
    const today = getISTToday();
    const tomorrow = getISTTomorrow();

    // Check if today's review exists
    const { data: todayReview, error: reviewError } = await supabase
      .from('day_reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('workspace_id', workspaceId)
      .eq('day', today)
      .single();

    // Check if tomorrow's plan exists
    const { data: tomorrowPlan, error: planError } = await supabase
      .from('day_plans')
      .select('id, task_ids')
      .eq('user_id', userId)
      .eq('workspace_id', workspaceId)
      .eq('day', tomorrow)
      .single();

    res.status(200).json({
      todayReviewExists: !reviewError && todayReview,
      tomorrowPlanExists: !planError && tomorrowPlan,
      today: today,
      tomorrow: tomorrow,
      tomorrowTaskCount: tomorrowPlan?.task_ids?.length || 0
    });

  } catch (error) {
    console.error('Day status error:', error);
    res.status(500).json({ 
      error: 'Failed to get day status',
      message: error.message 
    });
  }
};
