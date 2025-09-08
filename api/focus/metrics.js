const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to get IST week bounds
function getISTWeekBounds() {
  const now = new Date();
  const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  
  // Get Monday of current week
  const dayOfWeek = istNow.getDay();
  const monday = new Date(istNow);
  monday.setDate(istNow.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);
  
  // Get Sunday of current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    start: monday.toISOString(),
    end: sunday.toISOString()
  };
}

// Helper function to calculate flow score
function calculateFlowScore(sessions) {
  if (sessions.length === 0) return 0;
  
  // Calculate flow minutes (sessions with <= 2 distractions)
  const flowMinutes = sessions
    .filter(s => s.distraction_count <= 2)
    .reduce((sum, s) => sum + (s.actual_minutes || 0), 0);
  
  // Calculate distraction rate
  const totalDistractions = sessions.reduce((sum, s) => sum + s.distraction_count, 0);
  const distractionRate = sessions.length > 0 ? totalDistractions / sessions.length : 0;
  
  // Calculate median session length
  const sessionLengths = sessions.map(s => s.actual_minutes || 0).sort((a, b) => a - b);
  const medianSession = sessionLengths.length > 0 
    ? sessionLengths[Math.floor(sessionLengths.length / 2)]
    : 0;
  
  // Calculate flow score
  const base = Math.min(100, (flowMinutes / 300) * 100); // 300m = 5 hours target
  const penalty = Math.min(30, distractionRate * 10);
  const score = Math.round(Math.max(0, base - penalty));
  
  return {
    score,
    flowMinutes,
    totalMinutes: sessions.reduce((sum, s) => sum + (s.actual_minutes || 0), 0),
    sessionCount: sessions.length,
    avgSession: medianSession,
    distractionRate: Math.round(distractionRate * 100) / 100,
    totalDistractions
  };
}

module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // For demo purposes, use demo workspace
    const workspaceId = 'demo-workspace-1';
    const userId = 'demo-user-1';
    
    // Get current week bounds
    const weekBounds = getISTWeekBounds();
    
    // Get focus sessions for current week
    const { data: sessions, error: sessionsError } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .gte('start_at', weekBounds.start)
      .lte('start_at', weekBounds.end)
      .not('end_at', 'is', null) // Only completed sessions
      .order('start_at', { ascending: false });
    
    if (sessionsError) {
      throw new Error(`Failed to fetch focus sessions: ${sessionsError.message}`);
    }
    
    // Calculate flow metrics
    const flowMetrics = calculateFlowScore(sessions || []);
    
    // Get recent sessions for dashboard
    const { data: recentSessions, error: recentError } = await supabase
      .from('focus_sessions')
      .select(`
        id,
        start_at,
        end_at,
        planned_minutes,
        actual_minutes,
        distraction_count,
        self_rating,
        tasks(id, title)
      `)
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .not('end_at', 'is', null)
      .order('start_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      throw new Error(`Failed to fetch recent sessions: ${recentError.message}`);
    }
    
    res.status(200).json({
      week: {
        start: weekBounds.start,
        end: weekBounds.end,
        ...flowMetrics
      },
      recentSessions: (recentSessions || []).map(session => ({
        id: session.id,
        startAt: session.start_at,
        endAt: session.end_at,
        plannedMinutes: session.planned_minutes,
        actualMinutes: session.actual_minutes,
        distractionCount: session.distraction_count,
        selfRating: session.self_rating,
        task: session.tasks ? {
          id: session.tasks.id,
          title: session.tasks.title
        } : null
      }))
    });
    
  } catch (error) {
    console.error('Focus metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch focus metrics',
      message: error.message 
    });
  }
};
