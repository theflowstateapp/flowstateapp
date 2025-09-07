// Vercel Serverless Function - Dashboard Overview
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Mock dashboard data for demo purposes
  const dashboard = {
    user: {
      name: 'Demo User',
      email: 'demo@flowstate.com',
      avatar: null,
      joinDate: '2025-08-01'
    },
    stats: {
      tasks: {
        total: 12,
        completed: 8,
        pending: 4,
        overdue: 1
      },
      projects: {
        total: 3,
        active: 2,
        completed: 1,
        overdue: 0
      },
      notes: {
        total: 15,
        pinned: 3,
        recent: 5
      },
      integrations: {
        connected: 2,
        available: 4
      }
    },
    recentActivity: [
      {
        id: 'activity-1',
        type: 'task_completed',
        title: 'Completed "Review project proposal"',
        timestamp: '2025-09-06T14:30:00Z',
        icon: 'check-circle'
      },
      {
        id: 'activity-2',
        type: 'note_created',
        title: 'Created note "Meeting Notes - Product Planning"',
        timestamp: '2025-09-06T10:00:00Z',
        icon: 'file-text'
      },
      {
        id: 'activity-3',
        type: 'integration_connected',
        title: 'Connected Google Calendar',
        timestamp: '2025-09-05T16:45:00Z',
        icon: 'calendar'
      }
    ],
    upcomingDeadlines: [
      {
        id: 'deadline-1',
        title: 'Project proposal review',
        type: 'task',
        dueDate: '2025-09-10',
        priority: 'high'
      },
      {
        id: 'deadline-2',
        title: 'Team meeting',
        type: 'event',
        dueDate: '2025-09-08',
        priority: 'medium'
      }
    ],
    quickActions: [
      {
        id: 'action-1',
        title: 'Add Task',
        description: 'Create a new task',
        icon: 'plus',
        action: 'create_task'
      },
      {
        id: 'action-2',
        title: 'Voice Capture',
        description: 'Record voice notes',
        icon: 'mic',
        action: 'voice_capture'
      },
      {
        id: 'action-3',
        title: 'Quick Note',
        description: 'Create a quick note',
        icon: 'edit',
        action: 'quick_note'
      }
    ]
  };

  res.status(200).json({
    success: true,
    dashboard,
    timestamp: new Date().toISOString()
  });
}
