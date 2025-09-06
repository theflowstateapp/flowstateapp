// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor API response times
    this.interceptFetch();
    
    // Monitor memory usage
    this.observeMemoryUsage();
  }

  observeWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.logMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.logMetric('FID', this.metrics.fid);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
          this.logMetric('CLS', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      try {
        const response = await originalFetch(...args);
        const end = performance.now();
        const duration = end - start;
        
        this.metrics.apiResponseTime = duration;
        this.logMetric('API Response Time', duration, args[0]);
        
        return response;
      } catch (error) {
        const end = performance.now();
        const duration = end - start;
        this.logMetric('API Error', duration, args[0], error.message);
        throw error;
      }
    };
  }

  observeMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        };
        this.logMetric('Memory Usage', this.metrics.memoryUsage);
      }, 30000); // Every 30 seconds
    }
  }

  logMetric(name, value, url = '', error = '') {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      metric: name,
      value,
      url,
      error,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}:`, value);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(logData);
    }
  }

  sendToAnalytics(data) {
    // Send to your analytics service
    // This could be Google Analytics, Mixpanel, or your own backend
    try {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(err => console.log('Analytics error:', err));
    } catch (error) {
      console.log('Failed to send analytics:', error);
    }
  }

  getMetrics() {
    return this.metrics;
  }

  // Report performance issues
  reportPerformanceIssue(issue) {
    const report = {
      timestamp: new Date().toISOString(),
      issue,
      metrics: this.metrics,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
      }).catch(err => console.log('Performance issue report error:', err));
    }
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
