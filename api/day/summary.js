// GET /api/day/summary
// Returns today's summary and candidate tasks for tomorrow

const { createClient } = require('@supabase/supabase-js');
const { getISTToday, getISTTomorrow, getISTNow } = require('../lib/daily-shutdown-ist');

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
    const now = getISTNow();

    // Get today's completed tasks
    const { data: completedTasks, error: completedError } = await supabase
      .from('tasks')
      .select('id, title, completed_at')
      .eq('workspace_id', workspaceId)
      .eq('completed', true)
      .gte('completed_at', `${today}T00:00:00`)
      .lt('completed_at', `${today}T23:59:59`);

    if (completedError) {
      console.log('No completed tasks found (expected for demo)');
    }

    // Get carry-over tasks (not completed but due <= today)
    const { data: carryOverTasks, error: carryOverError } = await supabase
      .from('tasks')
      .select('id, title, due_at')
      .eq('workspace_id', workspaceId)
      .eq('completed', false)
      .lte('due_at', `${today}T23:59:59`);

    if (carryOverError) {
      console.log('No carry-over tasks found (expected for demo)');
    }

    // Get today's flow minutes from focus sessions
    const { data: focusSessions, error: focusError } = await supabase
      .from('focus_sessions')
      .select('actual_minutes')
      .eq('workspace_id', workspaceId)
      .gte('start_at', `${today}T00:00:00`)
      .lt('start_at', `${today}T23:59:59`)
      .not('actual_minutes', 'is', null);

    if (focusError) {
      console.log('No focus sessions found (expected for demo)');
    }

    // Calculate flow minutes
    const flowMinutes = focusSessions ? 
      focusSessions.reduce((sum, session) => sum + (session.actual_minutes || 0), 0) : 0;

    // Get candidate tasks for tomorrow (top 6 Next/High/Urgent due <= tomorrow)
    const { data: candidateTasks, error: candidateError } = await supabase
      .from('tasks')
      .select('id, title, priority, estimate_mins, context, due_at')
      .eq('workspace_id', workspaceId)
      .eq('completed', false)
      .lte('due_at', `${tomorrow}T23:59:59`)
      .in('priority', ['Next', 'High', 'Urgent'])
      .order('priority', { ascending: false })
      .order('due_at', { ascending: true })
      .limit(6);

    if (candidateError) {
      console.log('No candidate tasks found (expected for demo)');
    }

    // For demo purposes, create mock data if no real data
    const mockCandidateTasks = [
      {
        id: 'task-1',
        title: 'Complete project documentation',
        priority: 'High',
        estimate_mins: 90,
        context: 'Deep Work',
        due_at: `${tomorrow}T17:00:00`
      },
      {
        id: 'task-2',
        title: 'Review team feedback',
        priority: 'Next',
        estimate_mins: 45,
        context: 'Communication',
        due_at: `${tomorrow}T14:00:00`
      },
      {
        id: 'task-3',
        title: 'Prepare presentation slides',
        priority: 'Urgent',
        estimate_mins: 60,
        context: 'Creative',
        due_at: `${tomorrow}T10:00:00`
      },
      {
        id: 'task-4',
        title: 'Update project timeline',
        priority: 'Next',
        estimate_mins: 30,
        context: 'Planning',
        due_at: `${tomorrow}T16:00:00`
      },
      {
        id: 'task-5',
        title: 'Send weekly report',
        priority: 'High',
        estimate_mins: 25,
        context: 'Communication',
        due_at: `${tomorrow}T15:00:00`
      },
      {
        id: 'task-6',
        title: 'Research new tools',
        priority: 'Next',
        estimate_mins: 75,
        context: 'Learning',
        due_at: `${tomorrow}T18:00:00`
      }
    ];

    res.status(200).json({
      today: {
        completedCount: completedTasks?.length || 0,
        carryOverCount: carryOverTasks?.length || 0,
        flowMinutes: flowMinutes
      },
      candidateTasks: candidateTasks || mockCandidateTasks,
      todayDate: today,
      tomorrowDate: tomorrow
    });

  } catch (error) {
    console.error('Day summary error:', error);
    res.status(500).json({ 
      error: 'Failed to get day summary',
      message: error.message 
    });
  }
};
