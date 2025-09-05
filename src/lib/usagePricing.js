// Enhanced Usage Tracking and Pricing System
// This system tracks all user activity and manages pricing tiers

import supabase from './supabase';

// Usage Categories for Comprehensive Tracking
export const USAGE_CATEGORIES = {
  // AI Usage
  AI_REQUESTS: 'ai_requests',
  AI_TOKENS: 'ai_tokens',
  AI_FEATURES: 'ai_features',
  
  // Data Storage
  STORAGE_BYTES: 'storage_bytes',
  FILES_UPLOADED: 'files_uploaded',
  DATABASE_RECORDS: 'database_records',
  
  // Feature Usage
  PROJECTS_CREATED: 'projects_created',
  TASKS_CREATED: 'tasks_created',
  GOALS_CREATED: 'goals_created',
  HABITS_CREATED: 'habits_created',
  JOURNAL_ENTRIES: 'journal_entries',
  HEALTH_RECORDS: 'health_records',
  FINANCIAL_RECORDS: 'financial_records',
  LEARNING_SESSIONS: 'learning_sessions',
  
  // API Usage
  API_CALLS: 'api_calls',
  EXPORTS_GENERATED: 'exports_generated',
  INTEGRATIONS_USED: 'integrations_used',
  
  // User Activity
  LOGIN_SESSIONS: 'login_sessions',
  FEATURES_ACCESSED: 'features_accessed',
  SEARCH_QUERIES: 'search_queries',
  
  // Collaboration
  TEAM_MEMBERS: 'team_members',
  SHARED_PROJECTS: 'shared_projects',
  COLLABORATION_SESSIONS: 'collaboration_sessions'
};

// Pricing Tiers Configuration
export const PRICING_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    currency: 'INR',
    billing_cycle: 'monthly',
    limits: {
      ai_requests: 50,
      ai_tokens: 50000,
      storage_gb: 0.5,
      projects: 5,
      tasks: 100,
      goals: 10,
      habits: 10,
      journal_entries: 50,
      health_records: 100,
      financial_records: 100,
      learning_sessions: 50,
      api_calls: 1000,
      team_members: 1,
      exports: 5
    },
    features: [
      'Basic goal tracking',
      'Simple habit tracking',
      'Task management',
      'Basic health metrics',
      'Email support'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 999,
    currency: 'INR',
    billing_cycle: 'monthly',
    limits: {
      ai_requests: 500,
      ai_tokens: 500000,
      storage_gb: 10,
      projects: 50,
      tasks: 1000,
      goals: 100,
      habits: 50,
      journal_entries: 500,
      health_records: 1000,
      financial_records: 1000,
      learning_sessions: 500,
      api_calls: 10000,
      team_members: 5,
      exports: 50
    },
    features: [
      'Advanced goal setting & milestones',
      'Project & task management',
      'Comprehensive habit tracking',
      'Health & wellness dashboard',
      'Finance tracking',
      'Learning & skill development',
      'Journal & reflection tools',
      'Priority support',
      'Data export',
      'AI-powered insights',
      'Advanced analytics'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 2499,
    currency: 'INR',
    billing_cycle: 'monthly',
    limits: {
      ai_requests: 2000,
      ai_tokens: 2000000,
      storage_gb: 100,
      projects: 200,
      tasks: 5000,
      goals: 500,
      habits: 200,
      journal_entries: 2000,
      health_records: 5000,
      financial_records: 5000,
      learning_sessions: 2000,
      api_calls: 50000,
      team_members: 20,
      exports: 200
    },
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Shared goals & projects',
      'Family health tracking',
      'Team analytics',
      'Admin dashboard',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'White-label options'
    ]
  }
};

// Usage Tracking Class
class UsageTracker {
  constructor() {
    this.currentUser = null;
    this.usageCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Initialize usage tracker
  async initialize() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.currentUser = user;
      
      if (user) {
        await this.loadUserUsage();
      }
    } catch (error) {
      console.error('Error initializing usage tracker:', error);
    }
  }

  // Load user's current usage data
  async loadUserUsage() {
    if (!this.currentUser) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_usage', { p_user_id: this.currentUser.id });

      if (error) throw error;

      if (data && data.length > 0) {
        this.usageCache.set('current_usage', {
          data: data[0],
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error loading user usage:', error);
    }
  }

  // Track usage for any category
  async trackUsage(category, amount = 1, metadata = {}) {
    if (!this.currentUser) return;

    try {
      const { data, error } = await supabase
        .from('usage_logs')
        .insert({
          user_id: this.currentUser.id,
          category: category,
          amount: amount,
          metadata: metadata,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;

      // Update cache
      await this.updateUsageCache(category, amount);

      return data;
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }

  // Track AI usage specifically
  async trackAIUsage(featureType, inputTokens, outputTokens, modelUsed = 'gpt-4', metadata = {}) {
    const totalTokens = inputTokens + outputTokens;
    
    await this.trackUsage(USAGE_CATEGORIES.AI_REQUESTS, 1, {
      feature_type: featureType,
      model_used: modelUsed,
      ...metadata
    });

    await this.trackUsage(USAGE_CATEGORIES.AI_TOKENS, totalTokens, {
      feature_type: featureType,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      model_used: modelUsed,
      ...metadata
    });
  }

  // Track storage usage
  async trackStorageUsage(bytes, fileType = 'unknown', metadata = {}) {
    await this.trackUsage(USAGE_CATEGORIES.STORAGE_BYTES, bytes, {
      file_type: fileType,
      ...metadata
    });

    await this.trackUsage(USAGE_CATEGORIES.FILES_UPLOADED, 1, {
      file_type: fileType,
      file_size: bytes,
      ...metadata
    });
  }

  // Track feature usage
  async trackFeatureUsage(feature, metadata = {}) {
    await this.trackUsage(USAGE_CATEGORIES.FEATURES_ACCESSED, 1, {
      feature: feature,
      ...metadata
    });
  }

  // Check if user can perform action based on limits
  async canPerformAction(action, amount = 1) {
    if (!this.currentUser) return false;

    try {
      const usage = await this.getCurrentUsage();
      const limits = await this.getUserLimits();

      if (!usage || !limits) return false;

      const currentUsage = usage[action] || 0;
      const limit = limits[action];

      if (limit === null || limit === undefined) return true; // No limit
      if (limit === -1) return true; // Unlimited

      return (currentUsage + amount) <= limit;
    } catch (error) {
      console.error('Error checking action limits:', error);
      return false;
    }
  }

  // Get current usage for user
  async getCurrentUsage() {
    if (!this.currentUser) return null;

    const cached = this.usageCache.get('current_usage');
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }

    await this.loadUserUsage();
    const cachedAfter = this.usageCache.get('current_usage');
    return cachedAfter ? cachedAfter.data : null;
  }

  // Get user's current plan limits
  async getUserLimits() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_user_subscription_limits', { p_user_id: user.id });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user limits:', error);
      return PRICING_TIERS.FREE.limits;
    }
  }

  // Update usage cache
  async updateUsageCache(category, amount) {
    const cached = this.usageCache.get('current_usage');
    if (cached) {
      cached.data[category] = (cached.data[category] || 0) + amount;
      cached.timestamp = Date.now();
    }
  }

  // Get usage percentage for any category
  async getUsagePercentage(category) {
    const usage = await this.getCurrentUsage();
    const limits = await this.getUserLimits();

    if (!usage || !limits) return 0;

    const current = usage[category] || 0;
    const limit = limits[category];

    if (!limit || limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  }

  // Get usage alerts
  async getUsageAlerts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('usage_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting usage alerts:', error);
      return [];
    }
  }

  // Mark alert as read
  async markAlertAsRead(alertId) {
    try {
      const { error } = await supabase
        .from('usage_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  }

  // Generate usage report
  async generateUsageReport(startDate, endDate) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('generate_usage_report', {
          p_user_id: user.id,
          p_start_date: startDate,
          p_end_date: endDate
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating usage report:', error);
      return null;
    }
  }
}

// Pricing Management Class
class PricingManager {
  constructor() {
    this.currentUser = null;
  }

  // Initialize pricing manager
  async initialize() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.currentUser = user;
    } catch (error) {
      console.error('Error initializing pricing manager:', error);
    }
  }

  // Get available pricing plans
  getAvailablePlans() {
    return Object.values(PRICING_TIERS);
  }

  // Get user's current plan
  async getCurrentPlan() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return PRICING_TIERS.FREE;

      const { data, error } = await supabase
        .rpc('get_user_current_plan', { p_user_id: user.id });

      if (error) throw error;
      return data || PRICING_TIERS.FREE;
    } catch (error) {
      console.error('Error getting current plan:', error);
      return PRICING_TIERS.FREE;
    }
  }

  // Upgrade user's plan
  async upgradePlan(planName, paymentMethod = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const plan = PRICING_TIERS[planName.toUpperCase()];
      if (!plan) throw new Error('Invalid plan');

      const { data, error } = await supabase
        .rpc('upgrade_user_plan', {
          p_user_id: user.id,
          p_plan_name: planName,
          p_payment_method: paymentMethod
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      throw error;
    }
  }

  // Downgrade user's plan
  async downgradePlan(planName) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('downgrade_user_plan', {
          p_user_id: user.id,
          p_plan_name: planName
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error downgrading plan:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('cancel_user_subscription', { p_user_id: user.id });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get billing history
  async getBillingHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting billing history:', error);
      return [];
    }
  }

  // Calculate cost for usage
  calculateUsageCost(usage, plan) {
    const overages = {};
    let totalCost = plan.price;

    Object.keys(usage).forEach(category => {
      const limit = plan.limits[category];
      const used = usage[category] || 0;

      if (limit && limit !== -1 && used > limit) {
        const overage = used - limit;
        overages[category] = overage;
        
        // Calculate overage cost (example: $0.01 per AI request over limit)
        const overageRates = {
          ai_requests: 0.01,
          ai_tokens: 0.000001,
          storage_gb: 0.10,
          projects: 0.50,
          tasks: 0.05
        };

        const rate = overageRates[category] || 0;
        totalCost += overage * rate;
      }
    });

    return {
      baseCost: plan.price,
      overages,
      totalCost,
      hasOverages: Object.keys(overages).length > 0
    };
  }

  // Get recommended plan based on usage
  async getRecommendedPlan() {
    try {
      const usage = await usageTracker.getCurrentUsage();
      if (!usage) return PRICING_TIERS.FREE;

      const plans = this.getAvailablePlans();
      let recommended = PRICING_TIERS.FREE;

      for (const plan of plans) {
        let suitable = true;
        
        for (const [category, limit] of Object.entries(plan.limits)) {
          const used = usage[category] || 0;
          if (limit !== -1 && used > limit * 0.8) { // 80% threshold
            suitable = false;
            break;
          }
        }

        if (suitable) {
          recommended = plan;
        }
      }

      return recommended;
    } catch (error) {
      console.error('Error getting recommended plan:', error);
      return PRICING_TIERS.FREE;
    }
  }
}

// Create singleton instances
const usageTracker = new UsageTracker();
const pricingManager = new PricingManager();

export {
  usageTracker,
  pricingManager
};
