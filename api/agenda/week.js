import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Timezone utilities for Asia/Kolkata
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

const toIST = (date) => {
  if (!date) return null;
  const utcDate = new Date(date);
  return new Date(utcDate.getTime() + IST_OFFSET);
};

const getWeekStart = (date, offset = 0) => {
  const istDate = toIST(date);
  const day = istDate.getDay();
  const diff = istDate.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  istDate.setDate(diff + offset);
  istDate.setHours(0, 0, 0, 0);
  return new Date(istDate.getTime() - IST_OFFSET);
};

const getWeekEnd = (date, offset = 0) => {
  const startWeek = getWeekStart(date, offset);
  const endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 6);
  endWeek.setHours(23, 59, 59, 999);
  return new Date(endWeek.getTime() - IST_OFFSET);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { offset = 0 } = req.query;

    // Get user from session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const workspaceId = user.id;

    // Get week range
    const now = new Date();
    const weekStart = getWeekStart(now, parseInt(offset));
    const weekEnd = getWeekEnd(now, parseInt(offset));

    // Get scheduled tasks for the week
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        id,
        name,
        priority_matrix,
        context,
        start_at,
        end_at,
        projects(name),
        areas(name)
      `)
      .eq('workspace_id', workspaceId)
      .not('start_at', 'is', null)
      .not('end_at', 'is', null)
      .gte('start_at', weekStart.toISOString())
      .lte('end_at', weekEnd.toISOString())
      .order('start_at', { ascending: true });

    if (tasksError) {
      console.error('Error fetching scheduled tasks:', tasksError);
      return res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
    }

    // Group tasks by day
    const schedule = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      
      const dayTasks = (tasks || []).filter(task => {
        const taskDate = new Date(task.start_at);
        return taskDate.toDateString() === dayDate.toDateString();
      }).map(task => ({
        id: task.id,
        title: task.name,
        priority: task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                 task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW',
        context: task.context,
        startAt: task.start_at,
        endAt: task.end_at,
        projectName: task.projects?.name,
        areaName: task.areas?.name
      }));

      schedule.push({
        date: dayDate.toISOString(),
        dayName: dayNames[i],
        tasks: dayTasks
      });
    }

    // Log telemetry event
    console.log('TELEMETRY: agenda_viewed', {
      weekStart: weekStart.toISOString(),
      taskCount: tasks?.length || 0
    });

    res.status(200).json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error('Error in week agenda:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load week agenda'
    });
  }
}
