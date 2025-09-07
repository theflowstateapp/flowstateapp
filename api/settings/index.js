// Vercel Serverless Function - User Settings
export default function handler(req, res) {
  if (req.method === 'GET') {
    // Get user settings
    const settings = {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        desktop: false
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false
      },
      integrations: {
        googleCalendar: true,
        gmail: false,
        appleReminders: false,
        todoist: false
      },
      preferences: {
        timezone: 'UTC',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      },
      accessibility: {
        highContrast: false,
        fontSize: 'medium',
        reducedMotion: false
      }
    };

    res.status(200).json({
      success: true,
      settings
    });
  } else if (req.method === 'PUT') {
    // Update user settings
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({
        success: false,
        error: 'Settings data is required'
      });
    }

    // Mock settings update
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
