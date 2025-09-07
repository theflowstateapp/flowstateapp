// Vercel Serverless Function - User Profile
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Mock user profile for demo purposes
  const user = {
    id: 'demo-user-123',
    email: 'demo@flowstate.com',
    name: 'Demo User',
    avatar: null,
    preferences: {
      theme: 'light',
      notifications: true,
      timezone: 'UTC',
      language: 'en'
    },
    stats: {
      tasksCompleted: 42,
      projectsActive: 3,
      notesCreated: 15,
      integrationsConnected: 2
    },
    createdAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    user
  });
}
