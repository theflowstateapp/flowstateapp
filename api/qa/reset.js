const { createClient } = require('@supabase/supabase-js');
const { withDbRetry } = require('../lib/retry');
const { requireQASecret } = require('../lib/qa-auth');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fixed QA workspace ID
const QA_WORKSPACE_ID = 'qa-ws';

module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
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

    const deleted = {};

    // Delete demo rows for QA workspace in order (respecting foreign keys)
    await withDbRetry(async () => {
      // Delete focus events first (references focus_sessions)
      const { count: focusEventsCount } = await supabase
        .from('focus_events')
        .delete()
        .eq('session_id', supabase.from('focus_sessions').select('id').eq('workspace_id', QA_WORKSPACE_ID));
      deleted.focus_events = focusEventsCount || 0;
    });

    await withDbRetry(async () => {
      // Delete focus sessions
      const { count: focusSessionsCount } = await supabase
        .from('focus_sessions')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.focus_sessions = focusSessionsCount || 0;
    });

    await withDbRetry(async () => {
      // Delete habit logs
      const { count: habitLogsCount } = await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', supabase.from('habits').select('id').eq('workspace_id', QA_WORKSPACE_ID));
      deleted.habit_logs = habitLogsCount || 0;
    });

    await withDbRetry(async () => {
      // Delete habits
      const { count: habitsCount } = await supabase
        .from('habits')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.habits = habitsCount || 0;
    });

    await withDbRetry(async () => {
      // Delete journal entries
      const { count: journalCount } = await supabase
        .from('journal')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.journal = journalCount || 0;
    });

    await withDbRetry(async () => {
      // Delete day reviews
      const { count: dayReviewsCount } = await supabase
        .from('day_reviews')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.day_reviews = dayReviewsCount || 0;
    });

    await withDbRetry(async () => {
      // Delete day plans
      const { count: dayPlansCount } = await supabase
        .from('day_plans')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.day_plans = dayPlansCount || 0;
    });

    await withDbRetry(async () => {
      // Delete tasks
      const { count: tasksCount } = await supabase
        .from('tasks')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.tasks = tasksCount || 0;
    });

    await withDbRetry(async () => {
      // Delete projects
      const { count: projectsCount } = await supabase
        .from('projects')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.projects = projectsCount || 0;
    });

    await withDbRetry(async () => {
      // Delete areas
      const { count: areasCount } = await supabase
        .from('areas')
        .delete()
        .eq('workspace_id', QA_WORKSPACE_ID);
      deleted.areas = areasCount || 0;
    });

    await withDbRetry(async () => {
      // Delete goals/resources if they exist
      try {
        const { count: goalsCount } = await supabase
          .from('goals')
          .delete()
          .eq('workspace_id', QA_WORKSPACE_ID);
        deleted.goals = goalsCount || 0;
      } catch (e) {
        // Table might not exist
        deleted.goals = 0;
      }
    });

    await withDbRetry(async () => {
      try {
        const { count: resourcesCount } = await supabase
          .from('resources')
          .delete()
          .eq('workspace_id', QA_WORKSPACE_ID);
        deleted.resources = resourcesCount || 0;
      } catch (e) {
        // Table might not exist
        deleted.resources = 0;
      }
    });

    res.status(200).json({
      ok: true,
      deleted
    });

  } catch (error) {
    console.error('QA Reset error:', error);
    
    if (error.message === 'Forbidden') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.status(500).json({ 
      error: 'Failed to reset QA data',
      message: error.message 
    });
  }
};
// QA System - Force redeployment
