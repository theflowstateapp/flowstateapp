// Project Analytics System - Track project patterns and provide insights
export const ProjectAnalytics = {
  // Analytics data structure
  analytics: {
    projectCreation: {
      totalProjects: 0,
      projectsByType: {},
      projectsByCategory: {},
      projectsByArea: {},
      averageDuration: 0,
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
      projectsCompletedToday: 0,
      projectsCompletedThisWeek: 0,
      projectsCompletedThisMonth: 0,
      averageProjectsPerDay: 0,
      peakProductivityHours: [],
      mostProductiveDays: []
    },
    patterns: {
      commonProjectTypes: [],
      commonCategories: [],
      commonAreas: [],
      commonTags: [],
      durationPatterns: [],
      budgetPatterns: []
    }
  },

  // Track project creation
  trackProjectCreation: (projectData) => {
    const analytics = ProjectAnalytics.analytics;
    
    // Increment total projects
    analytics.projectCreation.totalProjects++;
    
    // Track by type
    if (projectData.type) {
      analytics.projectCreation.projectsByType[projectData.type] = 
        (analytics.projectCreation.projectsByType[projectData.type] || 0) + 1;
    }
    
    // Track by category
    if (projectData.category) {
      analytics.projectCreation.projectsByCategory[projectData.category] = 
        (analytics.projectCreation.projectsByCategory[projectData.category] || 0) + 1;
    }
    
    // Track by area
    if (projectData.area) {
      analytics.projectCreation.projectsByArea[projectData.area] = 
        (analytics.projectCreation.projectsByArea[projectData.area] || 0) + 1;
    }
    
    // Track patterns
    ProjectAnalytics.updatePatterns(projectData);
    
    // Save to localStorage
    ProjectAnalytics.saveAnalytics();
  },

  // Track AI analysis usage
  trackAIAnalysis: (input, suggestions, success) => {
    const analytics = ProjectAnalytics.analytics;
    
    analytics.aiUsage.totalAnalyses++;
    
    if (success) {
      analytics.aiUsage.successfulAnalyses++;
    }
    
    // Calculate accuracy rate
    analytics.aiUsage.accuracyRate = 
      (analytics.aiUsage.successfulAnalyses / analytics.aiUsage.totalAnalyses) * 100;
    
    // Track most used patterns
    const patterns = ProjectAnalytics.extractPatterns(input);
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
    
    ProjectAnalytics.saveAnalytics();
  },

  // Track template usage
  trackTemplateUsage: (templateName) => {
    const analytics = ProjectAnalytics.analytics;
    
    analytics.aiUsage.templateUsage[templateName] = 
      (analytics.aiUsage.templateUsage[templateName] || 0) + 1;
    
    ProjectAnalytics.saveAnalytics();
  },

  // Update patterns based on project data
  updatePatterns: (projectData) => {
    const analytics = ProjectAnalytics.analytics;
    
    // Update common project types
    if (projectData.type) {
      ProjectAnalytics.updateCommonItems(analytics.patterns.commonProjectTypes, projectData.type);
    }
    
    // Update common categories
    if (projectData.category) {
      ProjectAnalytics.updateCommonItems(analytics.patterns.commonCategories, projectData.category);
    }
    
    // Update common areas
    if (projectData.area) {
      ProjectAnalytics.updateCommonItems(analytics.patterns.commonAreas, projectData.area);
    }
    
    // Update common tags
    if (projectData.tags && Array.isArray(projectData.tags)) {
      projectData.tags.forEach(tag => {
        ProjectAnalytics.updateCommonItems(analytics.patterns.commonTags, tag);
      });
    }
    
    // Update duration patterns
    if (projectData.estimatedDuration) {
      ProjectAnalytics.updateCommonItems(analytics.patterns.durationPatterns, projectData.estimatedDuration);
    }
    
    // Update budget patterns
    if (projectData.budget) {
      ProjectAnalytics.updateCommonItems(analytics.patterns.budgetPatterns, projectData.budget);
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
    
    // Project type patterns
    if (lowerInput.includes('campaign') || lowerInput.includes('marketing')) {
      patterns.push('marketing_mentioned');
    }
    
    if (lowerInput.includes('product') || lowerInput.includes('launch')) {
      patterns.push('product_mentioned');
    }
    
    if (lowerInput.includes('research') || lowerInput.includes('study')) {
      patterns.push('research_mentioned');
    }
    
    if (lowerInput.includes('event') || lowerInput.includes('conference')) {
      patterns.push('event_mentioned');
    }
    
    // Duration patterns
    if (lowerInput.includes('month') || lowerInput.includes('week') || lowerInput.includes('day')) {
      patterns.push('duration_mentioned');
    }
    
    // Budget patterns
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('$')) {
      patterns.push('budget_mentioned');
    }
    
    // Priority patterns
    if (lowerInput.includes('urgent') || lowerInput.includes('important')) {
      patterns.push('priority_mentioned');
    }
    
    return patterns;
  },

  // Get productivity insights
  getProductivityInsights: () => {
    const analytics = ProjectAnalytics.analytics;
    
    return {
      // Project creation insights
      projectCreation: {
        totalProjects: analytics.projectCreation.totalProjects,
        mostCommonType: analytics.projectCreation.projectsByType ? 
          Object.keys(analytics.projectCreation.projectsByType).sort((a, b) => 
            analytics.projectCreation.projectsByType[b] - analytics.projectCreation.projectsByType[a]
          )[0] : null,
        mostCommonCategory: analytics.projectCreation.projectsByCategory ? 
          Object.keys(analytics.projectCreation.projectsByCategory).sort((a, b) => 
            analytics.projectCreation.projectsByCategory[b] - analytics.projectCreation.projectsByCategory[a]
          )[0] : null,
        mostCommonArea: analytics.projectCreation.projectsByArea ? 
          Object.keys(analytics.projectCreation.projectsByArea).sort((a, b) => 
            analytics.projectCreation.projectsByArea[b] - analytics.projectCreation.projectsByArea[a]
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
        commonProjectTypes: analytics.patterns.commonProjectTypes.slice(0, 5),
        commonCategories: analytics.patterns.commonCategories.slice(0, 5),
        commonAreas: analytics.patterns.commonAreas.slice(0, 5),
        commonTags: analytics.patterns.commonTags.slice(0, 5),
        durationPatterns: analytics.patterns.durationPatterns.slice(0, 5),
        budgetPatterns: analytics.patterns.budgetPatterns.slice(0, 5)
      }
    };
  },

  // Get personalized recommendations
  getRecommendations: () => {
    const insights = ProjectAnalytics.getProductivityInsights();
    const recommendations = [];
    
    // Project type recommendations
    if (insights.projectCreation.mostCommonType) {
      recommendations.push({
        type: 'project_type',
        title: 'Optimize Project Types',
        description: `You create many ${insights.projectCreation.mostCommonType} projects. Consider using templates for efficiency.`,
        icon: '📋',
        priority: 'medium'
      });
    }
    
    // Category recommendations
    if (insights.projectCreation.mostCommonCategory) {
      recommendations.push({
        type: 'category',
        title: 'Category Focus',
        description: `Most of your projects are in ${insights.projectCreation.mostCommonCategory}. Consider diversifying.`,
        icon: '📂',
        priority: 'low'
      });
    }
    
    // AI usage recommendations
    if (insights.aiUsage.accuracyRate < 70) {
      recommendations.push({
        type: 'ai_usage',
        title: 'Improve AI Accuracy',
        description: 'Try being more specific in your project descriptions for better AI analysis.',
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
      localStorage.setItem('projectAnalytics', JSON.stringify(ProjectAnalytics.analytics));
    } catch (error) {
      console.error('Failed to save project analytics:', error);
    }
  },

  // Load analytics from localStorage
  loadAnalytics: () => {
    try {
      const saved = localStorage.getItem('projectAnalytics');
      if (saved) {
        ProjectAnalytics.analytics = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load project analytics:', error);
    }
  },

  // Reset analytics
  resetAnalytics: () => {
    ProjectAnalytics.analytics = {
      projectCreation: {
        totalProjects: 0,
        projectsByType: {},
        projectsByCategory: {},
        projectsByArea: {},
        averageDuration: 0,
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
        projectsCompletedToday: 0,
        projectsCompletedThisWeek: 0,
        projectsCompletedThisMonth: 0,
        averageProjectsPerDay: 0,
        peakProductivityHours: [],
        mostProductiveDays: []
      },
      patterns: {
        commonProjectTypes: [],
        commonCategories: [],
        commonAreas: [],
        commonTags: [],
        durationPatterns: [],
        budgetPatterns: []
      }
    };
    ProjectAnalytics.saveAnalytics();
  }
};

// Initialize analytics on load
ProjectAnalytics.loadAnalytics();
