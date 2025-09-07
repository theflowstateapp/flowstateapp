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

const isToday = (date) => {
  const istDate = toIST(date);
  const today = toIST(new Date());
  return istDate.toDateString() === today.toDateString();
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });
};

const formatDayTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });
};

const getRelativeDay = (dateStr) => {
  const date = new Date(dateStr);
  const istDate = toIST(date);
  const today = toIST(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (istDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (istDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return istDate.toLocaleDateString('en-US', { weekday: 'short' });
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
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

    // Get today's date in IST
    const todayIST = toIST(new Date());
    const todayStart = new Date(todayIST);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayIST);
    todayEnd.setHours(23, 59, 59, 999);

    // Get tasks due today (IST) and not DONE
    const { data: todayTasks, error: todayError } = await supabase
      .from('tasks')
      .select(`
        id,
        name,
        priority_matrix,
        context,
        do_date,
        start_at,
        end_at,
        projects(name),
        areas(name)
      `)
      .eq('workspace_id', workspaceId)
      .neq('status', 'Done')
      .gte('do_date', todayStart.toISOString().split('T')[0])
      .lte('do_date', todayEnd.toISOString().split('T')[0])
      .order('priority_matrix', { ascending: false })
      .order('do_date', { ascending: true });

    if (todayError) {
      console.error('Error fetching today tasks:', todayError);
      return res.status(500).json({ success: false, error: 'Failed to fetch today tasks' });
    }

    let tasks = todayTasks || [];

    // If less than 5 tasks, add near-due tasks within next 7 days
    if (tasks.length < 5) {
      const nextWeek = new Date(todayEnd);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data: nearDueTasks, error: nearDueError } = await supabase
        .from('tasks')
        .select(`
          id,
          name,
          priority_matrix,
          context,
          do_date,
          start_at,
          end_at,
          projects(name),
          areas(name)
        `)
        .eq('workspace_id', workspaceId)
        .neq('status', 'Done')
        .gt('do_date', todayEnd.toISOString().split('T')[0])
        .lte('do_date', nextWeek.toISOString().split('T')[0])
        .order('priority_matrix', { ascending: false })
        .order('do_date', { ascending: true })
        .limit(8 - tasks.length);

      if (!nearDueError && nearDueTasks) {
        tasks = [...tasks, ...nearDueTasks];
      }
    }

    // Clamp to 8 items max
    tasks = tasks.slice(0, 8);

    // Format tasks for display
    const formattedTasks = tasks.map(task => {
      const priority = task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                      task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW';
      
      let timeWindow = '';
      if (task.start_at && task.end_at) {
        timeWindow = `${formatTime(task.start_at)}–${formatTime(task.end_at)}`;
      } else if (task.do_date && isToday(new Date(task.do_date))) {
        // If due today, show "due hh:mm" if there's a specific time
        const dueDate = new Date(task.do_date);
        if (dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0) {
          timeWindow = `due ${dueDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
          })}`;
        } else {
          timeWindow = 'Today';
        }
      } else {
        timeWindow = getRelativeDay(task.do_date);
      }

      return {
        id: task.id,
        title: task.name,
        priority,
        context: task.context,
        timeWindow,
        projectName: task.projects?.name,
        areaName: task.areas?.name
      };
    });

    res.status(200).json({
      success: true,
      tasks: formattedTasks
    });

  } catch (error) {
    console.error('Error in today tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today tasks'
    });
  }
}
