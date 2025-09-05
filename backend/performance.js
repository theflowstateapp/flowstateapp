const compression = require('compression');
const express = require('express');
const { setupSecurity } = require('./security');

// Performance optimization configuration
const performanceConfig = {
  // Compression settings
  compression: {
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  },

  // Caching settings
  cache: {
    static: {
      maxAge: '1y',
      etag: true,
      lastModified: true
    },
    api: {
      maxAge: '5m',
      etag: true
    }
  },

  // Database connection pooling
  database: {
    poolSize: process.env.DB_POOL_SIZE || 10,
    connectionTimeout: process.env.DB_CONNECTION_TIMEOUT || 30000,
    idleTimeout: process.env.DB_IDLE_TIMEOUT || 30000
  }
};

// Performance middleware setup
const setupPerformance = (app) => {
  // Enable compression
  app.use(compression(performanceConfig.compression));

  // Static file caching
  app.use((req, res, next) => {
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', `public, max-age=${performanceConfig.cache.static.maxAge}`);
    }
    next();
  });

  // API response caching
  app.use((req, res, next) => {
    if (req.method === 'GET' && req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', `public, max-age=${performanceConfig.cache.api.maxAge}`);
    }
    next();
  });

  // Response time logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  // Request size limiting
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

// Database optimization utilities
const optimizeDatabase = async (supabase) => {
  if (!supabase) return;

  try {
    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status)',
      'CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)',
      'CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)'
    ];

    for (const index of indexes) {
      await supabase.rpc('exec_sql', { sql: index });
    }

    console.log('✅ Database indexes created for performance');
  } catch (error) {
    console.log('⚠️ Database optimization skipped:', error.message);
  }
};

// Memory optimization
const optimizeMemory = () => {
  // Garbage collection hints
  if (global.gc) {
    setInterval(() => {
      global.gc();
    }, 30000); // Every 30 seconds
  }

  // Memory monitoring
  setInterval(() => {
    const memUsage = process.memoryUsage();
    console.log('Memory usage:', {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    });
  }, 60000); // Every minute
};

module.exports = {
  setupPerformance,
  optimizeDatabase,
  optimizeMemory,
  performanceConfig
};
