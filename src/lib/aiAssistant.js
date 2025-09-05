// Enhanced AI Assistant with comprehensive testing and monitoring
import supabase from './supabase';

// AI Features for Life Management
export const AI_FEATURES = {
  INTELLIGENT_TASK_CREATION: 'intelligent_task_creation',
  AI_ASSISTANT: 'ai_assistant',
  LIFE_TRACKING: 'life_tracking',
  CONVERSATIONAL_TASK_CREATION: 'conversational_task_creation',
  LIFE_MANAGEMENT: 'life_management',
  VOICE_CAPTURE: 'voice_capture',
  INBOX_MANAGEMENT: 'inbox_management',
  TASK_PROCESSING: 'task_processing'
};

// Life Areas for comprehensive tracking
export const LIFE_AREAS = {
  HEALTH: 'health',
  FINANCE: 'finance',
  CAREER: 'career',
  RELATIONSHIPS: 'relationships',
  LEARNING: 'learning',
  PERSONAL_GROWTH: 'personal_growth',
  HOBBIES: 'hobbies',
  FAMILY: 'family',
  SOCIAL: 'social',
  SPIRITUAL: 'spiritual',
  TRAVEL: 'travel',
  HOME: 'home'
};

// Task Tags for intelligent categorization
export const TASK_TAGS = {
  URGENT: 'urgent',
  IMPORTANT: 'important',
  LOW_PRIORITY: 'low_priority',
  HIGH_PRIORITY: 'high_priority',
  QUICK_WIN: 'quick_win',
  LONG_TERM: 'long_term',
  MEETING: 'meeting',
  RESEARCH: 'research',
  CREATIVE: 'creative',
  ADMIN: 'admin',
  EXERCISE: 'exercise',
  STUDY: 'study',
  SOCIAL: 'social',
  FAMILY: 'family',
  WORK: 'work',
  PERSONAL: 'personal'
};

// Performance monitoring
class PerformanceMonitor {
  static metrics = {
    aiResponseTime: [],
    voiceProcessingTime: [],
    taskExtractionAccuracy: [],
    userSatisfaction: [],
    errors: []
  };

  static trackAIResponseTime(startTime) {
    const responseTime = Date.now() - startTime;
    this.metrics.aiResponseTime.push(responseTime);
    // eslint-disable-next-line no-console
    console.log(`AI Response Time: ${responseTime}ms`);
    return responseTime;
  }

  static trackVoiceProcessingTime(startTime) {
    const processingTime = Date.now() - startTime;
    this.metrics.voiceProcessingTime.push(processingTime);
    // eslint-disable-next-line no-console
    console.log(`Voice Processing Time: ${processingTime}ms`);
    return processingTime;
  }

  static trackTaskExtractionAccuracy(expected, actual) {
    const accuracy = this.calculateAccuracy(expected, actual);
    this.metrics.taskExtractionAccuracy.push(accuracy);
    // eslint-disable-next-line no-console
    console.log(`Task Extraction Accuracy: ${accuracy}%`);
    return accuracy;
  }

  static trackUserSatisfaction(rating) {
    this.metrics.userSatisfaction.push(rating);
    // eslint-disable-next-line no-console
    console.log(`User Satisfaction: ${rating}/5`);
    return rating;
  }

  static trackError(error, context) {
    const errorData = {
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    this.metrics.errors.push(errorData);
    console.error('AI Error tracked:', errorData);
    return errorData;
  }

  static calculateAccuracy(expected, actual) {
    if (!expected || !actual) return 0;
    const expectedSet = new Set(expected);
    const actualSet = new Set(actual);
    const intersection = new Set([...expectedSet].filter(x => actualSet.has(x)));
    const union = new Set([...expectedSet, ...actualSet]);
    return Math.round((intersection.size / union.size) * 100);
  }

  static getAverageResponseTime() {
    if (this.metrics.aiResponseTime.length === 0) return 0;
    const sum = this.metrics.aiResponseTime.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.aiResponseTime.length);
  }

  static getAverageAccuracy() {
    if (this.metrics.taskExtractionAccuracy.length === 0) return 0;
    const sum = this.metrics.taskExtractionAccuracy.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.taskExtractionAccuracy.length);
  }

  static getErrorRate() {
    const totalInteractions = this.metrics.aiResponseTime.length;
    const totalErrors = this.metrics.errors.length;
    return totalInteractions > 0 ? Math.round((totalErrors / totalInteractions) * 100) : 0;
  }

  static generateReport() {
    return {
      averageResponseTime: this.getAverageResponseTime(),
      averageAccuracy: this.getAverageAccuracy(),
      errorRate: this.getErrorRate(),
      totalInteractions: this.metrics.aiResponseTime.length,
      totalErrors: this.metrics.errors.length,
      recentErrors: this.metrics.errors.slice(-5)
    };
  }
}

class AIAssistant {
  constructor() {
    this.conversationHistory = [];
    this.userPreferences = {};
    this.performanceMonitor = PerformanceMonitor;
    this.userPatterns = {
      preferredTimes: [],
      commonTasks: [],
      frequentTags: [],
      energyPatterns: {},
      contextPreferences: {}
    };
    this.learningEnabled = true;
  }

  // Enhanced voice capture processing with performance monitoring
  async processVoiceCapture(voiceText) {
    const startTime = Date.now();
    
    try {
      // eslint-disable-next-line no-console
      console.log('Processing voice capture:', voiceText);
      
      // Validate input
      if (!voiceText || typeof voiceText !== 'string') {
        throw new Error('Invalid voice input');
      }

      const analysis = await this.analyzeVoiceInput(voiceText);
      const tasksCreated = await this.createTasksFromVoice(analysis);
      
      // Track performance
      this.performanceMonitor.trackVoiceProcessingTime(startTime);
      this.performanceMonitor.trackTaskExtractionAccuracy(
        analysis.expectedTasks || [],
        tasksCreated.map(t => t.title)
      );

      return {
        success: true,
        message: `I've captured ${tasksCreated.length} tasks from your voice input. They're now in your inbox for processing.`,
        tasksCreated: tasksCreated.length > 0,
        tasks: tasksCreated,
        performance: {
          processingTime: this.performanceMonitor.trackVoiceProcessingTime(startTime),
          accuracy: this.performanceMonitor.getAverageAccuracy()
        }
      };
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'processVoiceCapture', voiceText });
      return {
        success: false,
        message: 'Sorry, I had trouble processing your voice input. Please try again.',
        tasksCreated: false,
        error: error.message
      };
    }
  }

  // Enhanced voice input analysis with better task extraction
  async analyzeVoiceInput(voiceText) {
    const startTime = Date.now();
    
    try {
      // Convert to lowercase for better matching
      const text = voiceText.toLowerCase();
      
      // Extract tasks using multiple strategies
      const tasks = [];
      
      // Strategy 1: Direct task indicators
      const taskIndicators = ['call', 'meet', 'schedule', 'book', 'buy', 'send', 'update', 'prepare', 'review', 'complete'];
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      
      sentences.forEach(sentence => {
        const words = sentence.trim().split(' ');
        const hasTaskIndicator = taskIndicators.some(indicator => 
          words.includes(indicator)
        );
        
        if (hasTaskIndicator) {
          tasks.push({
            title: sentence.trim(),
            description: `Task extracted from voice input`,
            priority: this.detectPriority(sentence),
            dueDate: this.detectDueDate(sentence),
            lifeArea: this.detectLifeArea(sentence),
            tags: this.detectTags(sentence)
          });
        }
      });

      // Strategy 2: Time-based task detection
      const timePatterns = [
        { pattern: /(call|meet|schedule).*?(tomorrow|today|next week|this week)/gi, priority: 'high' },
        { pattern: /(buy|get|purchase).*?(milk|bread|groceries)/gi, priority: 'medium' },
        { pattern: /(review|prepare|complete).*?(report|presentation|document)/gi, priority: 'high' }
      ];

      timePatterns.forEach(({ pattern, priority }) => {
        const matches = text.match(pattern);
        if (matches) {
          matches.forEach(match => {
            if (!tasks.some(t => t.title.includes(match))) {
              tasks.push({
                title: match,
                description: `Task detected from time pattern`,
                priority,
                dueDate: this.detectDueDate(match),
                lifeArea: this.detectLifeArea(match),
                tags: this.detectTags(match)
              });
            }
          });
        }
      });

      // Track performance
      this.performanceMonitor.trackAIResponseTime(startTime);

      return {
        tasks,
        expectedTasks: tasks.map(t => t.title),
        confidence: tasks.length > 0 ? 'high' : 'low',
        processingTime: this.performanceMonitor.trackAIResponseTime(startTime)
      };
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'analyzeVoiceInput', voiceText });
      throw error;
    }
  }

  // Enhanced task creation with validation
  async createTasksFromVoice(analysis) {
    const startTime = Date.now();
    
    try {
      const createdTasks = [];
      
      for (const taskData of analysis.tasks) {
        // Validate task data
        if (!taskData.title || taskData.title.length < 3) {
          continue;
        }

        // Create task in database
        const task = await this.createTask({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate,
          life_area: taskData.lifeArea,
          tags: taskData.tags,
          status: 'inbox',
          source: 'voice_capture'
        });

        if (task) {
          createdTasks.push(task);
        }
      }

      // Track performance
      this.performanceMonitor.trackAIResponseTime(startTime);

      return createdTasks;
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'createTasksFromVoice', analysis });
      throw error;
    }
  }

  // Enhanced intelligent task creation
  async createIntelligentTask(taskData) {
    const startTime = Date.now();
    
    try {
      // Validate input
      if (!taskData.title) {
        throw new Error('Task title is required');
      }

      // Analyze task for intelligent categorization
      const analysis = await this.analyzeTask(taskData.title);
      
      const enhancedTask = {
        ...taskData,
        priority: taskData.priority || analysis.priority,
        life_area: taskData.life_area || analysis.lifeArea,
        tags: taskData.tags || analysis.tags,
        due_date: taskData.due_date || analysis.dueDate
      };

      // Create task in database
      const task = await this.createTask(enhancedTask);

      // Track performance
      this.performanceMonitor.trackAIResponseTime(startTime);

      return {
        success: true,
        task,
        analysis,
        performance: {
          responseTime: this.performanceMonitor.trackAIResponseTime(startTime)
        }
      };
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'createIntelligentTask', taskData });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enhanced chat assistant with context awareness and learning
  async chatWithAssistant(message, context = {}) {
    const startTime = Date.now();
    
    try {
      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      // Analyze message intent with enhanced context
      const intent = await this.analyzeIntent(message, context);
      
      // Generate contextual suggestions based on user patterns
      const suggestions = await this.generateContextualSuggestions(message, context);
      
      let response;
      
      switch (intent.type) {
        case 'task_creation':
          response = await this.handleTaskCreation(message, context);
          break;
        case 'task_processing':
          response = await this.handleTaskProcessing(message, context);
          break;
        case 'inquiry':
          response = await this.handleInquiry(message, context);
          break;
        case 'optimization':
          response = await this.handleOptimizationRequest(message, context);
          break;
        case 'learning':
          response = await this.handleLearningRequest(message, context);
          break;
        default:
          response = await this.handleGeneralConversation(message, context);
      }

      // Enhance response with contextual suggestions
      if (suggestions.length > 0) {
        response.suggestions = suggestions;
      }

      // Learn from user interaction
      if (this.learningEnabled) {
        await this.learnFromInteraction(message, response, context);
      }

      // Add response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions
      });

      // Track performance
      this.performanceMonitor.trackAIResponseTime(startTime);

      return {
        ...response,
        performance: {
          responseTime: this.performanceMonitor.trackAIResponseTime(startTime)
        }
      };
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'chatWithAssistant', message, context });
      return {
        success: false,
        message: 'I apologize, but I encountered an error. Please try again.',
        error: error.message
      };
    }
  }

  // Enhanced intent analysis with context awareness
  async analyzeIntent(message, context = {}) {
    const text = message.toLowerCase();
    
    // Enhanced intent detection with context
    if (text.includes('create') || text.includes('add') || text.includes('new task')) {
      return { type: 'task_creation', confidence: 0.9 };
    } else if (text.includes('process') || text.includes('complete') || text.includes('done')) {
      return { type: 'task_processing', confidence: 0.9 };
    } else if (text.includes('optimize') || text.includes('improve') || text.includes('better')) {
      return { type: 'optimization', confidence: 0.8 };
    } else if (text.includes('learn') || text.includes('remember') || text.includes('preference')) {
      return { type: 'learning', confidence: 0.8 };
    } else if (text.includes('what') || text.includes('how') || text.includes('when') || text.includes('why')) {
      return { type: 'inquiry', confidence: 0.7 };
    } else if (context.currentTask) {
      return { type: 'task_processing', confidence: 0.6 };
    } else {
      return { type: 'general', confidence: 0.5 };
    }
  }

  // Generate contextual suggestions based on user patterns
  async generateContextualSuggestions(message, context = {}) {
    const suggestions = [];
    const text = message.toLowerCase();
    
    // Time-based suggestions
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 17) {
      suggestions.push({
        text: 'Schedule this for after work hours',
        action: 'schedule_evening',
        icon: '🌅'
      });
    }
    
    // Task-based suggestions
    if (text.includes('meeting') || text.includes('call')) {
      suggestions.push({
        text: 'Set up calendar reminder',
        action: 'calendar_reminder',
        icon: '📅'
      });
    }
    
    if (text.includes('workout') || text.includes('exercise')) {
      suggestions.push({
        text: 'Add to health tracking',
        action: 'health_tracking',
        icon: '💪'
      });
    }
    
    // Context-based suggestions
    if (context.currentTask) {
      suggestions.push({
        text: 'Process this task now',
        action: 'process_current',
        icon: '⚡'
      });
    }
    
    // User pattern-based suggestions
    if (this.userPatterns.frequentTags.length > 0) {
      const commonTag = this.userPatterns.frequentTags[0];
      suggestions.push({
        text: `Add "${commonTag}" tag`,
        action: 'add_tag',
        icon: '🏷️'
      });
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  // Learn from user interactions
  async learnFromInteraction(message, response, context) {
    try {
      // Learn from task processing patterns
      if (context.currentTask) {
        this.userPatterns.commonTasks.push({
          title: context.currentTask.title,
          timestamp: new Date().toISOString()
        });
      }
      
      // Learn from time patterns
      const currentTime = new Date();
      this.userPatterns.preferredTimes.push({
        hour: currentTime.getHours(),
        dayOfWeek: currentTime.getDay(),
        activity: 'task_processing'
      });
      
      // Learn from tag usage
      if (response.action === 'add_tag' && response.tag) {
        const existingTag = this.userPatterns.frequentTags.find(t => t.name === response.tag);
        if (existingTag) {
          existingTag.count++;
        } else {
          this.userPatterns.frequentTags.push({
            name: response.tag,
            count: 1
          });
        }
      }
      
      // Learn from energy level patterns
      if (context.energyLevel) {
        if (!this.userPatterns.energyPatterns[currentTime.getHours()]) {
          this.userPatterns.energyPatterns[currentTime.getHours()] = [];
        }
        this.userPatterns.energyPatterns[currentTime.getHours()].push(context.energyLevel);
      }
      
      // Keep only recent patterns (last 100 interactions)
      this.userPatterns.commonTasks = this.userPatterns.commonTasks.slice(-100);
      this.userPatterns.preferredTimes = this.userPatterns.preferredTimes.slice(-100);
      
    } catch (error) {
      console.error('Error learning from interaction:', error);
    }
  }

  // Handle optimization requests
  async handleOptimizationRequest(message, context) {
    const inboxTasks = await this.getInboxTasks();
    const analysis = this.analyzeTaskPatterns(inboxTasks);
    
    return {
      success: true,
      message: `Based on your current inbox, here are some optimization suggestions:\n\n${analysis.suggestions.join('\n')}`,
      action: 'optimization_suggestions',
      analysis
    };
  }

  // Handle learning requests
  async handleLearningRequest(message, context) {
    const insights = this.generateUserInsights();
    
    return {
      success: true,
      message: `Here's what I've learned about your productivity patterns:\n\n${insights}`,
      action: 'user_insights'
    };
  }

  // Analyze task patterns for optimization
  analyzeTaskPatterns(tasks) {
    const suggestions = [];
    
    // Analyze priority distribution
    const priorities = tasks.reduce((acc, task) => {
      acc[task.priority || 'medium'] = (acc[task.priority || 'medium'] || 0) + 1;
      return acc;
    }, {});
    
    if (priorities.high > 5) {
      suggestions.push('• You have many high-priority tasks. Consider breaking them down into smaller, manageable pieces.');
    }
    
    // Analyze due dates
    const overdueTasks = tasks.filter(task => 
      task.due_date && new Date(task.due_date) < new Date()
    );
    
    if (overdueTasks.length > 0) {
      suggestions.push(`• You have ${overdueTasks.length} overdue tasks. Consider rescheduling or delegating some.`);
    }
    
    // Analyze task types
    const taskTypes = tasks.reduce((acc, task) => {
      const type = this.categorizeTaskType(task.title);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonType = Object.keys(taskTypes).reduce((a, b) => 
      taskTypes[a] > taskTypes[b] ? a : b
    );
    
    suggestions.push(`• Most of your tasks are "${mostCommonType}" related. Consider batching similar tasks together.`);
    
    return {
      suggestions,
      priorities,
      overdueCount: overdueTasks.length,
      mostCommonType
    };
  }

  // Generate user insights
  generateUserInsights() {
    const insights = [];
    
    // Time pattern insights
    if (this.userPatterns.preferredTimes.length > 0) {
      const avgHour = this.userPatterns.preferredTimes.reduce((sum, t) => sum + t.hour, 0) / this.userPatterns.preferredTimes.length;
      insights.push(`• You're most active around ${Math.round(avgHour)}:00`);
    }
    
    // Task pattern insights
    if (this.userPatterns.commonTasks.length > 0) {
      const taskTypes = this.userPatterns.commonTasks.reduce((acc, task) => {
        const type = this.categorizeTaskType(task.title);
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      const mostCommon = Object.keys(taskTypes).reduce((a, b) => 
        taskTypes[a] > taskTypes[b] ? a : b
      );
      
      insights.push(`• You frequently work on "${mostCommon}" tasks`);
    }
    
    // Tag insights
    if (this.userPatterns.frequentTags.length > 0) {
      const topTag = this.userPatterns.frequentTags.sort((a, b) => b.count - a.count)[0];
      insights.push(`• Your most used tag is "${topTag.name}" (${topTag.count} times)`);
    }
    
    return insights.length > 0 ? insights.join('\n') : 'I\'m still learning about your patterns. Keep using the system and I\'ll provide more insights!';
  }

  // Categorize task type
  categorizeTaskType(title) {
    const text = title.toLowerCase();
    
    if (text.includes('meeting') || text.includes('call')) return 'communication';
    if (text.includes('workout') || text.includes('exercise')) return 'health';
    if (text.includes('buy') || text.includes('purchase')) return 'shopping';
    if (text.includes('read') || text.includes('study')) return 'learning';
    if (text.includes('write') || text.includes('create')) return 'creative';
    if (text.includes('clean') || text.includes('organize')) return 'maintenance';
    
    return 'general';
  }

  // Enhanced inbox management
  async getInboxTasks() {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'inbox')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return tasks || [];
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'getInboxTasks' });
      console.error('Error loading inbox tasks:', error);
      return [];
    }
  }

  // Enhanced task processing
  async processTask(taskId, updates) {
    const startTime = Date.now();
    
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          status: 'processed',
          processed_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      // Track performance
      this.performanceMonitor.trackAIResponseTime(startTime);

      return {
        success: true,
        task,
        performance: {
          responseTime: this.performanceMonitor.trackAIResponseTime(startTime)
        }
      };
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'processTask', taskId, updates });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enhanced life activity tracking
  async trackLifeActivity(activityData) {
    const startTime = Date.now();
    
    try {
      const { data: activity, error } = await supabase
        .from('life_activities')
        .insert({
          ...activityData,
          tracked_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Track performance
      this.performanceMonitor.trackAIResponseTime(startTime);

      return {
        success: true,
        activity,
        performance: {
          responseTime: this.performanceMonitor.trackAIResponseTime(startTime)
        }
      };
    } catch (error) {
      this.performanceMonitor.trackError(error, { method: 'trackLifeActivity', activityData });
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods for intelligent analysis
  async analyzeTask(title) {
    const text = title.toLowerCase();
    
    return {
      priority: this.detectPriority(text),
      lifeArea: this.detectLifeArea(text),
      tags: this.detectTags(text),
      dueDate: this.detectDueDate(text)
    };
  }

  async analyzeIntent(message) {
    const text = message.toLowerCase();
    
    if (text.includes('create') || text.includes('add') || text.includes('new task')) {
      return { type: 'task_creation' };
    } else if (text.includes('process') || text.includes('complete') || text.includes('done')) {
      return { type: 'task_processing' };
    } else if (text.includes('what') || text.includes('how') || text.includes('when')) {
      return { type: 'inquiry' };
    } else {
      return { type: 'general' };
    }
  }

  detectPriority(text) {
    if (text.includes('urgent') || text.includes('asap') || text.includes('emergency')) {
      return 'high';
    } else if (text.includes('important') || text.includes('critical')) {
      return 'high';
    } else if (text.includes('low') || text.includes('sometime')) {
      return 'low';
    }
    return 'medium';
  }

  detectLifeArea(text) {
    const areaMappings = {
      'health': ['exercise', 'workout', 'gym', 'doctor', 'medical', 'diet'],
      'finance': ['money', 'budget', 'bill', 'payment', 'investment', 'bank'],
      'career': ['work', 'job', 'meeting', 'project', 'client', 'boss'],
      'relationships': ['friend', 'family', 'partner', 'date', 'social'],
      'learning': ['study', 'course', 'book', 'read', 'learn', 'education'],
      'personal_growth': ['goal', 'habit', 'improve', 'develop', 'skill'],
      'hobbies': ['hobby', 'fun', 'game', 'music', 'art', 'sport'],
      'family': ['family', 'child', 'parent', 'home', 'house'],
      'social': ['friend', 'party', 'event', 'social', 'network'],
      'spiritual': ['meditation', 'prayer', 'spiritual', 'religion', 'mindfulness'],
      'travel': ['travel', 'trip', 'vacation', 'flight', 'hotel'],
      'home': ['home', 'house', 'clean', 'repair', 'maintenance']
    };

    for (const [area, keywords] of Object.entries(areaMappings)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return area;
      }
    }
    return 'personal';
  }

  detectTags(text) {
    const tags = [];
    
    if (text.includes('meeting') || text.includes('call')) tags.push('meeting');
    if (text.includes('research') || text.includes('study')) tags.push('research');
    if (text.includes('creative') || text.includes('design')) tags.push('creative');
    if (text.includes('admin') || text.includes('paperwork')) tags.push('admin');
    if (text.includes('exercise') || text.includes('workout')) tags.push('exercise');
    if (text.includes('family') || text.includes('child')) tags.push('family');
    if (text.includes('work') || text.includes('job')) tags.push('work');
    if (text.includes('personal') || text.includes('self')) tags.push('personal');
    
    return tags;
  }

  detectDueDate(text) {
    const today = new Date();
    
    if (text.includes('today')) {
      return today.toISOString();
    } else if (text.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    } else if (text.includes('next week')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString();
    } else if (text.includes('this week')) {
      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() + 3);
      return thisWeek.toISOString();
    }
    
    return null;
  }

  // Database helper methods
  async createTask(taskData) {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  // Intent handlers
  async handleTaskCreation(message, context) {
    const analysis = await this.analyzeTask(message);
    const task = await this.createTask({
      title: message,
      description: `Task created from chat: ${message}`,
      priority: analysis.priority,
      life_area: analysis.lifeArea,
      tags: analysis.tags,
      due_date: analysis.dueDate,
      status: 'inbox'
    });

    return {
      success: true,
      message: `I've created a task: "${message}". It's been added to your inbox.`,
      action: 'capture_task',
      task
    };
  }

  async handleTaskProcessing(message, context) {
    const currentTask = context.currentTask;
    if (!currentTask) {
      return {
        success: false,
        message: 'No task is currently being processed. Please select a task from your inbox first.'
      };
    }

    // Process the current task based on the message
    const updates = {};
    if (message.includes('today')) updates.due_date = new Date().toISOString();
    if (message.includes('high priority')) updates.priority = 'high';
    if (message.includes('complete')) updates.status = 'completed';

    const result = await this.processTask(currentTask.id, updates);

    return {
      success: true,
      message: `Task "${currentTask.title}" has been processed successfully.`,
      action: 'process_task',
      taskData: updates
    };
  }

  async handleInquiry(message, context) {
    const inboxTasks = await this.getInboxTasks();
    const unprocessedCount = inboxTasks.filter(t => t.status === 'inbox').length;
    
    return {
      success: true,
      message: `You have ${unprocessedCount} tasks in your inbox that need processing. Would you like me to help you process them?`,
      action: 'show_inbox'
    };
  }

  async handleGeneralConversation(message, context) {
    return {
      success: true,
      message: "I'm here to help you manage your tasks and life! You can ask me to create tasks, process your inbox, or help you organize your life areas. What would you like to do?",
      action: 'general'
    };
  }

  // Performance monitoring methods
  getPerformanceReport() {
    return this.performanceMonitor.generateReport();
  }

  trackUserSatisfaction(rating) {
    return this.performanceMonitor.trackUserSatisfaction(rating);
  }
}

// Create and export the AI Assistant instance
const aiAssistant = new AIAssistant();

// Export for use in components
export { aiAssistant };
export default aiAssistant;
