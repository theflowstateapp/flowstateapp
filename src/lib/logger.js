// CTO Agent Task: Advanced Logging System
// Comprehensive logging for LifeOS application

// Log Levels
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

// Log Categories
export const LOG_CATEGORIES = {
  API: 'API',
  UI: 'UI',
  AUTH: 'AUTH',
  DATABASE: 'DATABASE',
  AI: 'AI',
  PAYMENT: 'PAYMENT',
  PERFORMANCE: 'PERFORMANCE',
  SECURITY: 'SECURITY',
  USER_ACTION: 'USER_ACTION'
};

// Logger Class
export class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 10000;
    this.currentLevel = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.sessionId = this.generateSessionId();
  }

  // Main logging method
  log(level, category, message, data = {}) {
    if (level > this.currentLevel) return;

    const logEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      level: this.getLevelName(level),
      category,
      message,
      data,
      sessionId: this.sessionId,
      userId: data.userId || 'anonymous',
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Add to internal log
    this.logs.unshift(logEntry);
    
    // Maintain log size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output
    this.outputToConsole(logEntry);

    // Store in localStorage for debugging
    if (this.isDevelopment) {
      this.storeInLocalStorage(logEntry);
    }

    // Send to remote logging service (in production)
    if (!this.isDevelopment && level <= LOG_LEVELS.WARN) {
      this.sendToRemoteService(logEntry);
    }

    return logEntry;
  }

  // Convenience methods
  error(category, message, data = {}) {
    return this.log(LOG_LEVELS.ERROR, category, message, data);
  }

  warn(category, message, data = {}) {
    return this.log(LOG_LEVELS.WARN, category, message, data);
  }

  info(category, message, data = {}) {
    return this.log(LOG_LEVELS.INFO, category, message, data);
  }

  debug(category, message, data = {}) {
    return this.log(LOG_LEVELS.DEBUG, category, message, data);
  }

  trace(category, message, data = {}) {
    return this.log(LOG_LEVELS.TRACE, category, message, data);
  }

  // API Logging
  logApiRequest(method, url, data = {}) {
    return this.info(LOG_CATEGORIES.API, `API Request: ${method} ${url}`, {
      method,
      url,
      requestData: data,
      timestamp: Date.now()
    });
  }

  logApiResponse(method, url, status, data = {}, duration = 0) {
    const level = status >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    return this.log(level, LOG_CATEGORIES.API, `API Response: ${method} ${url} - ${status}`, {
      method,
      url,
      status,
      responseData: data,
      duration,
      timestamp: Date.now()
    });
  }

  // User Action Logging
  logUserAction(action, data = {}) {
    return this.info(LOG_CATEGORIES.USER_ACTION, `User Action: ${action}`, {
      action,
      ...data,
      timestamp: Date.now()
    });
  }

  // Performance Logging
  logPerformance(operation, duration, data = {}) {
    const level = duration > 1000 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
    return this.log(level, LOG_CATEGORIES.PERFORMANCE, `Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...data,
      timestamp: Date.now()
    });
  }

  // Security Logging
  logSecurityEvent(event, data = {}) {
    return this.warn(LOG_CATEGORIES.SECURITY, `Security Event: ${event}`, {
      event,
      ...data,
      timestamp: Date.now()
    });
  }

  // AI Logging
  logAIInteraction(type, input, output, data = {}) {
    return this.info(LOG_CATEGORIES.AI, `AI Interaction: ${type}`, {
      type,
      input: typeof input === 'string' ? input.substring(0, 100) : input,
      output: typeof output === 'string' ? output.substring(0, 100) : output,
      ...data,
      timestamp: Date.now()
    });
  }

  // Payment Logging
  logPaymentEvent(event, data = {}) {
    const level = event.includes('error') || event.includes('failed') ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    return this.log(level, LOG_CATEGORIES.PAYMENT, `Payment Event: ${event}`, {
      event,
      ...data,
      timestamp: Date.now()
    });
  }

  // Output to console with appropriate styling
  outputToConsole(logEntry) {
    const style = this.getConsoleStyle(logEntry.level);
    const prefix = `[${logEntry.timestamp}] [${logEntry.category}]`;
    
    if (logEntry.data && Object.keys(logEntry.data).length > 0) {
      console.log(`%c${prefix} ${logEntry.message}`, style, logEntry.data);
    } else {
      console.log(`%c${prefix} ${logEntry.message}`, style);
    }
  }

  // Get console style based on log level
  getConsoleStyle(level) {
    const styles = {
      ERROR: 'color: red; font-weight: bold;',
      WARN: 'color: orange; font-weight: bold;',
      INFO: 'color: blue;',
      DEBUG: 'color: gray;',
      TRACE: 'color: lightgray;'
    };
    return styles[level] || 'color: black;';
  }

  // Store in localStorage for debugging
  storeInLocalStorage(logEntry) {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('lifeos_logs') || '[]');
      storedLogs.unshift(logEntry);
      
      // Keep only last 100 logs in localStorage
      if (storedLogs.length > 100) {
        storedLogs.splice(100);
      }
      
      localStorage.setItem('lifeos_logs', JSON.stringify(storedLogs));
    } catch (error) {
      console.error('Failed to store log in localStorage:', error);
    }
  }

  // Send to remote logging service
  sendToRemoteService(logEntry) {
    // In production, this would send to services like LogRocket, Sentry, etc.
    if (window.gtag) {
      window.gtag('event', 'log', {
        log_level: logEntry.level,
        log_category: logEntry.category,
        log_message: logEntry.message
      });
    }
  }

  // Generate unique log ID
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get level name
  getLevelName(level) {
    const names = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
    return names[level] || 'UNKNOWN';
  }

  // Get logs by category
  getLogsByCategory(category) {
    return this.logs.filter(log => log.category === category);
  }

  // Get logs by level
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  // Get recent logs
  getRecentLogs(count = 50) {
    return this.logs.slice(0, count);
  }

  // Get log statistics
  getLogStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      byCategory: {},
      sessionId: this.sessionId,
      startTime: this.logs[this.logs.length - 1]?.timestamp,
      endTime: this.logs[0]?.timestamp
    };

    this.logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
    });

    return stats;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    if (this.isDevelopment) {
      localStorage.removeItem('lifeos_logs');
    }
  }

  // Export logs
  exportLogs(format = 'json') {
    const logs = this.logs;
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else if (format === 'csv') {
      const headers = ['timestamp', 'level', 'category', 'message', 'userId'];
      const csv = [headers.join(',')];
      
      logs.forEach(log => {
        const row = headers.map(header => {
          const value = log[header] || '';
          return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csv.push(row.join(','));
      });
      
      return csv.join('\n');
    }
    
    return logs;
  }

  // Set log level
  setLogLevel(level) {
    this.currentLevel = level;
  }

  // Get current log level
  getLogLevel() {
    return this.currentLevel;
  }
}

// Global logger instance
export const logger = new Logger();

// Performance monitoring
export const performanceLogger = {
  startTimer: (operation) => {
    const startTime = performance.now();
    return {
      end: (data = {}) => {
        const duration = performance.now() - startTime;
        logger.logPerformance(operation, duration, data);
        return duration;
      }
    };
  },

  measureAsync: async (operation, asyncFunction, data = {}) => {
    const timer = performanceLogger.startTimer(operation);
    try {
      const result = await asyncFunction();
      timer.end({ ...data, success: true });
      return result;
    } catch (error) {
      timer.end({ ...data, success: false, error: error.message });
      throw error;
    }
  }
};

// API logging wrapper
export const apiLogger = {
  request: (method, url, data = {}) => {
    return logger.logApiRequest(method, url, data);
  },

  response: (method, url, status, data = {}, duration = 0) => {
    return logger.logApiResponse(method, url, status, data, duration);
  }
};

// User action logging wrapper
export const userActionLogger = {
  log: (action, data = {}) => {
    return logger.logUserAction(action, data);
  },

  navigation: (from, to) => {
    return logger.logUserAction('navigation', { from, to });
  },

  click: (element, data = {}) => {
    return logger.logUserAction('click', { element, ...data });
  },

  formSubmit: (formName, data = {}) => {
    return logger.logUserAction('form_submit', { formName, ...data });
  }
};

export default logger;



