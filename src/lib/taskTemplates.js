// Task Template System - Smart suggestions based on usage patterns
import { processTaskWithAI } from './enhancedAI';

export const TaskTemplateSystem = {
  // Template categories based on common task patterns
  templates: {
    // Meeting Templates
    meeting: {
      name: 'Meeting Template',
      icon: '🤝',
      category: 'Communication',
      fields: {
        type: 'Meeting',
        status: 'Not Started',
        priority: 'Medium',
        context: 'At Office',
        tags: ['meeting', 'communication'],
        estimatedHours: '1.0',
        reminderTime: '09:00'
      },
      patterns: ['meeting', 'call', 'standup', 'sync', 'discussion', 'presentation']
    },
    
    // Work Templates
    workTask: {
      name: 'Work Task Template',
      icon: '💼',
      category: 'Work',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'Medium',
        context: 'At Computer',
        tags: ['work', 'professional'],
        estimatedHours: '2.0'
      },
      patterns: ['work', 'project', 'task', 'assignment', 'deadline', 'report']
    },
    
    // Health & Fitness Templates
    health: {
      name: 'Health & Fitness Template',
      icon: '💪',
      category: 'Health',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'High',
        context: 'At Home',
        tags: ['health', 'fitness'],
        estimatedHours: '0.5'
      },
      patterns: ['workout', 'exercise', 'gym', 'fitness', 'health', 'running', 'walking']
    },
    
    // Family Templates
    family: {
      name: 'Family Task Template',
      icon: '👨‍👩‍👧‍👦',
      category: 'Family',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'High',
        context: 'At Home',
        tags: ['family', 'personal'],
        estimatedHours: '1.0'
      },
      patterns: ['family', 'kids', 'children', 'home', 'dinner', 'cook', 'cleaning']
    },
    
    // Financial Templates
    finance: {
      name: 'Financial Task Template',
      icon: '💰',
      category: 'Finance',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'High',
        context: 'At Computer',
        tags: ['finance', 'money'],
        estimatedHours: '0.5'
      },
      patterns: ['bill', 'payment', 'finance', 'money', 'budget', 'bank', 'tax']
    },
    
    // Learning Templates
    learning: {
      name: 'Learning Task Template',
      icon: '📚',
      category: 'Learning',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'Medium',
        context: 'At Computer',
        tags: ['learning', 'education'],
        estimatedHours: '2.0'
      },
      patterns: ['learn', 'study', 'course', 'training', 'reading', 'research']
    },
    
    // Urgent Templates
    urgent: {
      name: 'Urgent Task Template',
      icon: '🚨',
      category: 'Urgent',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'Critical',
        tags: ['urgent', 'important'],
        estimatedHours: '1.0'
      },
      patterns: ['urgent', 'asap', 'critical', 'emergency', 'immediate']
    },
    
    // Creative Templates
    creative: {
      name: 'Creative Task Template',
      icon: '🎨',
      category: 'Creative',
      fields: {
        type: 'Task',
        status: 'Not Started',
        priority: 'Medium',
        context: 'At Computer',
        tags: ['creative', 'design'],
        estimatedHours: '3.0'
      },
      patterns: ['design', 'creative', 'art', 'draw', 'paint', 'write', 'compose']
    }
  },

  // Get suggested templates based on input
  getSuggestedTemplates: (input) => {
    const lowerInput = input.toLowerCase();
    const suggestions = [];
    
    for (const [key, template] of Object.entries(TaskTemplateSystem.templates)) {
      const matchScore = template.patterns.reduce((score, pattern) => {
        if (lowerInput.includes(pattern)) {
          return score + 1;
        }
        return score;
      }, 0);
      
      if (matchScore > 0) {
        suggestions.push({
          ...template,
          key,
          matchScore,
          confidence: Math.min(matchScore / template.patterns.length, 1)
        });
      }
    }
    
    // Sort by confidence and return top 3
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  },

  // Apply template to form data
  applyTemplate: (template, currentFormData) => {
    const updatedData = { ...currentFormData };
    
    for (const [field, value] of Object.entries(template.fields)) {
      // Only apply if field is empty or template has higher priority
      if (!updatedData[field] || updatedData[field] === '' || 
          (field === 'priority' && template.fields.priority === 'Critical')) {
        updatedData[field] = value;
      }
    }
    
    return updatedData;
  },

  // Get template suggestions for quick creation
  getQuickTemplates: () => {
    return [
      {
        name: 'Quick Meeting',
        icon: '🤝',
        description: 'Schedule a meeting or call',
        template: TaskTemplateSystem.templates.meeting
      },
      {
        name: 'Work Task',
        icon: '💼',
        description: 'Create a work-related task',
        template: TaskTemplateSystem.templates.workTask
      },
      {
        name: 'Health Activity',
        icon: '💪',
        description: 'Schedule health or fitness activity',
        template: TaskTemplateSystem.templates.health
      },
      {
        name: 'Family Task',
        icon: '👨‍👩‍👧‍👦',
        description: 'Create a family-related task',
        template: TaskTemplateSystem.templates.family
      },
      {
        name: 'Financial Task',
        icon: '💰',
        description: 'Handle financial matters',
        template: TaskTemplateSystem.templates.finance
      },
      {
        name: 'Learning Session',
        icon: '📚',
        description: 'Schedule learning or study time',
        template: TaskTemplateSystem.templates.learning
      }
    ];
  }
};

// Enhanced AI analysis with template suggestions
export const processTaskWithAIAndTemplates = async (naturalLanguageInput, currentFormData = {}) => {
  // Get AI suggestions
  const aiSuggestions = await processTaskWithAI(naturalLanguageInput);
  
  // Get template suggestions
  const templateSuggestions = TaskTemplateSystem.getSuggestedTemplates(naturalLanguageInput);
  
  // Combine AI and template suggestions
  const combinedSuggestions = {
    aiSuggestions,
    templateSuggestions,
    recommendedTemplate: templateSuggestions[0] || null,
    appliedTemplate: null
  };
  
  // If we have a high-confidence template, apply it
  if (templateSuggestions[0] && templateSuggestions[0].confidence > 0.7) {
    combinedSuggestions.appliedTemplate = TaskTemplateSystem.applyTemplate(
      templateSuggestions[0], 
      currentFormData
    );
  }
  
  return combinedSuggestions;
};
