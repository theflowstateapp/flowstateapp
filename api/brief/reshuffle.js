// POST /api/brief/reshuffle
// Re-runs proposals for current items with chosen strategy

const { createClient } = require('@supabase/supabase-js');
const { getISTNow, getISTToday, getMorningWindow, getBalancedWindow } = require('../lib/daily-shutdown-ist');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple time block proposal (reused from day/plan.js)
const proposeTimeBlocks = (task, targetWindow, existingBlocks = []) => {
  const estimateMins = task.estimated_hours ? task.estimated_hours * 60 : 30;
  
  // Find first available slot
  const startTime = new Date(targetWindow.start);
  const endTime = new Date(startTime.getTime() + estimateMins * 60 * 1000);
  
  // Check if it fits in the window
  if (endTime <= targetWindow.end) {
    return {
      startAt: startTime.toISOString(),
      endAt: endTime.toISOString()
    };
  }
  
  return null;
};

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { strategy = 'mornings' } = req.body;

    // Use QA user ID for testing
    const userId = 'f6f735ad-aff1-4845-b4eb-1f160d304d70';
    const today = getISTToday();
    const nowIST = getISTNow();
    
    // Choose window based on strategy
    const targetWindow = strategy === 'mornings' 
      ? getMorningWindow(nowIST) 
      : getBalancedWindow(nowIST);
    
    // Try to load existing day plan for today
    const { data: dayPlan, error: planError } = await supabase
      .from('day_plans')
      .select('task_ids, scheduled')
      .eq('user_id', userId)
      .eq('day', today)
      .single();

    let items = [];

    if (dayPlan && dayPlan.task_ids && dayPlan.task_ids.length > 0) {
      // Load planned tasks
      const { data: plannedTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, name, estimated_hours, priority_matrix, deadline_date, start_date, completed_date')
        .eq('user_id', userId)
        .in('id', dayPlan.task_ids);

      if (tasksError) throw new Error(`Failed to fetch planned tasks: ${tasksError.message}`);

      // Generate new proposals for planned tasks
      items = (plannedTasks || []).map(task => {
        const proposal = proposeTimeBlocks(task, targetWindow);
        return {
          taskId: task.id,
          title: task.name,
          priority: task.priority_matrix || 'Priority 4. Low',
          estimateMins: task.estimated_hours ? task.estimated_hours * 60 : 30,
          context: null,
          dueAt: task.deadline_date,
          proposal: proposal,
          source: 'plan'
        };
      });
    } else {
      // No day plan exists, get fallback candidates
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data: candidateTasks, error: candidatesError } = await supabase
        .from('tasks')
        .select('id, name, estimated_hours, priority_matrix, deadline_date, start_date, completed_date')
        .eq('user_id', userId)
        .neq('status', 'Completed')
        .lte('deadline_date', tomorrow.toISOString().split('T')[0])
        .order('priority_matrix', { ascending: false })
        .limit(6);

      if (candidatesError) throw new Error(`Failed to fetch candidate tasks: ${candidatesError.message}`);

      // Generate new proposals for candidate tasks
      items = (candidateTasks || []).map(task => {
        const proposal = proposeTimeBlocks(task, targetWindow);
        return {
          taskId: task.id,
          title: task.name,
          priority: task.priority_matrix || 'Priority 4. Low',
          estimateMins: task.estimated_hours ? task.estimated_hours * 60 : 30,
          context: null,
          dueAt: task.deadline_date,
          proposal: proposal,
          source: 'candidate'
        };
      });
    }

    // Limit to top 3 items
    items = items.slice(0, 3);

    return res.status(200).json({
      today,
      window: {
        start: targetWindow.start.toISOString(),
        end: targetWindow.end.toISOString()
      },
      items,
      strategy
    });

  } catch (error) {
    console.error('Brief reshuffle error:', error);
    return res.status(500).json({ 
      error: 'Failed to reshuffle morning brief',
      message: error.message 
    });
  }
};
