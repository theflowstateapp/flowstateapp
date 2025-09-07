// Vercel Serverless Function - Catch-all API Handler
export default function handler(req, res) {
  // Log the request for debugging
  console.log(`API Request: ${req.method} ${req.url}`);
  
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.url,
    method: req.method,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/integrations/list',
      'POST /api/integrations/connect/google-calendar',
      'POST /api/integrations/connect/gmail',
      'POST /api/integrations/connect/apple-reminders',
      'POST /api/integrations/connect/todoist',
      'GET /api/integrations/auth/google/callback',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/profile',
      'GET /api/tasks/list',
      'GET /api/projects/list',
      'GET /api/notes/list',
      'POST /api/ai/suggestions',
      'POST /api/ai/voice-process'
    ],
    timestamp: new Date().toISOString()
  });
}
