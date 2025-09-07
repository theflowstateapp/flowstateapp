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

// Server utility function
export const scheduleTaskById = async (taskId, startISO, endISO, workspaceId) => {
  try {
    // Verify task ownership
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id, workspace_id')
      .eq('id', taskId)
      .eq('workspace_id', workspaceId)
      .single();

    if (taskError || !task) {
      return { success: false, error: 'Task not found' };
    }

    // Update task with scheduling
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        start_at: new Date(startISO).toISOString(),
        end_at: new Date(endISO).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (updateError) {
      console.error('Error updating task:', updateError);
      return { success: false, error: 'Failed to schedule task' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in scheduleTaskById:', error);
    return { success: false, error: 'Internal server error' };
  }
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { id, startAt, endAt } = req.body;

    if (!id || !startAt || !endAt) {
      return res.status(400).json({ success: false, error: 'Missing required fields: id, startAt, endAt' });
    }

    // Get user from session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const workspaceId = user.id;

    // Use the server utility function
    const result = await scheduleTaskById(id, startAt, endAt, workspaceId);

    if (!result.success) {
      if (result.error === 'Task not found') {
        return res.status(404).json({ success: false, error: result.error });
      }
      return res.status(500).json({ success: false, error: result.error });
    }

    // Log telemetry event
    console.log('TELEMETRY: next_suggested_accept', {
      taskId: id,
      startAt,
      endAt
    });

    res.status(204).end();

  } catch (error) {
    console.error('Error in task scheduling:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule task'
    });
  }
}