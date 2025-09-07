import { createClient } from '@supabase/supabase-js';
import {
  proposeTimeBlocks,
  getExistingScheduledBlocks,
  getWorkspacePreferences,
  toIST
} from '../../lib/scheduling.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { estimateMins, priority, context, exclude } = req.body;

    // Get user from session (simplified for demo)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Extract user ID from token (simplified)
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const workspaceId = user.id;

    // Get workspace preferences
    const prefs = await getWorkspacePreferences(workspaceId);

    // Get existing scheduled blocks for next 10 days
    const now = new Date();
    const endDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const existingBlocks = await getExistingScheduledBlocks(workspaceId, now, endDate);

    // Propose time blocks
    const proposals = await proposeTimeBlocks({
      now,
      timezone: prefs.timezone,
      estimateMins: estimateMins || 30,
      priority: priority || 'MEDIUM',
      preferredContexts: context ? [context] : [],
      exclude: exclude || [],
      existingBlocks,
      prefs: {
        weekdayStart: prefs.weekday_start,
        weekdayEnd: prefs.weekday_end,
        weekendStart: prefs.weekend_start,
        weekendEnd: prefs.weekend_end
      }
    });

    // Log telemetry event
    console.log('TELEMETRY: timeblock_proposed', {
      count: proposals.length,
      estimateMins: estimateMins || 30,
      priority: priority || 'MEDIUM',
      context: context || null
    });

    res.status(200).json({
      success: true,
      proposals
    });

  } catch (error) {
    console.error('Error in schedule propose:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to propose time blocks'
    });
  }
}
