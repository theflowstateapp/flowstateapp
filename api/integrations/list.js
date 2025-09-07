// Vercel Serverless Function - Integrations List
export default function handler(req, res) {
  // Mock integrations data for now
  const integrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your Google Calendar events',
      status: 'available',
      supported: true,
      icon: 'calendar',
      category: 'calendar'
    },
    {
      id: 'apple-reminders',
      name: 'Apple Reminders',
      description: 'Import reminders from Apple Reminders',
      status: 'available',
      supported: true,
      icon: 'bell',
      category: 'tasks'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Connect your Gmail account',
      status: 'available',
      supported: true,
      icon: 'mail',
      category: 'email'
    },
    {
      id: 'todoist',
      name: 'Todoist',
      description: 'Sync tasks with Todoist',
      status: 'setup_required',
      supported: false,
      icon: 'check-square',
      category: 'tasks'
    }
  ];

  res.status(200).json({
    success: true,
    integrations,
    total: integrations.length
  });
}
