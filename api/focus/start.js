const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to get IST time
function getISTTime() {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
}

// Helper function to add minutes to IST time
function addMinutesToIST(minutes) {
  const istTime = getISTTime();
  return new Date(istTime.getTime() + (minutes * 60 * 1000));
}

module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { taskId, plannedMinutes = 50, intention, ritual } = req.body;
    
    // Use QA user ID for testing
    const workspaceId = 'qa-ws';
    const userId = 'f6f735ad-aff1-4845-b4eb-1f160d304d70'; // QA user ID
    
    // Get task details if taskId provided
    let task = null;
    if (taskId) {
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('id, name, start_date, completed_date')
        .eq('id', taskId)
        .single();
      
      if (taskError && taskError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch task: ${taskError.message}`);
      }
      
      task = taskData;
    }
    
    // Create focus session
    const startAt = getISTTime();
    const targetEnd = addMinutesToIST(plannedMinutes);
    
    // Prepare session data
    const sessionData = {
      user_id: userId,
      workspace_id: workspaceId,
      task_id: taskId || null,
      start_at: startAt.toISOString(),
      planned_minutes: plannedMinutes
    };
    
    // Add intention if provided (trim to 200 chars)
    if (intention && intention.trim()) {
      sessionData.intention = intention.trim().slice(0, 200);
    }
    
    // Add ritual data if provided
    if (ritual && Object.keys(ritual).length > 0) {
      sessionData.ritual = ritual;
      sessionData.prep_done_at = startAt.toISOString();
    }
    
    const { data: session, error: sessionError } = await supabase
      .from('focus_sessions')
      .insert(sessionData)
      .select()
      .single();
    
    if (sessionError) {
      throw new Error(`Failed to create focus session: ${sessionError.message}`);
    }
    
    // Create start event
    const { error: eventError } = await supabase
      .from('focus_events')
      .insert({
        session_id: session.id,
        event_type: 'start',
        notes: `Planned ${plannedMinutes} minutes`
      });
    
    if (eventError) {
      throw new Error(`Failed to create start event: ${eventError.message}`);
    }
    
    res.status(200).json({
      sessionId: session.id,
      task: task ? {
        id: task.id,
        title: task.name,
        startAt: task.start_date,
        endAt: task.completed_date
      } : null,
      startAt: startAt.toISOString(),
      plannedMinutes,
      targetEnd: targetEnd.toISOString(),
      intention: session.intention,
      ritual: session.ritual
    });
    
  } catch (error) {
    console.error('Focus start error:', error);
    res.status(500).json({ 
      error: 'Failed to start focus session',
      message: error.message 
    });
  }
};
