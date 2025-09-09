import { supabaseAdmin } from '../../lib/supabase.js';
import { withDbRetry } from '../../lib/retry.js';
import { getISTWeekBounds, formatISTRange } from '../../lib/time-ist.js';

// Mock scheduling engine - in production this would be more sophisticated
const proposeTimeBlocks = (task, strategy = 'balanced', maxBlocksPerDay = 3) => {
  const { estimateMins = 30, context, priority } = task;
  const duration = estimateMins * 60 * 1000; // Convert to milliseconds
  
  // Get next week bounds (Monday to Sunday)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7); // Next week
  const { weekStartUTC, weekEndUTC } = getISTWeekBounds(nextWeek);
  
  // Generate time slots based on strategy
  const slots = [];
  const workHours = { start: 9, end: 17 }; // 9 AM to 5 PM
  
  for (let day = 0; day < 7; day++) {
    const dayDate = new Date(weekStartUTC);
    dayDate.setDate(dayDate.getDate() + day);
    
    // Skip weekends for most strategies
    if (day >= 5 && strategy !== 'mornings') continue;
    
    let daySlots = [];
    
    if (strategy === 'frontload' && day > 2) continue; // Mon-Wed only
    if (strategy === 'mornings') {
      // Morning slots: 9:30 AM - 12:30 PM
      for (let hour = 9.5; hour <= 12.5; hour += 0.5) {
        const slotStart = new Date(dayDate);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration);
        daySlots.push({ start: slotStart, end: slotEnd, priority: priority === 'HIGH' ? 1 : 2 });
      }
    } else {
      // Balanced: spread across work hours
      for (let hour = workHours.start; hour < workHours.end; hour += 0.5) {
        const slotStart = new Date(dayDate);
        slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration);
        daySlots.push({ start: slotStart, end: slotEnd, priority: priority === 'HIGH' ? 1 : 2 });
      }
    }
    
    slots.push(...daySlots.slice(0, maxBlocksPerDay));
  }
  
  // Sort by priority and return top options
  return slots.sort((a, b) => a.priority - b.priority).slice(0, 5);
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }
    const { strategy = 'balanced', maxBlocksPerDay = 3 } = req.body;
    const workspaceId = req.headers['x-workspace-id'] || 'demo-workspace-1';
    
    const sb = supabaseAdmin();
    
    // 1) Select top N tasks to schedule
    const { data: carryOvers } = await withDbRetry(async () => {
      const result = await sb
        .from('tasks')
        .select('id, name, estimated_hours, priority_matrix, deadline_date')
        .eq('workspace_id', workspaceId)
        .neq('status', 'Done')
        .lt('due_at', new Date().toISOString())
        .order('priority_matrix', { ascending: false })
        .limit(5);
      
      if (result.error) throw result.error;
      return result.data;
    });
    
    const { data: highPriorityTasks } = await withDbRetry(async () => {
      const result = await sb
        .from('tasks')
        .select('id, name, estimated_hours, priority_matrix, deadline_date')
        .eq('workspace_id', workspaceId)
        .neq('status', 'Done')
        .is('start_at', null)
        .is('end_at', null)
        .eq('priority_matrix', 'HIGH')
        .order('due_at', { ascending: true })
        .limit(3);
      
      if (result.error) throw result.error;
      return result.data;
    });
    
    const { data: mediumTasks } = await withDbRetry(async () => {
      const result = await sb
        .from('tasks')
        .select('id, name, estimated_hours, priority_matrix, deadline_date')
        .eq('workspace_id', workspaceId)
        .neq('status', 'Done')
        .is('start_at', null)
        .is('end_at', null)
        .eq('priority_matrix', 'MEDIUM')
        .order('due_at', { ascending: true })
        .limit(2);
      
      if (result.error) throw result.error;
      return result.data;
    });
    
    // Combine and prioritize tasks
    const tasksToSchedule = [...carryOvers, ...highPriorityTasks, ...mediumTasks];
    
    // 2) Schedule tasks
    const scheduled = [];
    const skipped = [];
    const usedSlots = new Set();
    
    for (const task of tasksToSchedule) {
      const proposals = proposeTimeBlocks(task, strategy, maxBlocksPerDay);
      
      // Find first non-overlapping slot
      let scheduledSlot = null;
      for (const proposal of proposals) {
        const slotKey = `${proposal.start.toISOString()}-${proposal.end.toISOString()}`;
        if (!usedSlots.has(slotKey)) {
          scheduledSlot = proposal;
          usedSlots.add(slotKey);
          break;
        }
      }
      
      if (scheduledSlot) {
        // Update task with scheduled time
        await withDbRetry(async () => {
          const result = await sb
            .from('tasks')
            .update({
              start_at: scheduledSlot.start.toISOString(),
              end_at: scheduledSlot.end.toISOString()
            })
            .eq('id', task.id);
          
          if (result.error) throw result.error;
        });
        
        scheduled.push({
          id: task.id,
          title: task.name,
          start: scheduledSlot.start.toISOString(),
          end: scheduledSlot.end.toISOString()
        });
      } else {
        skipped.push({
          id: task.id,
          reason: 'No available time slots'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      scheduled,
      skipped,
      strategy,
      maxBlocksPerDay
    });
    
  } catch (error) {
    console.error('Error planning next week:', error);
    res.status(500).json({
      ok: false,
      error: String(error?.message || error)
    });
  }
}
