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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
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

    // Get highest priority non-DONE task without startAt
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId)
      .neq('status', 'Done')
      .is('start_at', null)
      .order('priority_matrix', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ success: true, task: null });
    }

    const task = tasks[0];
    const suggestedTask = {
      id: task.id,
      title: task.name,
      priority: task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
               task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW',
      context: task.context,
      estimateMins: task.estimated_time
    };

    res.status(200).json({
      success: true,
      task: suggestedTask
    });

  } catch (error) {
    console.error('Error in next suggested task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get next suggested task'
    });
  }
}
