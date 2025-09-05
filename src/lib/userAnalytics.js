// User Analytics System - Track onboarding and user behavior
export const UserAnalytics = {
  // Analytics data structure
  analytics: {
    onboarding: {
      tourStarted: 0,
      tourCompleted: 0,
      tourSkipped: 0,
      firstTaskCreated: 0,
      timeToFirstTask: 0,
      completionRate: 0,
      averageTimeToComplete: 0,
      stepCompletion: {
        welcome: 0,
        paraIntro: 0,
        quickCapture: 0,
        firstTask: 0,
        dashboardOverview: 0,
        lifeAreas: 0,
        search: 0,
        completion: 0
      }
    },
    userBehavior: {
      pageViews: {},
      featureUsage: {},
      sessionDuration: 0,
      dailyActiveUsers: 0,
      retentionRate: 0,
      mostUsedFeatures: [],
      userJourney: []
    },
    feedback: {
      ratings: [],
      comments: [],
      satisfactionScore: 0,
      featureRequests: [],
      bugReports: []
    },
    engagement: {
      tasksCreated: 0,
      projectsCreated: 0,
      goalsSet: 0,
      habitsTracked: 0,
      averageSessionTime: 0,
      returnVisits: 0
    }
  },

  // Track onboarding tour start
  trackTourStart: () => {
    const analytics = UserAnalytics.analytics;
    analytics.onboarding.tourStarted++;
    analytics.onboarding.stepCompletion.welcome++;
    UserAnalytics.saveAnalytics();
  },

  // Track onboarding tour completion
  trackTourComplete: (timeToComplete) => {
    const analytics = UserAnalytics.analytics;
    analytics.onboarding.tourCompleted++;
    analytics.onboarding.averageTimeToComplete = 
      (analytics.onboarding.averageTimeToComplete * (analytics.onboarding.tourCompleted - 1) + timeToComplete) / analytics.onboarding.tourCompleted;
    analytics.onboarding.completionRate = 
      (analytics.onboarding.tourCompleted / analytics.onboarding.tourStarted) * 100;
    UserAnalytics.saveAnalytics();
  },

  // Track onboarding tour skip
  trackTourSkip: () => {
    const analytics = UserAnalytics.analytics;
    analytics.onboarding.tourSkipped++;
    UserAnalytics.saveAnalytics();
  },

  // Track step completion
  trackStepComplete: (stepId) => {
    const analytics = UserAnalytics.analytics;
    if (analytics.onboarding.stepCompletion[stepId] !== undefined) {
      analytics.onboarding.stepCompletion[stepId]++;
    }
    UserAnalytics.saveAnalytics();
  },

  // Track first task creation
  trackFirstTask: (timeToFirstTask) => {
    const analytics = UserAnalytics.analytics;
    analytics.onboarding.firstTaskCreated++;
    analytics.onboarding.timeToFirstTask = timeToFirstTask;
    analytics.engagement.tasksCreated++;
    UserAnalytics.saveAnalytics();
  },

  // Track page view
  trackPageView: (pageName) => {
    const analytics = UserAnalytics.analytics;
    analytics.userBehavior.pageViews[pageName] = 
      (analytics.userBehavior.pageViews[pageName] || 0) + 1;
    UserAnalytics.saveAnalytics();
  },

  // Track feature usage
  trackFeatureUsage: (featureName) => {
    const analytics = UserAnalytics.analytics;
    analytics.userBehavior.featureUsage[featureName] = 
      (analytics.userBehavior.featureUsage[featureName] || 0) + 1;
    UserAnalytics.updateMostUsedFeatures();
    UserAnalytics.saveAnalytics();
  },

  // Track user journey
  trackUserJourney: (action, page, timestamp) => {
    const analytics = UserAnalytics.analytics;
    analytics.userBehavior.userJourney.push({
      action,
      page,
      timestamp: timestamp || new Date().toISOString()
    });
    
    // Keep only last 100 actions to prevent memory issues
    if (analytics.userBehavior.userJourney.length > 100) {
      analytics.userBehavior.userJourney = analytics.userBehavior.userJourney.slice(-100);
    }
    UserAnalytics.saveAnalytics();
  },

  // Track session duration
  trackSessionDuration: (duration) => {
    const analytics = UserAnalytics.analytics;
    analytics.userBehavior.sessionDuration = duration;
    analytics.engagement.averageSessionTime = 
      (analytics.engagement.averageSessionTime + duration) / 2;
    UserAnalytics.saveAnalytics();
  },

  // Track engagement metrics
  trackEngagement: (type, count = 1) => {
    const analytics = UserAnalytics.analytics;
    switch (type) {
      case 'task':
        analytics.engagement.tasksCreated += count;
        break;
      case 'project':
        analytics.engagement.projectsCreated += count;
        break;
      case 'goal':
        analytics.engagement.goalsSet += count;
        break;
      case 'habit':
        analytics.engagement.habitsTracked += count;
        break;
      case 'return':
        analytics.engagement.returnVisits += count;
        break;
    }
    UserAnalytics.saveAnalytics();
  },

  // Collect user feedback
  collectFeedback: (rating, comment = '', type = 'general') => {
    const analytics = UserAnalytics.analytics;
    analytics.feedback.ratings.push(rating);
    analytics.feedback.satisfactionScore = 
      analytics.feedback.ratings.reduce((a, b) => a + b, 0) / analytics.feedback.ratings.length;
    
    if (comment) {
      analytics.feedback.comments.push({
        rating,
        comment,
        type,
        timestamp: new Date().toISOString()
      });
    }
    UserAnalytics.saveAnalytics();
  },

  // Update most used features
  updateMostUsedFeatures: () => {
    const analytics = UserAnalytics.analytics;
    const features = Object.entries(analytics.userBehavior.featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    analytics.userBehavior.mostUsedFeatures = features;
  },

  // Get onboarding insights
  getOnboardingInsights: () => {
    const analytics = UserAnalytics.analytics;
    return {
      completionRate: analytics.onboarding.completionRate,
      averageTimeToComplete: analytics.onboarding.averageTimeToComplete,
      firstTaskRate: (analytics.onboarding.firstTaskCreated / analytics.onboarding.tourStarted) * 100,
      stepCompletion: analytics.onboarding.stepCompletion,
      totalTours: analytics.onboarding.tourStarted,
      completedTours: analytics.onboarding.tourCompleted,
      skippedTours: analytics.onboarding.tourSkipped
    };
  },

  // Get user behavior insights
  getUserBehaviorInsights: () => {
    const analytics = UserAnalytics.analytics;
    return {
      mostViewedPages: Object.entries(analytics.userBehavior.pageViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      mostUsedFeatures: analytics.userBehavior.mostUsedFeatures.slice(0, 5),
      averageSessionTime: analytics.engagement.averageSessionTime,
      engagementMetrics: {
        tasksCreated: analytics.engagement.tasksCreated,
        projectsCreated: analytics.engagement.projectsCreated,
        goalsSet: analytics.engagement.goalsSet,
        habitsTracked: analytics.engagement.habitsTracked
      }
    };
  },

  // Get feedback insights
  getFeedbackInsights: () => {
    const analytics = UserAnalytics.analytics;
    return {
      satisfactionScore: analytics.feedback.satisfactionScore,
      totalRatings: analytics.feedback.ratings.length,
      recentComments: analytics.feedback.comments.slice(-5),
      averageRating: analytics.feedback.ratings.length > 0 
        ? analytics.feedback.ratings.reduce((a, b) => a + b, 0) / analytics.feedback.ratings.length 
        : 0
    };
  },

  // Save analytics to localStorage
  saveAnalytics: () => {
    try {
      localStorage.setItem('userAnalytics', JSON.stringify(UserAnalytics.analytics));
    } catch (error) {
      console.error('Failed to save user analytics:', error);
    }
  },

  // Load analytics from localStorage
  loadAnalytics: () => {
    try {
      const saved = localStorage.getItem('userAnalytics');
      if (saved) {
        UserAnalytics.analytics = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load user analytics:', error);
    }
  },

  // Reset analytics
  resetAnalytics: () => {
    UserAnalytics.analytics = {
      onboarding: {
        tourStarted: 0,
        tourCompleted: 0,
        tourSkipped: 0,
        firstTaskCreated: 0,
        timeToFirstTask: 0,
        completionRate: 0,
        averageTimeToComplete: 0,
        stepCompletion: {
          welcome: 0,
          paraIntro: 0,
          quickCapture: 0,
          firstTask: 0,
          dashboardOverview: 0,
          lifeAreas: 0,
          search: 0,
          completion: 0
        }
      },
      userBehavior: {
        pageViews: {},
        featureUsage: {},
        sessionDuration: 0,
        dailyActiveUsers: 0,
        retentionRate: 0,
        mostUsedFeatures: [],
        userJourney: []
      },
      feedback: {
        ratings: [],
        comments: [],
        satisfactionScore: 0,
        featureRequests: [],
        bugReports: []
      },
      engagement: {
        tasksCreated: 0,
        projectsCreated: 0,
        goalsSet: 0,
        habitsTracked: 0,
        averageSessionTime: 0,
        returnVisits: 0
      }
    };
    UserAnalytics.saveAnalytics();
  }
};

// Initialize analytics on load
UserAnalytics.loadAnalytics();
