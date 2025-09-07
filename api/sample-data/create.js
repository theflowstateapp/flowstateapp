import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      error: 'User ID is required' 
    });
  }

  try {
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

    // Sample data for the user (matching actual schema)
    const sampleData = {
      tasks: [
        {
          user_id: userId,
          name: 'Complete project proposal',
          description: 'Write the executive summary and technical requirements for the Q4 product launch',
          status: 'In Progress',
          priority_matrix: 'Priority 1. Important & Urgent',
          do_date: '2025-09-10',
          deadline_date: '2025-09-10',
          is_important: true,
          is_urgent: true,
          dependency_report: 'Actionable',
          tags: ['work', 'project', 'high-priority'],
          notes: 'This is a critical task for the Q4 launch'
        },
        {
          user_id: userId,
          name: 'Review team feedback',
          description: 'Go through all feedback from the design team and implement changes',
          status: 'Done',
          priority_matrix: 'Priority 2. Important & Not Urgent',
          do_date: '2025-09-05',
          completed_date: '2025-09-05',
          is_important: true,
          is_urgent: false,
          dependency_report: 'Actionable',
          tags: ['work', 'review', 'completed'],
          notes: 'Successfully completed all feedback implementation'
        },
        {
          user_id: userId,
          name: 'Prepare presentation slides',
          description: 'Create slides for the upcoming client presentation',
          status: 'Next',
          priority_matrix: 'Priority 1. Important & Urgent',
          do_date: '2025-09-12',
          deadline_date: '2025-09-12',
          is_important: true,
          is_urgent: true,
          dependency_report: 'Actionable',
          tags: ['work', 'presentation', 'client'],
          notes: 'Need to include latest product updates'
        },
        {
          user_id: userId,
          name: 'Call client for follow-up',
          description: 'Discuss project timeline and next steps with the main client',
          status: 'Next',
          priority_matrix: 'Priority 2. Important & Not Urgent',
          do_date: '2025-09-08',
          is_important: true,
          is_urgent: false,
          dependency_report: 'Actionable',
          tags: ['work', 'client', 'communication'],
          notes: 'Schedule for 30 minutes'
        },
        {
          user_id: userId,
          name: 'Update project documentation',
          description: 'Add latest changes to project wiki and documentation',
          status: 'Inbox',
          priority_matrix: 'Priority 4. Low',
          do_date: '2025-09-15',
          is_important: false,
          is_urgent: false,
          dependency_report: 'Actionable',
          tags: ['work', 'documentation', 'maintenance'],
          notes: 'Can be done when time permits'
        }
      ],
      projects: [
        {
          user_id: userId,
          title: 'Q4 Product Launch',
          description: 'Launch new product features for Q4 including AI integration and mobile app',
          status: 'In Progress',
          priority: 'High',
          start_date: '2025-09-01',
          due_date: '2025-12-31',
          progress: 65,
          tags: ['product', 'launch', 'ai'],
          color: '#3B82F6'
        },
        {
          user_id: userId,
          title: 'Website Redesign',
          description: 'Complete redesign of company website with modern UI/UX',
          status: 'Not Started',
          priority: 'Medium',
          start_date: '2025-10-01',
          due_date: '2025-11-30',
          progress: 25,
          tags: ['website', 'design', 'ui'],
          color: '#10B981'
        },
        {
          user_id: userId,
          title: 'Mobile App Development',
          description: 'Develop mobile app for iOS and Android platforms',
          status: 'Completed',
          priority: 'High',
          start_date: '2025-06-01',
          due_date: '2025-08-31',
          completed_date: '2025-08-31',
          progress: 100,
          tags: ['mobile', 'app', 'development'],
          color: '#8B5CF6'
        }
      ],
      goals: [
        {
          user_id: userId,
          title: 'Complete Q4 Product Launch',
          description: 'Successfully launch all planned features for Q4',
          status: 'In Progress',
          priority: 'High',
          target_date: '2025-12-31',
          progress: 65,
          tags: ['work', 'product', 'launch'],
          icon: 'rocket'
        },
        {
          user_id: userId,
          title: 'Learn AI Development',
          description: 'Master AI development skills and implement AI features',
          status: 'In Progress',
          priority: 'Medium',
          target_date: '2025-11-30',
          progress: 30,
          tags: ['learning', 'ai', 'development'],
          icon: 'brain'
        },
        {
          user_id: userId,
          title: 'Improve Work-Life Balance',
          description: 'Better manage time and reduce work stress',
          status: 'In Progress',
          priority: 'Medium',
          target_date: '2025-12-31',
          progress: 50,
          tags: ['personal', 'balance', 'wellness'],
          icon: 'balance'
        }
      ],
      habits: [
        {
          user_id: userId,
          name: 'Daily Exercise',
          description: 'Exercise for at least 30 minutes every day',
          frequency: 'daily',
          target_count: 1,
          current_streak: 7,
          longest_streak: 15,
          is_active: true
        },
        {
          user_id: userId,
          name: 'Morning Meditation',
          description: 'Meditate for 10 minutes every morning',
          frequency: 'daily',
          target_count: 1,
          current_streak: 12,
          longest_streak: 25,
          is_active: true
        },
        {
          user_id: userId,
          name: 'Read Books',
          description: 'Read for at least 30 minutes before bed',
          frequency: 'daily',
          target_count: 1,
          current_streak: 5,
          longest_streak: 20,
          is_active: true
        }
      ],
      journal_entries: [
        {
          user_id: userId,
          title: 'Great Progress Today',
          content: 'Made significant progress on the Q4 product launch. The team is really coming together and the AI integration is looking promising. Feeling optimistic about the upcoming deadline.',
          mood: 'happy',
          tags: ['work', 'progress', 'team'],
          is_private: false
        },
        {
          user_id: userId,
          title: 'Learning AI Development',
          content: 'Spent the morning learning about machine learning algorithms. It\'s challenging but exciting. The possibilities are endless when it comes to AI integration.',
          mood: 'excited',
          tags: ['learning', 'ai', 'development'],
          is_private: false
        },
        {
          user_id: userId,
          title: 'Work-Life Balance',
          content: 'Trying to find a better balance between work and personal life. Started implementing the Pomodoro technique and it\'s helping with focus.',
          mood: 'thoughtful',
          tags: ['balance', 'productivity', 'focus'],
          is_private: false
        }
      ]
    };

    // Insert sample data into respective tables
    const results = {};

    // Insert tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .insert(sampleData.tasks);

    if (tasksError) {
      console.error('Tasks error:', tasksError);
      results.tasks = { error: tasksError.message };
    } else {
      results.tasks = { success: true, count: sampleData.tasks.length };
    }

    // Insert projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .insert(sampleData.projects);

    if (projectsError) {
      console.error('Projects error:', projectsError);
      results.projects = { error: projectsError.message };
    } else {
      results.projects = { success: true, count: sampleData.projects.length };
    }

    // Insert goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('goals')
      .insert(sampleData.goals);

    if (goalsError) {
      console.error('Goals error:', goalsError);
      results.goals = { error: goalsError.message };
    } else {
      results.goals = { success: true, count: sampleData.goals.length };
    }

    // Insert habits
    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .insert(sampleData.habits);

    if (habitsError) {
      console.error('Habits error:', habitsError);
      results.habits = { error: habitsError.message };
    } else {
      results.habits = { success: true, count: sampleData.habits.length };
    }

    // Insert journal entries
    const { data: journalData, error: journalError } = await supabase
      .from('journal_entries')
      .insert(sampleData.journal_entries);

    if (journalError) {
      console.error('Journal error:', journalError);
      results.journal_entries = { error: journalError.message };
    } else {
      results.journal_entries = { success: true, count: sampleData.journal_entries.length };
    }

    return res.status(200).json({
      success: true,
      message: 'Sample data created successfully',
      results: results,
      userId: userId
    });

  } catch (error) {
    console.error('Sample data creation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
