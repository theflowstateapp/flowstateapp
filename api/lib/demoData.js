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

export const toIST = (date) => {
  if (!date) return null;
  const utcDate = new Date(date);
  return new Date(utcDate.getTime() + IST_OFFSET);
};

export const getNowIST = () => {
  return toIST(new Date());
};

export const getStartOfWeekIST = (date = new Date()) => {
  const istDate = toIST(date);
  const day = istDate.getDay();
  const diff = istDate.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  istDate.setDate(diff);
  istDate.setHours(0, 0, 0, 0);
  return new Date(istDate.getTime() - IST_OFFSET);
};

export const getEndOfWeekIST = (date = new Date()) => {
  const startWeek = getStartOfWeekIST(date);
  const endWeek = new Date(startWeek);
  endWeek.setDate(endWeek.getDate() + 6);
  endWeek.setHours(23, 59, 59, 999);
  return new Date(endWeek.getTime() - IST_OFFSET);
};

export const isTodayIST = (date) => {
  const istDate = toIST(date);
  const today = getNowIST();
  return istDate.toDateString() === today.toDateString();
};

// Get demo workspace
export const getDemoWorkspace = async () => {
  try {
    const today = getNowIST();
    const todayStr = today.toISOString().split('T')[0];
    
    // First try to find workspace seeded today
    const { data: todayWorkspace, error: todayError } = await supabase
      .from('profiles')
      .select('*')
      .eq('isDemo', true)
      .gte('seededAt', todayStr)
      .single();

    if (!todayError && todayWorkspace) {
      return todayWorkspace;
    }

    // Fallback to any demo workspace
    const { data: anyWorkspace, error: anyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('isDemo', true)
      .single();

    if (!anyError && anyWorkspace) {
      return anyWorkspace;
    }

    return null;
  } catch (error) {
    console.error('Error fetching demo workspace:', error);
    return null;
  }
};

// Get counts for dashboard
export const getCounts = async (workspaceId, nowIST) => {
  try {
    const weekStart = getStartOfWeekIST(nowIST);
    const weekEnd = getEndOfWeekIST(nowIST);

    // Total tasks
    const { count: totalTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);

    // Completed this week
    const { count: completedThisWeek } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'Done')
      .gte('updated_at', weekStart.toISOString())
      .lte('updated_at', weekEnd.toISOString());

    // Active projects
    const { count: activeProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .neq('status', 'Completed');

    // Active streaks (habits with current streak > 0)
    const { data: habits } = await supabase
      .from('habits')
      .select('id')
      .eq('workspace_id', workspaceId);

    let activeStreaks = 0;
    if (habits && habits.length > 0) {
      // This is simplified - in a real implementation, you'd calculate actual streaks
      activeStreaks = habits.length;
    }

    return {
      totalTasks: totalTasks || 0,
      completedThisWeek: completedThisWeek || 0,
      activeProjects: activeProjects || 0,
      activeStreaks: activeStreaks
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
    return {
      totalTasks: 0,
      completedThisWeek: 0,
      activeProjects: 0,
      activeStreaks: 0
    };
  }
};

// Get today's tasks with fallback
export const getTodayTasks = async (workspaceId, nowIST, opts = {}) => {
  try {
    const todayStart = new Date(nowIST);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(nowIST);
    todayEnd.setHours(23, 59, 59, 999);

    // Get tasks due today
    const { data: todayTasks } = await supabase
      .from('tasks')
      .select(`
        id,
        name,
        priority_matrix,
        context,
        do_date,
        start_at,
        end_at,
        estimated_time,
        projects(name),
        areas(name)
      `)
      .eq('workspace_id', workspaceId)
      .neq('status', 'Done')
      .gte('do_date', todayStart.toISOString().split('T')[0])
      .lte('do_date', todayEnd.toISOString().split('T')[0])
      .order('priority_matrix', { ascending: false })
      .order('do_date', { ascending: true });

    let tasks = todayTasks || [];

    // If less than 5 tasks, add near-due tasks within next 7 days
    if (tasks.length < 5) {
      const nextWeek = new Date(todayEnd);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data: nearDueTasks } = await supabase
        .from('tasks')
        .select(`
          id,
          name,
          priority_matrix,
          context,
          do_date,
          start_at,
          end_at,
          estimated_time,
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

      if (nearDueTasks) {
        tasks = [...tasks, ...nearDueTasks];
      }
    }

    // Clamp to 8 items max
    tasks = tasks.slice(0, 8);

    // Format tasks
    const formattedTasks = tasks.map(task => {
      const priority = task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                      task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW';
      
      let timeWindow = '';
      if (task.start_at && task.end_at) {
        timeWindow = `${formatTime(task.start_at)}–${formatTime(task.end_at)}`;
      } else if (task.do_date && isTodayIST(new Date(task.do_date))) {
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
        areaName: task.areas?.name,
        estimateMins: task.estimated_time
      };
    });

    return {
      today: formattedTasks,
      fallback: []
    };
  } catch (error) {
    console.error('Error fetching today tasks:', error);
    return { today: [], fallback: [] };
  }
};

// Get board groups
export const getBoardGroups = async (workspaceId) => {
  try {
    const { data: tasks } = await supabase
      .from('tasks')
      .select(`
        id,
        name,
        status,
        priority_matrix,
        do_date,
        projects(name),
        areas(name)
      `)
      .eq('workspace_id', workspaceId)
      .order('priority_matrix', { ascending: false })
      .order('created_at', { ascending: true });

    const groups = {
      inbox: [],
      next: [],
      inProgress: [],
      done: []
    };

    if (tasks) {
      tasks.forEach(task => {
        const priority = task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                        task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW';
        
        const formattedTask = {
          id: task.id,
          title: task.name,
          priority,
          dueAt: task.do_date,
          projectName: task.projects?.name,
          areaName: task.areas?.name
        };

        switch (task.status) {
          case 'Inbox':
            groups.inbox.push(formattedTask);
            break;
          case 'Next':
            groups.next.push(formattedTask);
            break;
          case 'In Progress':
            groups.inProgress.push(formattedTask);
            break;
          case 'Done':
            groups.done.push(formattedTask);
            break;
        }
      });
    }

    // Limit to first 5 each
    Object.keys(groups).forEach(key => {
      groups[key] = groups[key].slice(0, 5);
    });

    return groups;
  } catch (error) {
    console.error('Error fetching board groups:', error);
    return { inbox: [], next: [], inProgress: [], done: [] };
  }
};

// Get agenda week
export const getAgendaWeek = async (workspaceId, weekStartIST) => {
  try {
    const weekEnd = getEndOfWeekIST(weekStartIST);

    const { data: tasks } = await supabase
      .from('tasks')
      .select(`
        id,
        name,
        priority_matrix,
        start_at,
        end_at,
        projects(name),
        areas(name)
      `)
      .eq('workspace_id', workspaceId)
      .not('start_at', 'is', null)
      .not('end_at', 'is', null)
      .gte('start_at', weekStartIST.toISOString())
      .lte('end_at', weekEnd.toISOString())
      .order('start_at', { ascending: true });

    const weekDays = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStartIST);
      dayDate.setDate(weekStartIST.getDate() + i);
      
      const dayTasks = (tasks || []).filter(task => {
        const taskDate = new Date(task.start_at);
        return taskDate.toDateString() === dayDate.toDateString();
      }).map(task => ({
        start: new Date(task.start_at),
        end: new Date(task.end_at),
        title: task.name,
        priority: task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                 task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW',
        projectOrArea: task.projects?.name || task.areas?.name
      }));

      weekDays.push({
        day: dayNames[i],
        slots: dayTasks
      });
    }

    return weekDays;
  } catch (error) {
    console.error('Error fetching agenda week:', error);
    return [];
  }
};

// Get habits snapshot
export const getHabitsSnapshot = async (workspaceId, nowIST) => {
  try {
    const { data: habits } = await supabase
      .from('habits')
      .select(`
        id,
        name,
        cadence,
        target_per_period,
        unit
      `)
      .eq('workspace_id', workspaceId)
      .limit(6);

    const habitsWithStreaks = [];

    if (habits) {
      for (const habit of habits) {
        // Get last 7 days of logs
        const sevenDaysAgo = new Date(nowIST);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: logs } = await supabase
          .from('habit_logs')
          .select('date, value')
          .eq('habit_id', habit.id)
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: true });

        // Build last 7 days array
        const last7 = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(nowIST);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const hasLog = logs?.some(log => log.date === dateStr && log.value > 0);
          last7.push(hasLog);
        }

        // Calculate current streak
        let currentStreak = 0;
        for (let i = last7.length - 1; i >= 0; i--) {
          if (last7[i]) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Calculate longest streak (simplified)
        let longestStreak = 0;
        let tempStreak = 0;
        for (const day of last7) {
          if (day) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }

        habitsWithStreaks.push({
          name: habit.name,
          last7,
          currentStreak,
          longestStreak,
          weeklyTarget: habit.target_per_period ? `${habit.target_per_period}×/${habit.cadence}` : habit.cadence
        });
      }
    }

    return habitsWithStreaks;
  } catch (error) {
    console.error('Error fetching habits snapshot:', error);
    return [];
  }
};

// Get journal entries
export const getJournalEntries = async (workspaceId, range = 10) => {
  try {
    const { data: entries } = await supabase
      .from('journal_entries')
      .select(`
        id,
        date,
        content,
        mood,
        tags
      `)
      .eq('workspace_id', workspaceId)
      .order('date', { ascending: false })
      .limit(range);

    return (entries || []).map(entry => ({
      date: new Date(entry.date),
      excerpt: entry.content ? entry.content.substring(0, 180) + (entry.content.length > 180 ? '...' : '') : '',
      mood: entry.mood,
      tags: entry.tags || []
    }));
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }
};

// Get weekly preview
export const getWeeklyPreview = async (workspaceId, weekStart, weekEnd) => {
  try {
    // Get completed tasks this week
    const { data: completedTasks } = await supabase
      .from('tasks')
      .select('name, updated_at')
      .eq('workspace_id', workspaceId)
      .eq('status', 'Done')
      .gte('updated_at', weekStart.toISOString())
      .lte('updated_at', weekEnd.toISOString())
      .order('updated_at', { ascending: false })
      .limit(10);

    // Get carry-over tasks (not done, due before week start)
    const { data: carryOverTasks } = await supabase
      .from('tasks')
      .select('name, do_date')
      .eq('workspace_id', workspaceId)
      .neq('status', 'Done')
      .lt('do_date', weekStart.toISOString().split('T')[0])
      .order('do_date', { ascending: true })
      .limit(10);

    return {
      completedTop5: (completedTasks || []).slice(0, 5).map(task => task.name),
      carryOversTop5: (carryOverTasks || []).slice(0, 5).map(task => task.name),
      highlights: [
        'Great team collaboration on Q4 launch',
        'Successful AI integration testing',
        'Improved work-life balance this week'
      ]
    };
  } catch (error) {
    console.error('Error fetching weekly preview:', error);
    return {
      completedTop5: [],
      carryOversTop5: [],
      highlights: []
    };
  }
};

// Get workspace settings
export const getWorkspaceSettings = async (workspaceId) => {
  try {
    const { data: prefs } = await supabase
      .from('workspace_preferences')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();

    return {
      plan: 'Pro',
      billingProvider: 'Razorpay',
      timezone: 'Asia/Kolkata',
      prefs: prefs || {
        weekdayStart: '09:00',
        weekdayEnd: '18:00',
        weekendStart: '10:00',
        weekendEnd: '16:00'
      }
    };
  } catch (error) {
    console.error('Error fetching workspace settings:', error);
    return {
      plan: 'Pro',
      billingProvider: 'Razorpay',
      timezone: 'Asia/Kolkata',
      prefs: {
        weekdayStart: '09:00',
        weekdayEnd: '18:00',
        weekendStart: '10:00',
        weekendEnd: '16:00'
      }
    };
  }
};

// Helper functions
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });
};

const getRelativeDay = (dateStr) => {
  const date = new Date(dateStr);
  const istDate = toIST(date);
  const today = getNowIST();
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