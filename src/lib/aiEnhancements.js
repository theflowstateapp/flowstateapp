// CAIO Agent Task: AI Feature Enhancements
// Enhanced AI capabilities for LifeOS

export const AIEnhancements = {
  // Advanced Task Categorization
  categorizeTask: (taskText) => {
    const categories = {
      work: ['meeting', 'project', 'deadline', 'office', 'client'],
      personal: ['family', 'friend', 'home', 'hobby', 'personal'],
      health: ['exercise', 'gym', 'doctor', 'health', 'fitness'],
      learning: ['study', 'learn', 'course', 'book', 'education'],
      finance: ['money', 'budget', 'payment', 'bill', 'financial']
    };

    const text = taskText.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    return 'general';
  },

  // Smart Priority Detection
  detectPriority: (taskText) => {
    const highPriority = ['urgent', 'asap', 'immediately', 'critical'];
    const lowPriority = ['sometime', 'eventually', 'low priority'];
    
    const text = taskText.toLowerCase();
    if (highPriority.some(keyword => text.includes(keyword))) return 'high';
    if (lowPriority.some(keyword => text.includes(keyword))) return 'low';
    return 'medium';
  },

  // Due Date Suggestion
  suggestDueDate: (taskText) => {
    const text = taskText.toLowerCase();
    const now = new Date();
    
    if (text.includes('today')) return now;
    if (text.includes('tomorrow')) return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (text.includes('this week')) return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (text.includes('next week')) return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Default 3 days
  },

  // Productivity Insights
  generateInsights: (tasks) => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      completionRate,
      totalTasks: total,
      completedTasks: completed,
      recommendation: completionRate < 50 ? 'Consider breaking tasks into smaller chunks' : 'Great job! Keep up the momentum!'
    };
  },

  // Smart Suggestions
  generateSuggestions: (context) => {
    const suggestions = [];
    
    if (context.tasks.length === 0) {
      suggestions.push('Start by creating your first task');
    } else if (context.tasks.filter(t => t.status === 'completed').length === 0) {
      suggestions.push('Try completing a task to build momentum');
    } else {
      suggestions.push('Great progress! What would you like to work on next?');
    }
    
    return suggestions;
  }
};

