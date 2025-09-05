// Enhanced AI Service for LifeOS
// Comprehensive AI integration with backend API, usage tracking, and fallback mechanisms

import apiService from './api';

// AI Service Configuration
const AI_CONFIG = {
  // OpenAI Configuration
  OPENAI_MODEL: 'gpt-4',
  OPENAI_MAX_TOKENS: 2000,
  OPENAI_TEMPERATURE: 0.3,
  
  // API Endpoints
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
  OPENAI_ENDPOINT: '/api/openai',
  
  // Rate Limiting
  MAX_REQUESTS_PER_MINUTE: 10,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Fallback Configuration
  ENABLE_FALLBACK: true,
  FALLBACK_CONFIDENCE_THRESHOLD: 0.7
};

// AI Feature Types with specialized prompts
export const AI_FEATURES = {
  // Goal & Vision AI
  GOAL_ANALYSIS: {
    name: 'goal_analysis',
    description: 'Analyze and optimize user goals',
    systemPrompt: `You are an expert life coach specializing in goal analysis and optimization. 
    Analyze the user's goals and provide actionable insights for improvement. Focus on SMART criteria, 
    progress tracking, and obstacle identification.`
  },
  
  GOAL_RECOMMENDATIONS: {
    name: 'goal_recommendations',
    description: 'Generate personalized goal suggestions',
    systemPrompt: `You are a goal-setting expert. Based on the user's current goals, habits, and life areas, 
    suggest 3-5 new goals that would complement their life management strategy. Consider balance, 
    achievability, and personal growth.`
  },
  
  SMART_GOAL_CREATION: {
    name: 'smart_goal_creation',
    description: 'Create SMART goals from natural language',
    systemPrompt: `You are a SMART goal specialist. Convert user's natural language goal descriptions into 
    Specific, Measurable, Achievable, Relevant, and Time-bound goals. Provide clear metrics and timelines.`
  },
  
  // Project & Task AI
  PROJECT_ANALYSIS: {
    name: 'project_analysis',
    description: 'Analyze project timelines and risks',
    systemPrompt: `You are a project management expert. Analyze the user's project data and provide insights 
    on timeline optimization, risk assessment, resource allocation, and task prioritization.`
  },
  
  TASK_PRIORITIZATION: {
    name: 'task_prioritization',
    description: 'Prioritize tasks using AI',
    systemPrompt: `You are a productivity expert. Analyze the user's tasks and prioritize them based on urgency, 
    importance, deadlines, and dependencies. Use the Eisenhower Matrix and other proven frameworks.`
  },
  
  // Habit & Routine AI
  HABIT_ANALYSIS: {
    name: 'habit_analysis',
    description: 'Analyze habit consistency and patterns',
    systemPrompt: `You are a habit formation specialist. Analyze the user's habit data to identify patterns, 
    consistency issues, and optimization opportunities. Provide actionable recommendations for improvement.`
  },
  
  HABIT_RECOMMENDATIONS: {
    name: 'habit_recommendations',
    description: 'Suggest new habits based on goals',
    systemPrompt: `You are a habit expert. Based on the user's goals, current habits, and life areas, 
    suggest 2-3 new habits that would improve their productivity and well-being. Consider habit stacking 
    and atomic habits principles.`
  },
  
  // Health & Wellness AI
  HEALTH_INSIGHTS: {
    name: 'health_insights',
    description: 'Analyze health data and provide insights',
    systemPrompt: `You are a health and wellness expert. Analyze the user's health data and provide 
    personalized insights on fitness, nutrition, sleep, and overall well-being. Focus on actionable 
    recommendations.`
  },
  
  WORKOUT_RECOMMENDATIONS: {
    name: 'workout_recommendations',
    description: 'Suggest personalized workout plans',
    systemPrompt: `You are a fitness expert. Based on the user's goals, current fitness level, and preferences, 
    suggest personalized workout plans and exercise recommendations. Consider variety, progression, and safety.`
  },
  
  // Finance AI
  FINANCIAL_ANALYSIS: {
    name: 'financial_analysis',
    description: 'Analyze spending patterns and provide insights',
    systemPrompt: `You are a financial advisor. Analyze the user's financial data to identify spending patterns, 
    savings opportunities, and investment recommendations. Focus on practical, actionable advice.`
  },
  
  BUDGET_RECOMMENDATIONS: {
    name: 'budget_recommendations',
    description: 'Suggest budget optimizations',
    systemPrompt: `You are a budgeting expert. Analyze the user's income, expenses, and financial goals to 
    suggest budget optimizations, savings strategies, and financial planning recommendations.`
  },
  
  // Learning & Growth AI
  LEARNING_PATH_OPTIMIZATION: {
    name: 'learning_path_optimization',
    description: 'Optimize learning paths and skill development',
    systemPrompt: `You are a learning and development expert. Analyze the user's learning progress and 
    suggest optimized learning paths, skill development strategies, and course recommendations.`
  },
  
  SKILL_GAP_ANALYSIS: {
    name: 'skill_gap_analysis',
    description: 'Identify skill gaps and development opportunities',
    systemPrompt: `You are a career development specialist. Analyze the user's current skills, goals, and 
    market demands to identify skill gaps and development opportunities. Provide actionable learning plans.`
  },
  
  // Time Management AI
  TIME_ANALYSIS: {
    name: 'time_analysis',
    description: 'Analyze time usage and productivity patterns',
    systemPrompt: `You are a productivity and time management expert. Analyze the user's time usage data 
    to identify productivity patterns, time-wasting activities, and optimization opportunities.`
  },
  
  PRODUCTIVITY_OPTIMIZATION: {
    name: 'productivity_optimization',
    description: 'Suggest productivity improvements',
    systemPrompt: `You are a productivity expert. Based on the user's work patterns, goals, and challenges, 
    suggest specific productivity improvements, time management techniques, and workflow optimizations.`
  },
  
  // Journal & Reflection AI
  MOOD_ANALYSIS: {
    name: 'mood_analysis',
    description: 'Analyze mood patterns and emotional well-being',
    systemPrompt: `You are a mental health and wellness expert. Analyze the user's mood data and journal 
    entries to identify patterns, triggers, and opportunities for emotional well-being improvement.`
  },
  
  JOURNAL_INSIGHTS: {
    name: 'journal_insights',
    description: 'Provide insights from journal entries',
    systemPrompt: `You are a reflection and personal development expert. Analyze the user's journal entries 
    to provide insights on personal growth, patterns, and opportunities for self-improvement.`
  },
  
  // Natural Language Processing
  NATURAL_LANGUAGE_TASK_CREATION: {
    name: 'natural_language_task_creation',
    description: 'Convert natural language to structured tasks',
    systemPrompt: `You are a task management expert. Convert natural language descriptions into structured 
    task data including title, description, priority, category, estimated time, and due date. 
    Return only valid JSON with the exact fields specified.`
  },
  
  // General AI
  CONTENT_GENERATION: {
    name: 'content_generation',
    description: 'Generate content and insights',
    systemPrompt: `You are a content creation expert. Generate helpful, actionable content based on the 
    user's request. Focus on practical advice and clear, engaging communication.`
  },
  
  DATA_ANALYSIS: {
    name: 'data_analysis',
    description: 'Analyze user data and provide insights',
    systemPrompt: `You are a data analyst specializing in personal productivity and life management. 
    Analyze the user's data to provide meaningful insights, trends, and recommendations.`
  }
};

// Enhanced AI Service Class
class AIService {
  constructor() {
    this.config = AI_CONFIG;
    this.requestCount = 0;
    this.lastRequestTime = 0;
    this.isInitialized = false;
  }

  // Initialize the AI service
  async initialize() {
    try {
      // Check if backend is available
      await this.checkBackendHealth();
      this.isInitialized = true;
      // eslint-disable-next-line no-console
      console.log('AI Service initialized successfully');
    } catch (error) {
      console.warn('AI Service initialization failed, using fallback mode:', error.message);
      this.isInitialized = false;
    }
  }

  // Check backend health
  async checkBackendHealth() {
    try {
      const response = await axios.get(`${this.config.BACKEND_URL}/api/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      throw new Error('Backend not available');
    }
  }

  // Rate limiting check
  canMakeRequest() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < 60000) { // Within 1 minute
      if (this.requestCount >= this.config.MAX_REQUESTS_PER_MINUTE) {
        return false;
      }
    } else {
      this.requestCount = 0;
    }
    
    return true;
  }

  // Update request tracking
  updateRequestTracking() {
    this.requestCount++;
    this.lastRequestTime = Date.now();
  }

  // Make AI request with retry logic
  async makeAIRequest(featureType, prompt, context = {}, options = {}) {
    const feature = AI_FEATURES[featureType];
    if (!feature) {
      throw new Error(`Unknown AI feature: ${featureType}`);
    }

    // Check rate limiting
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    // Prepare request data
    const requestData = {
      featureType: feature.name,
      prompt: prompt,
      context: context,
      systemPrompt: feature.systemPrompt,
      model: options.model || this.config.OPENAI_MODEL,
      maxTokens: options.maxTokens || this.config.OPENAI_MAX_TOKENS,
      temperature: options.temperature || this.config.OPENAI_TEMPERATURE
    };

    // Try OpenAI first, then fallback
    try {
      const result = await this.makeOpenAIRequest(requestData);
      this.updateRequestTracking();
      return {
        success: true,
        result: result,
        source: 'openai',
        featureType: featureType
      };
    } catch (error) {
      console.warn('OpenAI request failed, using fallback:', error.message);
      
      if (this.config.ENABLE_FALLBACK) {
        const fallbackResult = await this.makeFallbackRequest(requestData);
        return {
          success: true,
          result: fallbackResult,
          source: 'fallback',
          featureType: featureType,
          confidence: this.config.FALLBACK_CONFIDENCE_THRESHOLD
        };
      } else {
        throw error;
      }
    }
  }

  // Make OpenAI request
  async makeOpenAIRequest(requestData) {
    const maxRetries = this.config.RETRY_ATTEMPTS;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await apiService.callAI(
          requestData.featureType,
          requestData.prompt,
          requestData.context
        );

        if (response && response.result) {
          return response.result;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          await this.delay(this.config.RETRY_DELAY * attempt);
        }
      }
    }

    throw lastError || new Error('AI request failed after retries');
  }

  // Fallback request using pattern matching
  async makeFallbackRequest(requestData) {
    const { featureType, prompt, context } = requestData;
    
    // Enhanced pattern matching based on feature type
    switch (featureType) {
      case 'natural_language_task_creation':
        return this.parseNaturalLanguageTask(prompt);
      
      case 'goal_analysis':
        return this.analyzeGoalsFallback(prompt, context);
      
      case 'habit_analysis':
        return this.analyzeHabitsFallback(prompt, context);
      
      case 'project_analysis':
        return this.analyzeProjectsFallback(prompt, context);
      
      case 'financial_analysis':
        return this.analyzeFinanceFallback(prompt, context);
      
      case 'time_analysis':
        return this.analyzeTimeFallback(prompt, context);
      
      default:
        return this.generateGenericResponse(prompt, featureType);
    }
  }

  // Natural language task parsing
  parseNaturalLanguageTask(prompt) {
    const taskData = {
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      estimatedTime: 30,
      dueDate: null,
      tags: []
    };

    // Extract title
    const titleMatch = prompt.match(/^(.*?)(?:at|on|for|by|tomorrow|today|next|this)/i);
    if (titleMatch) {
      taskData.title = titleMatch[1].trim();
    } else {
      taskData.title = prompt.substring(0, 50) + '...';
    }

    // Extract time
    const timeMatch = prompt.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)/i);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3].toLowerCase();
      taskData.estimatedTime = hour * 60 + minute;
    }

    // Extract date
    if (prompt.includes('today')) {
      taskData.dueDate = new Date().toISOString().split('T')[0];
    } else if (prompt.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskData.dueDate = tomorrow.toISOString().split('T')[0];
    }

    // Extract category based on keywords
    const categoryKeywords = {
      'health': ['workout', 'exercise', 'gym', 'run', 'walk', 'fitness', 'health'],
      'work': ['meeting', 'call', 'email', 'work', 'project', 'task', 'deadline'],
      'personal': ['call', 'meet', 'visit', 'family', 'friend', 'personal'],
      'learning': ['study', 'read', 'learn', 'course', 'training', 'education'],
      'finance': ['pay', 'bill', 'budget', 'expense', 'financial', 'money']
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
        taskData.category = category;
        break;
      }
    }

    // Extract tags
    const words = prompt.toLowerCase().split(' ');
    taskData.tags = words.filter(word => word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word));

    return taskData;
  }

  // Goal analysis fallback
  analyzeGoalsFallback(prompt, context) {
    return {
      insights: [
        "Consider breaking down large goals into smaller, manageable milestones",
        "Set specific deadlines for each goal component",
        "Track progress regularly to maintain motivation",
        "Identify potential obstacles and create contingency plans"
      ],
      recommendations: [
        "Use SMART criteria for goal setting",
        "Create a goal tracking system",
        "Share goals with accountability partners",
        "Celebrate small wins along the way"
      ],
      nextSteps: [
        "Review and refine your goal statements",
        "Create action plans for each goal",
        "Set up regular progress check-ins",
        "Identify resources and support needed"
      ]
    };
  }

  // Habit analysis fallback
  analyzeHabitsFallback(prompt, context) {
    return {
      insights: [
        "Consistency is more important than perfection",
        "Start with small, manageable habits",
        "Use habit stacking to build new routines",
        "Track your progress to maintain motivation"
      ],
      recommendations: [
        "Focus on one habit at a time",
        "Create clear triggers for your habits",
        "Make habits enjoyable and rewarding",
        "Use the 2-minute rule for new habits"
      ],
      nextSteps: [
        "Identify your most important habit to focus on",
        "Create a specific implementation plan",
        "Set up tracking and reminder systems",
        "Plan for potential obstacles and setbacks"
      ]
    };
  }

  // Project analysis fallback
  analyzeProjectsFallback(prompt, context) {
    return {
      insights: [
        "Break down large projects into smaller tasks",
        "Prioritize tasks based on impact and effort",
        "Identify dependencies between tasks",
        "Allocate time for unexpected issues"
      ],
      recommendations: [
        "Use project management tools to track progress",
        "Set realistic deadlines and milestones",
        "Communicate regularly with team members",
        "Review and adjust plans as needed"
      ],
      nextSteps: [
        "Create a detailed project timeline",
        "Identify critical path and dependencies",
        "Set up regular progress reviews",
        "Prepare risk mitigation strategies"
      ]
    };
  }

  // Financial analysis fallback
  analyzeFinanceFallback(prompt, context) {
    return {
      insights: [
        "Track all income and expenses regularly",
        "Create and stick to a budget",
        "Build an emergency fund",
        "Invest in your financial education"
      ],
      recommendations: [
        "Use the 50/30/20 budgeting rule",
        "Automate savings and bill payments",
        "Review and optimize recurring expenses",
        "Consider multiple income streams"
      ],
      nextSteps: [
        "Create a comprehensive budget",
        "Set up automatic savings transfers",
        "Review and cancel unnecessary subscriptions",
        "Start building an emergency fund"
      ]
    };
  }

  // Time analysis fallback
  analyzeTimeFallback(prompt, context) {
    return {
      insights: [
        "Track how you spend your time for a week",
        "Identify time-wasting activities",
        "Use time blocking for important tasks",
        "Schedule breaks and recovery time"
      ],
      recommendations: [
        "Use the Pomodoro Technique for focused work",
        "Batch similar tasks together",
        "Eliminate or delegate low-value activities",
        "Set clear boundaries for work and personal time"
      ],
      nextSteps: [
        "Conduct a time audit for one week",
        "Identify your most productive hours",
        "Create a daily schedule template",
        "Set up time tracking systems"
      ]
    };
  }

  // Generic response generator
  generateGenericResponse(prompt, featureType) {
    return {
      message: `I understand you're asking about ${featureType}. Here are some general insights:`,
      insights: [
        "Focus on one area at a time for better results",
        "Consistency is key to long-term success",
        "Track your progress to stay motivated",
        "Be patient with yourself during the process"
      ],
      recommendations: [
        "Set clear, specific goals",
        "Create actionable plans",
        "Build supportive habits",
        "Review and adjust regularly"
      ]
    };
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get AI feature information
  getFeatureInfo(featureType) {
    return AI_FEATURES[featureType] || null;
  }

  // Get all available features
  getAllFeatures() {
    return Object.keys(AI_FEATURES);
  }

  // Check if feature is available
  isFeatureAvailable(featureType) {
    return AI_FEATURES.hasOwnProperty(featureType);
  }
}

// Create and export singleton instance
const aiService = new AIService();

// Initialize the service
aiService.initialize().catch(console.error);

export default aiService;
export { AI_CONFIG };
