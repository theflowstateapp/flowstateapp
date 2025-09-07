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
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      title,
      description,
      paraBucket,
      projectId,
      areaId,
      resourceId,
      status = 'TODO',
      priority = 'MEDIUM',
      dueAt,
      estimateMins,
      context,
      startAt,
      endAt,
      tags
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    // Get user from session (simplified for demo)
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

    // Create task
    const taskData = {
      workspace_id: workspaceId,
      name: title,
      description: description || null,
      status: status,
      priority_matrix: priority === 'URGENT' ? ['Priority 1'] : 
                     priority === 'HIGH' ? ['Priority 1'] :
                     priority === 'MEDIUM' ? ['Priority 2'] : ['Priority 3'],
      do_date: dueAt ? new Date(dueAt).toISOString().split('T')[0] : null,
      estimated_time: estimateMins || null,
      context: context || null,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      end_at: endAt ? new Date(endAt).toISOString() : null,
      tags: tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: task, error: createError } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (createError) {
      console.error('Error creating task:', createError);
      return res.status(500).json({ success: false, error: 'Failed to create task' });
    }

    // Log telemetry event if scheduled
    if (startAt && endAt) {
      console.log('TELEMETRY: timeblock_accepted', {
        startAt,
        endAt,
        estimateMins: estimateMins || 30,
        priority
      });
    }

    res.status(201).json({
      success: true,
      task: {
        id: task.id,
        title: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                 task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW',
        dueAt: task.do_date,
        estimateMins: task.estimated_time,
        context: task.context,
        startAt: task.start_at,
        endAt: task.end_at,
        tags: task.tags,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }
    });

  } catch (error) {
    console.error('Error in task creation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
}
