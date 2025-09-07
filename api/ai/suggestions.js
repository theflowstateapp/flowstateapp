// Vercel Serverless Function - AI Task Suggestions
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { prompt, context } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      error: 'Prompt is required' 
    });
  }

  // Mock AI response for demo purposes
  // In production, this would call OpenAI API
  const suggestions = [
    {
      id: 'suggestion-1',
      type: 'task',
      title: 'Break down complex project into smaller tasks',
      description: 'Consider creating subtasks for better project management',
      priority: 'medium',
      estimatedTime: '2 hours'
    },
    {
      id: 'suggestion-2',
      type: 'reminder',
      title: 'Set deadline reminder',
      description: 'Set a reminder 2 days before the deadline',
      priority: 'high',
      estimatedTime: '5 minutes'
    },
    {
      id: 'suggestion-3',
      type: 'note',
      title: 'Document key decisions',
      description: 'Create a note to track important decisions made',
      priority: 'low',
      estimatedTime: '15 minutes'
    }
  ];

  res.status(200).json({
    success: true,
    suggestions,
    total: suggestions.length,
    context: context || 'general',
    timestamp: new Date().toISOString()
  });
}
