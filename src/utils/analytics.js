// Analytics and monitoring configuration
const analyticsConfig = {
  // Google Analytics 4
  googleAnalytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID,
    enabled: process.env.NODE_ENV === 'production'
  },
  
  // Custom analytics endpoint
  customAnalytics: {
    endpoint: '/api/analytics',
    enabled: true
  },
  
  // Error tracking
  errorTracking: {
    enabled: true,
    endpoint: '/api/analytics/errors'
  },
  
  // Performance monitoring
  performanceMonitoring: {
    enabled: true,
    endpoint: '/api/analytics/performance'
  }
};

// Initialize Google Analytics
const initGoogleAnalytics = () => {
  if (!analyticsConfig.googleAnalytics.enabled || !analyticsConfig.googleAnalytics.measurementId) {
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', analyticsConfig.googleAnalytics.measurementId, {
    page_title: document.title,
    page_location: window.location.href
  });
};

// Track page views
const trackPageView = (path, title) => {
  if (analyticsConfig.googleAnalytics.enabled && window.gtag) {
    window.gtag('config', analyticsConfig.googleAnalytics.measurementId, {
      page_path: path,
      page_title: title
    });
  }

  // Send to custom analytics
  if (analyticsConfig.customAnalytics.enabled) {
    fetch(analyticsConfig.customAnalytics.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'page_view',
        path,
        title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(err => console.log('Analytics error:', err));
  }
};

// Track custom events
const trackEvent = (eventName, parameters = {}) => {
  if (analyticsConfig.googleAnalytics.enabled && window.gtag) {
    window.gtag('event', eventName, parameters);
  }

  // Send to custom analytics
  if (analyticsConfig.customAnalytics.enabled) {
    fetch(analyticsConfig.customAnalytics.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'event',
        eventName,
        parameters,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(err => console.log('Analytics error:', err));
  }
};

// Track errors
const trackError = (error, context = {}) => {
  if (analyticsConfig.errorTracking.enabled) {
    fetch(analyticsConfig.errorTracking.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'error',
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(err => console.log('Error tracking error:', err));
  }
};

// Track user actions
const trackUserAction = (action, details = {}) => {
  trackEvent('user_action', {
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Track performance metrics
const trackPerformance = (metrics) => {
  if (analyticsConfig.performanceMonitoring.enabled) {
    fetch(analyticsConfig.performanceMonitoring.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'performance',
        metrics,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(err => console.log('Performance tracking error:', err));
  }
};

// Initialize analytics
const initAnalytics = () => {
  initGoogleAnalytics();
  
  // Track initial page view
  trackPageView(window.location.pathname, document.title);
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      trackEvent('page_visible');
    } else {
      trackEvent('page_hidden');
    }
  });
  
  // Track beforeunload
  window.addEventListener('beforeunload', () => {
    trackEvent('page_unload');
  });
};

export {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackError,
  trackUserAction,
  trackPerformance
};
