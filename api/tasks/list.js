// Vercel Serverless Function - Tasks List with Supabase
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Get tasks from database
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Tasks fetch error:', error);
      // Fallback to mock data if database is not set up
      const mockTasks = [
        {
          id: 'task-1',
          name: 'Review project proposal',
          description: 'Review the Q4 project proposal and provide feedback',
          status: 'In Progress',
          priority_matrix: 'Priority 1. Important & Urgent',
          do_date: '2025-09-10',
          tags: ['project', 'review'],
          created_at: '2025-09-05T10:00:00Z',
          updated_at: '2025-09-06T14:30:00Z'
        },
        {
          id: 'task-2',
          name: 'Grocery shopping',
          description: 'Buy ingredients for weekend meal prep',
          status: 'Next',
          priority_matrix: 'Priority 3. Not Important & Urgent',
          do_date: '2025-09-08',
          tags: ['shopping', 'food'],
          created_at: '2025-09-05T15:00:00Z',
          updated_at: '2025-09-05T15:00:00Z'
        }
      ];

      return res.status(200).json({
        success: true,
        tasks: mockTasks,
        total: mockTasks.length,
        stats: {
          pending: mockTasks.filter(t => t.status === 'Next').length,
          in_progress: mockTasks.filter(t => t.status === 'In Progress').length,
          completed: mockTasks.filter(t => t.status === 'Done').length
        },
        note: 'Using mock data - database not configured'
      });
    }

    const stats = {
      pending: tasks.filter(t => t.status === 'Next').length,
      in_progress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Done').length
    };

    res.status(200).json({
      success: true,
      tasks: tasks || [],
      total: tasks?.length || 0,
      stats
    });

  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
