// POST /api/brief/commit
// Commits accepted items to tasks and optionally starts focus session

const { createClient } = require('@supabase/supabase-js');
const { getISTToday } = require('../lib/daily-shutdown-ist');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { items, startFirstFocus = false } = req.body;

    // Validate input
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ 
        error: 'Invalid items. Must be an array.' 
      });
    }

    // Use QA user ID for testing
    const userId = 'f6f735ad-aff1-4845-b4eb-1f160d304d70';
    const today = getISTToday();

    let committed = 0;
    let startedSessionId = null;
    let firstAcceptedItem = null;

    // Process accepted items
    for (const item of items) {
      if (item.accept && item.proposal) {
        // Update task with scheduled time
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            start_date: item.proposal.startAt,
            completed_date: item.proposal.endAt
          })
          .eq('id', item.taskId)
          .eq('user_id', userId);

        if (updateError) {
          console.error(`Failed to update task ${item.taskId}:`, updateError);
          continue;
        }

        committed++;
        
        // Track first accepted item for focus session
        if (!firstAcceptedItem) {
          firstAcceptedItem = item;
        }
      }
    }

    // Start focus session if requested and we have an accepted item
    if (startFirstFocus && firstAcceptedItem) {
      try {
        const focusResponse = await fetch(`${process.env.VERCEL_URL || 'https://theflowstateapp.com'}/api/focus/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-QA-Secret': process.env.QA_SECRET
          },
          body: JSON.stringify({
            taskId: firstAcceptedItem.taskId,
            plannedMinutes: firstAcceptedItem.estimateMins || 25,
            intention: 'Morning brief'
          })
        });

        if (focusResponse.ok) {
          const focusData = await focusResponse.json();
          startedSessionId = focusData.sessionId;
        }
      } catch (focusError) {
        console.error('Failed to start focus session:', focusError);
        // Don't fail the whole request if focus start fails
      }
    }

    return res.status(200).json({
      committed,
      startedSessionId
    });

  } catch (error) {
    console.error('Brief commit error:', error);
    return res.status(500).json({ 
      error: 'Failed to commit morning brief',
      message: error.message 
    });
  }
};
