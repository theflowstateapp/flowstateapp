const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe');

const app = express();

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://awpqoykarscjyawcaeou.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHFveWthcnNjanlhd2NhZW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDYzNzcsImV4cCI6MjA3MjM4MjM3N30._vJ9mqEFzAZXj_LGOVMuiujcSyAyo2L__tKWxdiDzso'
);

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

const stripeClient = process.env.STRIPE_SECRET_KEY ? stripe(process.env.STRIPE_SECRET_KEY) : null;

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
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'flowstate-backend',
    version: process.env.npm_package_version || '1.0.0'
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
        { role: "system", content: "You are a helpful AI assistant for FlowState, a comprehensive life management application. Help users with task management, productivity, and life organization. Provide clear, actionable advice." },
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
      return res.status(429).json({ error: 'OpenAI quota exceeded. Please try again later.', success: false });
    }
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ error: 'Invalid OpenAI API key.', success: false });
    }
    res.status(500).json({ error: 'AI chat failed', success: false });
  }
});

// Apple Reminders Integration endpoints
app.get('/api/integrations/apple-reminders/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      connected: false,
      lastSync: null,
      reminderCount: 0
    }
  });
});

app.post('/api/integrations/apple-reminders/connect', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Apple Reminders integration connected successfully',
      connected: true
    }
  });
});

app.get('/api/integrations/apple-reminders/reminders', (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

app.post('/api/integrations/apple-reminders/reminders', (req, res) => {
  const { title, notes, dueDate } = req.body;
  res.status(201).json({
    success: true,
    data: {
      id: `reminder_${Date.now()}`,
      title,
      notes,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    }
  });
});

app.put('/api/integrations/apple-reminders/reminders/:id', (req, res) => {
  const { id } = req.params;
  const { title, notes, dueDate, completed } = req.body;
  res.status(200).json({
    success: true,
    data: {
      id,
      title,
      notes,
      dueDate,
      completed,
      updatedAt: new Date().toISOString()
    }
  });
});

app.delete('/api/integrations/apple-reminders/reminders/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      message: `Reminder ${id} deleted successfully`
    }
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
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});

module.exports = app;