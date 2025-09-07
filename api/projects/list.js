// Vercel Serverless Function - Projects List
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Mock projects data for demo purposes
  const projects = [
    {
      id: 'project-1',
      name: 'Q4 Product Launch',
      description: 'Launch new product features for Q4',
      status: 'active',
      priority: 'high',
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      progress: 65,
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      tasks: {
        total: 15,
        completed: 10,
        pending: 5
      },
      createdAt: '2025-08-15T10:00:00Z',
      updatedAt: '2025-09-06T14:30:00Z'
    },
    {
      id: 'project-2',
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      status: 'planning',
      priority: 'medium',
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      progress: 25,
      teamMembers: ['Sarah Wilson', 'Tom Brown'],
      tasks: {
        total: 8,
        completed: 2,
        pending: 6
      },
      createdAt: '2025-09-01T09:00:00Z',
      updatedAt: '2025-09-05T16:00:00Z'
    },
    {
      id: 'project-3',
      name: 'Mobile App Development',
      description: 'Develop mobile app for iOS and Android',
      status: 'completed',
      priority: 'high',
      startDate: '2025-06-01',
      endDate: '2025-08-31',
      progress: 100,
      teamMembers: ['Alex Chen', 'Maria Garcia', 'David Lee'],
      tasks: {
        total: 20,
        completed: 20,
        pending: 0
      },
      createdAt: '2025-05-15T10:00:00Z',
      updatedAt: '2025-08-31T18:00:00Z'
    }
  ];

  res.status(200).json({
    success: true,
    projects,
    total: projects.length,
    stats: {
      active: projects.filter(p => p.status === 'active').length,
      planning: projects.filter(p => p.status === 'planning').length,
      completed: projects.filter(p => p.status === 'completed').length
    }
  });
}
