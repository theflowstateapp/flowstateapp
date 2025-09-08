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

// Helper function to calculate minutes between two dates
function calculateMinutes(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return Math.round((end - start) / (1000 * 60));
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
    
    const { sessionId, selfRating } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }
    
    if (selfRating && (selfRating < 1 || selfRating > 5)) {
      return res.status(400).json({ error: 'selfRating must be between 1 and 5' });
    }
    
    // Get current session
    const { data: session, error: sessionError } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) {
      throw new Error(`Failed to fetch session: ${sessionError.message}`);
    }
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.end_at) {
      return res.status(400).json({ error: 'Session already ended' });
    }
    
    // Calculate actual minutes
    const endAt = getISTTime();
    const actualMinutes = calculateMinutes(session.start_at, endAt.toISOString());
    
    // Update session
    const updateData = {
      end_at: endAt.toISOString(),
      actual_minutes: actualMinutes
    };
    
    if (selfRating) {
      updateData.self_rating = selfRating;
    }
    
    const { error: updateError } = await supabase
      .from('focus_sessions')
      .update(updateData)
      .eq('id', sessionId);
    
    if (updateError) {
      throw new Error(`Failed to update session: ${updateError.message}`);
    }
    
    // Create stop event
    const { error: eventError } = await supabase
      .from('focus_events')
      .insert({
        session_id: sessionId,
        type: 'stop',
        payload: { 
          actual_minutes: actualMinutes,
          self_rating: selfRating,
          distraction_count: session.distraction_count
        }
      });
    
    if (eventError) {
      throw new Error(`Failed to create stop event: ${eventError.message}`);
    }
    
    // Get task details if session was linked to a task
    let task = null;
    if (session.task_id) {
      const { data: taskData } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('id', session.task_id)
        .single();
      
      task = taskData;
    }
    
    res.status(200).json({
      success: true,
      session: {
        id: session.id,
        startAt: session.start_at,
        endAt: endAt.toISOString(),
        plannedMinutes: session.planned_minutes,
        actualMinutes: actualMinutes,
        distractionCount: session.distraction_count,
        selfRating: selfRating,
        notes: session.notes
      },
      task: task ? {
        id: task.id,
        title: task.title
      } : null,
      summary: {
        duration: actualMinutes,
        distractions: session.distraction_count,
        efficiency: Math.round((actualMinutes / session.planned_minutes) * 100),
        rating: selfRating
      }
    });
    
  } catch (error) {
    console.error('Focus stop error:', error);
    res.status(500).json({ 
      error: 'Failed to stop focus session',
      message: error.message 
    });
  }
};
