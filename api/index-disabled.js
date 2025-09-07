// Vercel Serverless Function - Main API Handler
// This routes all API requests to the backend server logic

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Import backend controllers and middleware
const authController = require('../backend/src/controllers/authController');
const integrationController = require('../backend/src/controllers/integrationController');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://flowstateapp-eyuv6imm4-the-flow-state-app.vercel.app',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LifeOS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Auth routes
app.use('/api/auth', authController.router);

// Integration routes
app.use('/api/integrations', integrationController.router);

// AI routes (placeholder for future implementation)
app.get('/api/ai/status', (req, res) => {
  res.json({
    success: true,
    message: 'AI service is available',
    features: ['task-prioritization', 'smart-suggestions', 'voice-capture']
  });
});

// Note: Individual API functions are handled by Vercel directly
// This Express app only handles routes that don't have individual functions
console.log('Express app loaded - individual functions handled by Vercel');

// Catch-all for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Export for Vercel
module.exports = app;