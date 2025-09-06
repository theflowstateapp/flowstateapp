const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe');
const { setupSecurity } = require('./security');
const { setupPerformance, optimizeDatabase, optimizeMemory } = require('./performance');
const { logger, apiMonitoring, systemMonitoring, monitorDatabase } = require('./monitoring');
require('dotenv').config();

const app = express();

// Setup production features
setupSecurity(app);
setupPerformance(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://theflowstateapp.com', 'https://www.theflowstateapp.com']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Initialize services
let supabase, openai, stripeClient;

try {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('✅ Supabase connected successfully');
  }
} catch (error) {
  console.error('❌ Supabase connection failed:', error.message);
}

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('✅ OpenAI connected successfully');
  }
} catch (error) {
  console.error('❌ OpenAI connection failed:', error.message);
}

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe connected successfully');
  }
} catch (error) {
  console.error('❌ Stripe connection failed:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'flowstate-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required', success: false });
    }

    if (!openai) {
      return res.status(503).json({
        error: 'OpenAI service is not configured. Please set OPENAI_API_KEY environment variable.',
        success: false
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful AI assistant for FlowState, a comprehensive life management application. Help users with task management, productivity, and life organization. Provide clear, actionable advice." 
        },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiResponse = {
      response: completion.choices[0].message.content,
      context: context,
      timestamp: new Date().toISOString(),
      model: 'gpt-3.5-turbo'
    };

    res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    console.error('AI chat error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'OpenAI quota exceeded. Please try again later.', 
        success: false 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key.', 
        success: false 
      });
    }
    
    res.status(500).json({ error: 'AI chat failed', success: false });
  }
});

// Apple Reminders Integration endpoints
app.get('/api/integrations/apple-reminders/status', (req, res) => {
  res.json({
    connected: false,
    message: 'Apple Reminders integration is not yet implemented',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/integrations/apple-reminders/connect', (req, res) => {
  res.json({
    success: false,
    message: 'Apple Reminders integration is not yet implemented',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/integrations/apple-reminders/reminders', (req, res) => {
  res.json({
    reminders: [],
    message: 'Apple Reminders integration is not yet implemented',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/integrations/apple-reminders/reminders', (req, res) => {
  res.json({
    success: false,
    message: 'Apple Reminders integration is not yet implemented',
    timestamp: new Date().toISOString()
  });
});

app.put('/api/integrations/apple-reminders/reminders/:id', (req, res) => {
  res.json({
    success: false,
    message: 'Apple Reminders integration is not yet implemented',
    timestamp: new Date().toISOString()
  });
});

app.delete('/api/integrations/apple-reminders/reminders/:id', (req, res) => {
  res.json({
    success: false,
    message: 'Apple Reminders integration is not yet implemented',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    success: false
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

// Export for Vercel
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 FlowState Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
    console.log(`🤖 AI endpoints: http://localhost:${PORT}/api/ai/*`);
    console.log(`🍎 Apple Reminders: http://localhost:${PORT}/api/integrations/apple-reminders/*`);
  });
}
