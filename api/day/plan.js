// POST /api/day/plan
// Plans tomorrow's tasks with time blocks

const { createClient } = require('@supabase/supabase-js');
const { getISTTomorrow, getISTNow, getMorningWindow, getBalancedWindow } = require('../lib/daily-shutdown-ist');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple time block proposal (in a real app, this would be more sophisticated)
const proposeTimeBlocks = (task, targetWindow) => {
  const { estimateMins, context, priority } = task;
  
  // Simple algorithm: find first available slot
  const startTime = new Date(targetWindow.start);
  const endTime = new Date(startTime.getTime() + estimateMins * 60 * 1000);
  
  // Check if it fits in the window
  if (endTime <= targetWindow.end) {
    return {
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      context: context,
      priority: priority
    };
  }
  
  return null;
};

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { taskIds, strategy = 'balanced' } = req.body;
    const commit = req.query.commit === '1';

    // Validate input
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0 || taskIds.length > 3) {
      return res.status(400).json({ 
        error: 'Invalid taskIds. Must be an array of 1-3 task IDs.' 
      });
    }

    // For demo purposes, use demo workspace
    const workspaceId = 'demo-workspace-1';
    const userId = 'demo-user-1';
    
    const tomorrow = getISTTomorrow();
    const now = getISTNow();

    // Get task details
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, name, estimated_hours, priority_matrix')
      .eq('user_id', userId)
      .in('id', taskIds);

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    if (!tasks || tasks.length !== taskIds.length) {
      return res.status(400).json({ 
        error: 'Some tasks not found or not accessible.' 
      });
    }

    // Determine target window based on strategy
    const targetWindow = strategy === 'mornings' ? 
      getMorningWindow(new Date(tomorrow)) : 
      getBalancedWindow(new Date(tomorrow));

    // Propose time blocks for each task
    const planned = [];
    const unplanned = [];
    const scheduled = [];

    tasks.forEach((task, index) => {
      const proposal = proposeTimeBlocks(task, targetWindow);
      
      if (proposal) {
        planned.push({
          taskId: task.id,
          title: task.name,
          start: proposal.start,
          end: proposal.end,
          context: proposal.context,
          priority: proposal.priority,
          committed: false
        });

        scheduled.push({
          taskId: task.id,
          startAt: proposal.start,
          endAt: proposal.end
        });

        // If commit=true, update the task with the scheduled time
        if (commit) {
          supabase
            .from('tasks')
            .update({
              start_at: proposal.start,
              end_at: proposal.end
            })
            .eq('id', task.id)
            .then(({ error }) => {
              if (error) {
                console.log(`Failed to commit task ${task.id}:`, error.message);
              }
            });

          planned[planned.length - 1].committed = true;
        }
      } else {
        unplanned.push({
          taskId: task.id,
          title: task.name,
          reason: 'No available time slot'
        });
      }
    });

    // Save the day plan
    const planData = {
      user_id: userId,
      workspace_id: workspaceId,
      day: tomorrow,
      task_ids: taskIds,
      scheduled: scheduled.length > 0 ? scheduled : null,
      created_at: now.toISOString()
    };

    const { data: plan, error: planError } = await supabase
      .from('day_plans')
      .upsert(planData, { 
        onConflict: 'user_id,workspace_id,day',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (planError) {
      throw new Error(`Failed to save day plan: ${planError.message}`);
    }

    res.status(200).json({
      success: true,
      planned: planned,
      unplanned: unplanned,
      plan: {
        id: plan.id,
        day: plan.day,
        taskIds: plan.task_ids,
        scheduled: plan.scheduled
      },
      strategy: strategy,
      committed: commit
    });

  } catch (error) {
    console.error('Day plan error:', error);
    res.status(500).json({ 
      error: 'Failed to create day plan',
      message: error.message 
    });
  }
};
