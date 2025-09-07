// Vercel Serverless Function - Google Calendar OAuth
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  // Generate OAuth URL for Google Calendar
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://theflowstateapp.com/api/integrations/auth/google/callback';
  
  console.log('Environment check:', {
    clientId: clientId ? 'Set' : 'Not set',
    redirectUri: redirectUri ? 'Set' : 'Not set'
  });
  
  if (!clientId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID in environment variables.' 
    });
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `access_type=offline&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `state=${state}&` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;

  console.log('Generated auth URL:', authUrl);

  res.status(200).json({
    success: true,
    authUrl,
    message: 'OAuth URL generated successfully'
  });
}
