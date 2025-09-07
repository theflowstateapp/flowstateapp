// Vercel Serverless Function - Todoist Integration
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  // Check if Todoist credentials are configured
  if (!process.env.TODOIST_CLIENT_ID) {
    return res.status(400).json({
      success: false,
      error: 'Todoist integration not configured. Please set TODOIST_CLIENT_ID in environment variables.',
      setup_required: true,
      instructions: {
        step1: 'Go to https://developer.todoist.com/appconsole.html',
        step2: 'Create a new app and get your Client ID and Client Secret',
        step3: 'Add TODOIST_CLIENT_ID and TODOIST_CLIENT_SECRET to Vercel environment variables'
      }
    });
  }

  // Mock connection for now (since we don't have Todoist credentials yet)
  res.status(200).json({
    success: true,
    message: 'Todoist integration ready for setup',
    status: 'credentials_required',
    mockData: {
      projectsCount: 3,
      tasksCount: 15,
      lastSync: new Date().toISOString()
    },
    nextSteps: [
      'Add TODOIST_CLIENT_ID to environment variables',
      'Add TODOIST_CLIENT_SECRET to environment variables',
      'Test Todoist OAuth flow'
    ]
  });
}
