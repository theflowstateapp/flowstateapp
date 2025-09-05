// Task Analytics System - Track usage patterns and provide insights
export const TaskAnalytics = {
  // Analytics data structure
  analytics: {
    taskCreation: {
      totalTasks: 0,
      tasksByType: {},
      tasksByPriority: {},
      tasksByContext: {},
      averageCompletionTime: 0,
      completionRate: 0
    },
    aiUsage: {
      totalAnalyses: 0,
      successfulAnalyses: 0,
      accuracyRate: 0,
      mostUsedPatterns: [],
      templateUsage: {}
    },
    productivity: {
      tasksCompletedToday: 0,
      tasksCompletedThisWeek: 0,
      tasksCompletedThisMonth: 0,
      averageTasksPerDay: 0,
      peakProductivityHours: [],
      mostProductiveDays: []
    },
    patterns: {
      commonTaskTypes: [],
      commonPriorities: [],
      commonContexts: [],
      commonTags: [],
      timePatterns: [],
      durationPatterns: []
    }
  },

  // Track task creation
  trackTaskCreation: (taskData) => {
    const analytics = TaskAnalytics.analytics;
    
    // Increment total tasks
    analytics.taskCreation.totalTasks++;
    
    // Track by type
    if (taskData.type) {
      analytics.taskCreation.tasksByType[taskData.type] = 
        (analytics.taskCreation.tasksByType[taskData.type] || 0) + 1;
    }
    
    // Track by priority
    if (taskData.priority) {
      analytics.taskCreation.tasksByPriority[taskData.priority] = 
        (analytics.taskCreation.tasksByPriority[taskData.priority] || 0) + 1;
    }
    
    // Track by context
    if (taskData.context) {
      analytics.taskCreation.tasksByContext[taskData.context] = 
        (analytics.taskCreation.tasksByContext[taskData.context] || 0) + 1;
    }
    
    // Track patterns
    TaskAnalytics.updatePatterns(taskData);
    
    // Save to localStorage
    TaskAnalytics.saveAnalytics();
  },

  // Track AI analysis usage
  trackAIAnalysis: (input, suggestions, success) => {
    const analytics = TaskAnalytics.analytics;
    
    analytics.aiUsage.totalAnalyses++;
    
    if (success) {
      analytics.aiUsage.successfulAnalyses++;
    }
    
    // Calculate accuracy rate
    analytics.aiUsage.accuracyRate = 
      (analytics.aiUsage.successfulAnalyses / analytics.aiUsage.totalAnalyses) * 100;
    
    // Track most used patterns
    const patterns = TaskAnalytics.extractPatterns(input);
    patterns.forEach(pattern => {
      const existingPattern = analytics.aiUsage.mostUsedPatterns.find(p => p.pattern === pattern);
      if (existingPattern) {
        existingPattern.count++;
      } else {
        analytics.aiUsage.mostUsedPatterns.push({ pattern, count: 1 });
      }
    });
    
    // Sort patterns by usage
    analytics.aiUsage.mostUsedPatterns.sort((a, b) => b.count - a.count);
    
    TaskAnalytics.saveAnalytics();
  },

  // Track template usage
  trackTemplateUsage: (templateName) => {
    const analytics = TaskAnalytics.analytics;
    
    analytics.aiUsage.templateUsage[templateName] = 
      (analytics.aiUsage.templateUsage[templateName] || 0) + 1;
    
    TaskAnalytics.saveAnalytics();
  },

  // Update patterns based on task data
  updatePatterns: (taskData) => {
    const analytics = TaskAnalytics.analytics;
    
    // Update common task types
    if (taskData.type) {
      TaskAnalytics.updateCommonItems(analytics.patterns.commonTaskTypes, taskData.type);
    }
    
    // Update common priorities
    if (taskData.priority) {
      TaskAnalytics.updateCommonItems(analytics.patterns.commonPriorities, taskData.priority);
    }
    
    // Update common contexts
    if (taskData.context) {
      TaskAnalytics.updateCommonItems(analytics.patterns.commonContexts, taskData.context);
    }
    
    // Update common tags
    if (taskData.tags && Array.isArray(taskData.tags)) {
      taskData.tags.forEach(tag => {
        TaskAnalytics.updateCommonItems(analytics.patterns.commonTags, tag);
      });
    }
    
    // Update time patterns
    if (taskData.reminderTime) {
      TaskAnalytics.updateCommonItems(analytics.patterns.timePatterns, taskData.reminderTime);
    }
    
    // Update duration patterns
    if (taskData.estimatedHours) {
      TaskAnalytics.updateCommonItems(analytics.patterns.durationPatterns, taskData.estimatedHours);
    }
  },

  // Helper to update common items list
  updateCommonItems: (list, item) => {
    const existingItem = list.find(i => i.name === item);
    if (existingItem) {
      existingItem.count++;
    } else {
      list.push({ name: item, count: 1 });
    }
    
    // Sort by count
    list.sort((a, b) => b.count - a.count);
    
    // Keep only top 10
    if (list.length > 10) {
      list.splice(10);
    }
  },

  // Extract patterns from input text
  extractPatterns: (input) => {
    const lowerInput = input.toLowerCase();
    const patterns = [];
    
    // Time patterns
    if (lowerInput.includes('am') || lowerInput.includes('pm')) {
      patterns.push('time_mentioned');
    }
    
    // Date patterns
    if (lowerInput.includes('today') || lowerInput.includes('tomorrow') || lowerInput.includes('next')) {
      patterns.push('date_mentioned');
    }
    
    // Priority patterns
    if (lowerInput.includes('urgent') || lowerInput.includes('important')) {
      patterns.push('priority_mentioned');
    }
    
    // Type patterns
    if (lowerInput.includes('meeting') || lowerInput.includes('call')) {
      patterns.push('meeting_mentioned');
    }
    
    // Context patterns
    if (lowerInput.includes('work') || lowerInput.includes('home')) {
      patterns.push('context_mentioned');
    }
    
    return patterns;
  },

  // Get productivity insights
  getProductivityInsights: () => {
    const analytics = TaskAnalytics.analytics;
    
    return {
      // Task creation insights
      taskCreation: {
        totalTasks: analytics.taskCreation.totalTasks,
        mostCommonType: analytics.taskCreation.tasksByType ? 
          Object.keys(analytics.taskCreation.tasksByType).sort((a, b) => 
            analytics.taskCreation.tasksByType[b] - analytics.taskCreation.tasksByType[a]
          )[0] : null,
        mostCommonPriority: analytics.taskCreation.tasksByPriority ? 
          Object.keys(analytics.taskCreation.tasksByPriority).sort((a, b) => 
            analytics.taskCreation.tasksByPriority[b] - analytics.taskCreation.tasksByPriority[a]
          )[0] : null,
        mostCommonContext: analytics.taskCreation.tasksByContext ? 
          Object.keys(analytics.taskCreation.tasksByContext).sort((a, b) => 
            analytics.taskCreation.tasksByContext[b] - analytics.taskCreation.tasksByContext[a]
          )[0] : null
      },
      
      // AI usage insights
      aiUsage: {
        totalAnalyses: analytics.aiUsage.totalAnalyses,
        accuracyRate: analytics.aiUsage.accuracyRate,
        mostUsedPatterns: analytics.aiUsage.mostUsedPatterns.slice(0, 5),
        mostUsedTemplates: Object.entries(analytics.aiUsage.templateUsage)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }))
      },
      
      // Pattern insights
      patterns: {
        commonTaskTypes: analytics.patterns.commonTaskTypes.slice(0, 5),
        commonPriorities: analytics.patterns.commonPriorities.slice(0, 5),
        commonContexts: analytics.patterns.commonContexts.slice(0, 5),
        commonTags: analytics.patterns.commonTags.slice(0, 5),
        timePatterns: analytics.patterns.timePatterns.slice(0, 5),
        durationPatterns: analytics.patterns.durationPatterns.slice(0, 5)
      }
    };
  },

  // Get personalized recommendations
  getRecommendations: () => {
    const insights = TaskAnalytics.getProductivityInsights();
    const recommendations = [];
    
    // Task type recommendations
    if (insights.taskCreation.mostCommonType) {
      recommendations.push({
        type: 'task_type',
        title: 'Optimize Task Types',
        description: `You create many ${insights.taskCreation.mostCommonType} tasks. Consider using templates for efficiency.`,
        icon: '📋',
        priority: 'medium'
      });
    }
    
    // Priority recommendations
    if (insights.taskCreation.mostCommonPriority === 'Critical') {
      recommendations.push({
        type: 'priority',
        title: 'Priority Management',
        description: 'You have many critical tasks. Consider if some could be high priority instead.',
        icon: '🚨',
        priority: 'high'
      });
    }
    
    // AI usage recommendations
    if (insights.aiUsage.accuracyRate < 70) {
      recommendations.push({
        type: 'ai_usage',
        title: 'Improve AI Accuracy',
        description: 'Try being more specific in your task descriptions for better AI analysis.',
        icon: '🤖',
        priority: 'medium'
      });
    }
    
    // Template recommendations
    if (insights.aiUsage.mostUsedTemplates.length > 0) {
      const topTemplate = insights.aiUsage.mostUsedTemplates[0];
      recommendations.push({
        type: 'template',
        title: 'Template Efficiency',
        description: `You frequently use ${topTemplate.name}. Consider creating custom templates.`,
        icon: '📝',
        priority: 'low'
      });
    }
    
    return recommendations;
  },

  // Save analytics to localStorage
  saveAnalytics: () => {
    try {
      localStorage.setItem('taskAnalytics', JSON.stringify(TaskAnalytics.analytics));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  },

  // Load analytics from localStorage
  loadAnalytics: () => {
    try {
      const saved = localStorage.getItem('taskAnalytics');
      if (saved) {
        TaskAnalytics.analytics = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  },

  // Reset analytics
  resetAnalytics: () => {
    TaskAnalytics.analytics = {
      taskCreation: {
        totalTasks: 0,
        tasksByType: {},
        tasksByPriority: {},
        tasksByContext: {},
        averageCompletionTime: 0,
        completionRate: 0
      },
      aiUsage: {
        totalAnalyses: 0,
        successfulAnalyses: 0,
        accuracyRate: 0,
        mostUsedPatterns: [],
        templateUsage: {}
      },
      productivity: {
        tasksCompletedToday: 0,
        tasksCompletedThisWeek: 0,
        tasksCompletedThisMonth: 0,
        averageTasksPerDay: 0,
        peakProductivityHours: [],
        mostProductiveDays: []
      },
      patterns: {
        commonTaskTypes: [],
        commonPriorities: [],
        commonContexts: [],
        commonTags: [],
        timePatterns: [],
        durationPatterns: []
      }
    };
    TaskAnalytics.saveAnalytics();
  }
};

// Initialize analytics on load
TaskAnalytics.loadAnalytics();
