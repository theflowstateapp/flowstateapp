const { createClient } = require('@supabase/supabase-js');
const { withDbRetry } = require('../lib/retry');
const { requireQASecret } = require('../lib/qa-auth');
const { getISTToday, getISTTomorrow } = require('../lib/daily-shutdown-ist');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fixed QA workspace ID
const QA_WORKSPACE_ID = 'qa-ws';

// Helper to get IST time with offset
function getISTTimeWithOffset(minutes = 0) {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  return new Date(istTime.getTime() + (minutes * 60 * 1000));
}

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

    const counts = {};

    // Ensure workspace exists
    await withDbRetry(async () => {
      const { data: workspace } = await supabase
        .from('workspaces')
        .upsert({
          id: QA_WORKSPACE_ID,
          name: 'QA Workspace',
          timezone: 'Asia/Kolkata',
          is_demo: true
        }, { onConflict: 'id' })
        .select()
        .single();
      
      counts.workspace = workspace ? 1 : 0;
    });

    // Create areas
    await withDbRetry(async () => {
      const areas = [
        { id: 'a-health', name: 'Health', workspace_id: QA_WORKSPACE_ID },
        { id: 'a-fin', name: 'Finances', workspace_id: QA_WORKSPACE_ID }
      ];

      const { data: areasData } = await supabase
        .from('areas')
        .upsert(areas, { onConflict: 'id' })
        .select();
      
      counts.areas = areasData?.length || 0;
    });

    // Create projects
    await withDbRetry(async () => {
      const projects = [
        { 
          id: 'p-launch', 
          name: 'Website Launch', 
          area_id: 'a-fin',
          workspace_id: QA_WORKSPACE_ID 
        }
      ];

      const { data: projectsData } = await supabase
        .from('projects')
        .upsert(projects, { onConflict: 'id' })
        .select();
      
      counts.projects = projectsData?.length || 0;
    });

    // Create tasks with fixed IDs
    await withDbRetry(async () => {
      const today = getISTToday();
      const tomorrow = getISTTomorrow();
      
      const tasks = [
        {
          id: 't-capture',
          title: 'Capture ideas and tasks',
          priority: 'HIGH',
          context: 'Admin',
          estimate_mins: 15,
          due_at: `${today}T17:00:00`,
          workspace_id: QA_WORKSPACE_ID,
          area_id: 'a-health'
        },
        {
          id: 't-admin',
          title: 'Process emails and admin tasks',
          priority: 'MEDIUM',
          context: 'Admin',
          estimate_mins: 30,
          due_at: `${today}T18:00:00`,
          workspace_id: QA_WORKSPACE_ID,
          area_id: 'a-fin'
        },
        {
          id: 't-deep',
          title: 'Deep work on project documentation',
          priority: 'HIGH',
          context: 'Deep Work',
          estimate_mins: 90,
          due_at: `${tomorrow}T10:00:00`,
          workspace_id: QA_WORKSPACE_ID,
          project_id: 'p-launch'
        },
        {
          id: 't-call',
          title: 'Call with client about requirements',
          priority: 'URGENT',
          context: 'Calls',
          estimate_mins: 45,
          due_at: `${tomorrow}T14:00:00`,
          workspace_id: QA_WORKSPACE_ID,
          area_id: 'a-fin'
        },
        {
          id: 't-review',
          title: 'Review and plan next week',
          priority: 'MEDIUM',
          context: 'Planning',
          estimate_mins: 60,
          due_at: `${tomorrow}T16:00:00`,
          workspace_id: QA_WORKSPACE_ID,
          area_id: 'a-fin'
        }
      ];

      const { data: tasksData } = await supabase
        .from('tasks')
        .upsert(tasks, { onConflict: 'id' })
        .select();
      
      counts.tasks = tasksData?.length || 0;
    });

    // Create habits
    await withDbRetry(async () => {
      const habits = [
        {
          id: 'h-exercise',
          name: 'Exercise',
          frequency: 3,
          frequency_unit: 'week',
          workspace_id: QA_WORKSPACE_ID,
          area_id: 'a-health'
        },
        {
          id: 'h-meditation',
          name: 'Meditation',
          frequency: 5,
          frequency_unit: 'week',
          workspace_id: QA_WORKSPACE_ID,
          area_id: 'a-health'
        }
      ];

      const { data: habitsData } = await supabase
        .from('habits')
        .upsert(habits, { onConflict: 'id' })
        .select();
      
      counts.habits = habitsData?.length || 0;
    });

    // Create habit logs for the last 7 days
    await withDbRetry(async () => {
      const logs = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const logDate = new Date(today);
        logDate.setDate(today.getDate() - i);
        const dateStr = logDate.toISOString().split('T')[0];
        
        // Add some random logs
        if (i % 2 === 0) {
          logs.push({
            habit_id: 'h-exercise',
            logged_at: `${dateStr}T08:00:00`,
            notes: 'Morning workout completed'
          });
        }
        
        if (i % 3 === 0) {
          logs.push({
            habit_id: 'h-meditation',
            logged_at: `${dateStr}T19:00:00`,
            notes: 'Evening meditation session'
          });
        }
      }

      if (logs.length > 0) {
        const { data: logsData } = await supabase
          .from('habit_logs')
          .insert(logs)
          .select();
        
        counts.habit_logs = logsData?.length || 0;
      } else {
        counts.habit_logs = 0;
      }
    });

    // Create journal entry for today
    await withDbRetry(async () => {
      const today = getISTToday();
      
      const journalEntry = {
        id: 'j-today',
        content: 'Today was productive. Completed the QA setup and testing framework. Ready for the next phase of development.',
        mood: '🙂',
        workspace_id: QA_WORKSPACE_ID,
        created_at: `${today}T20:00:00`
      };

      const { data: journalData } = await supabase
        .from('journal')
        .upsert(journalEntry, { onConflict: 'id' })
        .select();
      
      counts.journal = journalData ? 1 : 0;
    });

    res.status(200).json({
      ok: true,
      workspaceId: QA_WORKSPACE_ID,
      counts
    });

  } catch (error) {
    console.error('QA Seed error:', error);
    
    if (error.message === 'Forbidden') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.status(500).json({ 
      error: 'Failed to seed QA data',
      message: error.message 
    });
  }
};
