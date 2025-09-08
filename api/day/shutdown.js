// POST /api/day/shutdown
// Saves daily review with highlights, gratitude, and mood

const { createClient } = require('@supabase/supabase-js');
const { getISTToday, getISTNow } = require('../lib/daily-shutdown-ist');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { highlights, gratitude, mood } = req.body;

    // For demo purposes, use demo workspace
    const workspaceId = 'demo-workspace-1';
    const userId = 'demo-user-1';
    
    const today = getISTToday();
    const now = getISTNow();

    // Get today's stats (server-side calculation)
    const { data: completedTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('completed', true)
      .gte('completed_at', `${today}T00:00:00`)
      .lt('completed_at', `${today}T23:59:59`);

    const { data: carryOverTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('completed', false)
      .lte('due_at', `${today}T23:59:59`);

    const { data: focusSessions } = await supabase
      .from('focus_sessions')
      .select('actual_minutes')
      .eq('workspace_id', workspaceId)
      .gte('start_at', `${today}T00:00:00`)
      .lt('start_at', `${today}T23:59:59`)
      .not('actual_minutes', 'is', null);

    const completedCount = completedTasks?.length || 0;
    const carryOverCount = carryOverTasks?.length || 0;
    const flowMinutes = focusSessions ? 
      focusSessions.reduce((sum, session) => sum + (session.actual_minutes || 0), 0) : 0;

    // Prepare review data
    const reviewData = {
      user_id: userId,
      workspace_id: workspaceId,
      day: today,
      completed_tasks: completedCount,
      carry_over_tasks: carryOverCount,
      flow_minutes: flowMinutes,
      highlights: highlights ? highlights.trim().slice(0, 500) : null,
      gratitude: gratitude ? gratitude.trim().slice(0, 500) : null,
      mood: mood ? mood.trim().slice(0, 50) : null,
      created_at: now.toISOString()
    };

    // Upsert the day review
    const { data: review, error: reviewError } = await supabase
      .from('day_reviews')
      .upsert(reviewData, { 
        onConflict: 'user_id,workspace_id,day',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (reviewError) {
      throw new Error(`Failed to save day review: ${reviewError.message}`);
    }

    // Create journal entry
    const journalText = `Daily Shutdown — Highlights: ${highlights || 'None'}. Completed: ${completedCount}, carry-overs: ${carryOverCount}. Flow: ${flowMinutes} min.`;
    
    const { data: journalEntry, error: journalError } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        date: today,
        text: journalText,
        source: 'daily-shutdown',
        created_at: now.toISOString()
      })
      .select()
      .single();

    if (journalError) {
      console.log('Journal entry creation failed (non-critical):', journalError.message);
    }

    res.status(200).json({
      success: true,
      review: {
        id: review.id,
        day: review.day,
        completedCount: review.completed_tasks,
        carryOverCount: review.carry_over_tasks,
        flowMinutes: review.flow_minutes,
        highlights: review.highlights,
        gratitude: review.gratitude,
        mood: review.mood
      },
      journalEntry: journalEntry ? {
        id: journalEntry.id,
        text: journalEntry.text
      } : null
    });

  } catch (error) {
    console.error('Day shutdown error:', error);
    res.status(500).json({ 
      error: 'Failed to save day review',
      message: error.message 
    });
  }
};
