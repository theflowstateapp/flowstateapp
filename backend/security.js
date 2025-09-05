const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Security configuration
const securityConfig = {
  // Helmet configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CORS_ORIGIN] 
      : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
};

// Security middleware setup
const setupSecurity = (app) => {
  // Basic security headers
  app.use(helmet(securityConfig.helmet));

  // Rate limiting
  app.use(rateLimit(securityConfig.rateLimit));

  // CORS
  app.use(cors(securityConfig.cors));

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Request validation middleware
  app.use((req, res, next) => {
    // Validate content type for POST/PUT requests
    if ((req.method === 'POST' || req.method === 'PUT') && 
        req.headers['content-type'] !== 'application/json') {
      return res.status(400).json({ 
        error: 'Content-Type must be application/json',
        success: false 
      });
    }
    next();
  });

  // Input sanitization middleware
  app.use((req, res, next) => {
    // Sanitize request body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
        }
      });
    }
    next();
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      success: false 
    });
  }

  // For now, accept any token (will be replaced with JWT verification)
  req.user = { id: 'temp-user-id' };
  next();
};

// Role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        success: false 
      });
    }

    // For now, allow all authenticated users
    next();
  };
};

module.exports = {
  setupSecurity,
  authenticateToken,
  requireRole,
  securityConfig
};
