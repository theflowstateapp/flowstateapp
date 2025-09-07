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

// Demo routes
app.get('/api/demo/index', (req, res) => {
  res.status(200).json({ message: 'Demo overview working via Express' });
});

app.get('/api/demo/static', (req, res) => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowState Demo - AI-Powered Productivity Platform</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .container { max-width: 800px; margin: 0 auto; }
      h1 { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <h1>FlowState Demo</h1>
        <p>A snapshot of your productivity on <strong>${today}</strong>.</p>
        <p>This is working via the Express router!</p>
        <a href="/api/demo/access">Open Interactive Demo</a>
    </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('X-Robots-Tag', 'index,follow');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(html);
});

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