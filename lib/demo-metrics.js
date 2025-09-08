const { createClient } = require('@supabase/supabase-js');
const { getISTWeekBounds, clipDurationMs } = require('./time-ist.js');

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return supabaseClient;
}

/** Scheduled totals for the *displayed* week (Mon–Sun IST) */
async function getScheduledTotalsForWeek(workspaceId, reference) {
  const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);
  const supabase = getSupabaseClient();

  // Pull only blocks overlapping week
  const { data: tasks } = await supabase
    .select('start_at, end_at, priority_matrix')
    .eq('workspace_id', workspaceId)
    .not('start_at', 'is', null)
    .not('end_at', 'is', null)
    .lte('start_at', weekEndUTC.toISOString())
    .gte('end_at', weekStartUTC.toISOString());

  if (!tasks) return { hours: 0, count: 0 };

  // Sum clipped durations within week window
  let totalMs = 0;
  for (const task of tasks) {
    if (!task.start_at || !task.end_at) continue;
    const startAt = new Date(task.start_at);
    const endAt = new Date(task.end_at);
    totalMs += clipDurationMs(startAt, endAt, weekStartUTC, weekEndUTC);
  }
  
  const hours = +(totalMs / (1000 * 60 * 60)).toFixed(1);
  return { hours, count: tasks.length };
}

async function getCountsConsistent(workspaceId, reference) {
  const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);
  const supabase = getSupabaseClient();
  
  const [totalTasksResult, completedThisWeekResult, activeProjectsResult] = await Promise.all([
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
    
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'Done')
      .gte('updated_at', weekStartUTC.toISOString())
      .lte('updated_at', weekEndUTC.toISOString()),
    
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .neq('status', 'Completed')
  ]);

  return {
    totalTasks: totalTasksResult.count || 0,
    completedThisWeek: completedThisWeekResult.count || 0,
    activeProjects: activeProjectsResult.count || 0
  };
}

/** Get tasks for the current IST week with proper filtering */
async function getTasksForISTWeek(workspaceId, reference) {
  const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);
  const supabase = getSupabaseClient();
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      id,
      name,
      status,
      priority_matrix,
      do_date,
      start_at,
      end_at,
      estimated_time,
      context,
      projects(name),
      areas(name)
    `)
    .eq('workspace_id', workspaceId)
    .gte('do_date', weekStartUTC.toISOString().split('T')[0])
    .lte('do_date', weekEndUTC.toISOString().split('T')[0])
    .order('priority_matrix', { ascending: false })
    .order('do_date', { ascending: true });

  return tasks || [];
}

/** Get completed tasks for the current IST week */
async function getCompletedTasksForISTWeek(workspaceId, reference) {
  const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);
  const supabase = getSupabaseClient();
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('name, updated_at')
    .eq('workspace_id', workspaceId)
    .eq('status', 'Done')
    .gte('updated_at', weekStartUTC.toISOString())
    .lte('updated_at', weekEndUTC.toISOString())
    .order('updated_at', { ascending: false })
    .limit(10);

  return tasks || [];
}

/** Get carry-over tasks (not done, due before week start) */
async function getCarryOverTasksForISTWeek(workspaceId, reference) {
  const { weekStartUTC } = getISTWeekBounds(reference);
  const supabase = getSupabaseClient();
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('name, do_date')
    .eq('workspace_id', workspaceId)
    .neq('status', 'Done')
    .lt('do_date', weekStartUTC.toISOString().split('T')[0])
    .order('do_date', { ascending: true })
    .limit(10);

  return tasks || [];
}

/** Get scheduled tasks for agenda view with IST day grouping */
async function getScheduledTasksForISTWeek(workspaceId, reference) {
  const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);
  const supabase = getSupabaseClient();
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      id,
      name,
      priority_matrix,
      start_at,
      end_at,
      context,
      projects(name),
      areas(name)
    `)
    .eq('workspace_id', workspaceId)
    .not('start_at', 'is', null)
    .not('end_at', 'is', null)
    .gte('start_at', weekStartUTC.toISOString())
    .lte('end_at', weekEndUTC.toISOString())
    .order('start_at', { ascending: true });

  return tasks || [];
}

module.exports = {
  getScheduledTotalsForWeek,
  getCountsConsistent,
  getTasksForISTWeek,
  getCompletedTasksForISTWeek,
  getCarryOverTasksForISTWeek,
  getScheduledTasksForISTWeek
};
