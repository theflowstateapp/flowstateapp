const winston = require('winston');

// Logging configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'lifeos-backend' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Health check monitoring
const healthCheck = {
  status: 'healthy',
  timestamp: new Date(),
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  cpu: process.cpuUsage(),
  version: process.version,
  environment: process.env.NODE_ENV || 'development'
};

// Update health check
const updateHealthCheck = () => {
  healthCheck.timestamp = new Date();
  healthCheck.uptime = process.uptime();
  healthCheck.memory = process.memoryUsage();
  healthCheck.cpu = process.cpuUsage();
};

// Performance monitoring
const performanceMetrics = {
  requests: 0,
  errors: 0,
  averageResponseTime: 0,
  totalResponseTime: 0,
  startTime: Date.now()
};

// Update performance metrics
const updatePerformanceMetrics = (duration, isError = false) => {
  performanceMetrics.requests++;
  if (isError) performanceMetrics.errors++;
  
  performanceMetrics.totalResponseTime += duration;
  performanceMetrics.averageResponseTime = 
    performanceMetrics.totalResponseTime / performanceMetrics.requests;
};

// Error tracking
const trackError = (error, context = {}) => {
  logger.error('Application error', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date()
  });

  // Send to external monitoring service if configured
  if (process.env.SENTRY_DSN) {
    // Sentry integration would go here
    console.log('Error sent to Sentry');
  }
};

// API monitoring middleware
const apiMonitoring = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const isError = res.statusCode >= 400;
    
    updatePerformanceMetrics(duration, isError);
    
    logger.info('API Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};

// Database monitoring
const monitorDatabase = async (supabase) => {
  if (!supabase) return;

  try {
    const start = Date.now();
    await supabase.from('users').select('count').limit(1);
    const duration = Date.now() - start;
    
    logger.info('Database health check', {
      status: 'healthy',
      responseTime: duration,
      timestamp: new Date()
    });
  } catch (error) {
    logger.error('Database health check failed', {
      error: error.message,
      timestamp: new Date()
    });
  }
};

// System monitoring
const systemMonitoring = () => {
  setInterval(() => {
    updateHealthCheck();
    
    const metrics = {
      ...healthCheck,
      performance: performanceMetrics,
      requestsPerSecond: performanceMetrics.requests / (performanceMetrics.requests / 1000),
      errorRate: performanceMetrics.errors / performanceMetrics.requests * 100
    };
    
    logger.info('System metrics', metrics);
  }, 60000); // Every minute
};

// Alert system
const sendAlert = (level, message, data = {}) => {
  const alert = {
    level,
    message,
    data,
    timestamp: new Date(),
    service: 'lifeos-backend'
  };
  
  logger.warn('Alert', alert);
  
  // Send to external alerting service if configured
  if (process.env.ALERT_WEBHOOK_URL) {
    // Webhook integration would go here
    console.log('Alert sent to webhook');
  }
};

module.exports = {
  logger,
  healthCheck,
  performanceMetrics,
  trackError,
  apiMonitoring,
  monitorDatabase,
  systemMonitoring,
  sendAlert,
  updateHealthCheck,
  updatePerformanceMetrics
};
