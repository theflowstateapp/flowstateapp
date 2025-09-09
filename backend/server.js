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

// Import authentication system
const authRoutes = require('./src/routes/auth');
const dataRoutes = require('./src/routes/data');
const dbInitRoutes = require('./src/routes/db-init');
const { authenticateToken, optionalAuth } = require('./src/middleware/auth');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Production environment validation
if (NODE_ENV === 'production') {
  console.log('🚀 Starting in PRODUCTION mode');
  
  // Validate required production environment variables
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET',
    'FRONTEND_URL'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables for production:', missingVars);
    process.exit(1);
  }
  
  console.log('✅ All required production environment variables are set');
} else {
  console.log('🔧 Starting in DEVELOPMENT mode');
}

// Setup production features
setupSecurity(app);
setupPerformance(app);

// Initialize monitoring
systemMonitoring();
optimizeMemory();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseUrl && supabaseServiceKey && 
    supabaseUrl !== 'your_supabase_url_here' && 
    supabaseServiceKey !== 'your_supabase_service_role_key_here') {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase connected successfully');
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
    supabase = null;
  }
} else {
  console.log('⚠️ Supabase not configured, using mock authentication');
}

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripeClient = null;

if (stripeSecretKey && stripeSecretKey !== 'your_stripe_secret_key_here') {
  try {
    stripeClient = stripe(stripeSecretKey);
    console.log('✅ Stripe connected successfully');
  } catch (error) {
    console.log('❌ Stripe connection failed:', error.message);
    stripeClient = null;
  }
} else {
  console.log('⚠️ Stripe not configured, using mock payments');
}

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// API monitoring
app.use(apiMonitoring);

// Rate limiting - environment-aware
const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' 
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000
    : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

const limiter = rateLimit(rateLimitConfig);

app.use(limiter);

// Authentication routes (comprehensive system)
app.use('/api/auth', authRoutes);

// Data routes (comprehensive CRUD operations)
app.use('/api/data', dataRoutes);

// Database initialization routes
app.use('/api/db', dbInitRoutes);

// OpenAI specific rate limiting
const openaiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many OpenAI requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Initialize OpenAI (only if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-demo-key-for-development' && process.env.OPENAI_API_KEY !== '') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        success: false
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        success: false
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long',
        success: false
      });
    }

    if (supabase) {
      // Use Supabase for real authentication
      const { data, error } = await supabase.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (error) {
        return res.status(400).json({
          error: error.message,
          success: false
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: firstName,
          lastName: lastName
        }
      });
    } else {
      // Fallback to mock data
      res.status(201).json({
        success: true,
        message: 'User registered successfully (mock)',
        user: {
          id: 'temp-user-id',
          email: email,
          firstName: firstName,
          lastName: lastName
        }
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      success: false
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        success: false
      });
    }

    // For now, return success (we'll integrate with Supabase later)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'temp-user-id',
        email: email
      },
      token: 'temp-jwt-token'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      success: false
    });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    // For now, return mock user data
    res.status(200).json({
      success: true,
      user: {
        id: 'temp-user-id',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      success: false
    });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      success: false
    });
  }
});

// Payment endpoints
app.post('/api/payments/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({
        error: 'Amount must be at least $1.00 (100 cents)',
        success: false
      });
    }

    if (stripeClient) {
      // Use real Stripe
      const paymentIntent = await stripeClient.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } else {
      // Mock payment intent
      res.status(200).json({
        success: true,
        clientSecret: 'mock_client_secret_' + Date.now(),
        paymentIntentId: 'mock_pi_' + Date.now()
      });
    }

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      success: false
    });
  }
});

app.post('/api/payments/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, userId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Payment intent ID is required',
        success: false
      });
    }

    if (stripeClient) {
      // Use real Stripe
      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update user subscription in database
        if (supabase && userId) {
          await supabase
            .from('users')
            .update({ 
              subscription_status: 'active',
              subscription_tier: 'pro',
              updated_at: new Date()
            })
            .eq('id', userId);
        }

        res.status(200).json({
          success: true,
          message: 'Payment confirmed successfully',
          status: paymentIntent.status
        });
      } else {
        res.status(400).json({
          error: 'Payment not completed',
          success: false,
          status: paymentIntent.status
        });
      }
    } else {
      // Mock payment confirmation
      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully (mock)',
        status: 'succeeded'
      });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      success: false
    });
  }
});

app.get('/api/payments/subscription-plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Basic P.A.R.A. functionality',
        'Up to 3 projects',
        '10 tasks per project',
        'Community support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 999, // $9.99
      features: [
        'Unlimited projects and tasks',
        'AI-powered insights',
        'Advanced analytics',
        'Priority support',
        'Calendar integrations'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      price: 1999, // $19.99
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced AI features',
        'Custom integrations',
        'Dedicated support'
      ]
    }
  ];

  res.status(200).json({
    success: true,
    plans: plans
  });
});

// Demo endpoints
const { demoAccess, demoTokenExchange } = require('./src/controllers/demoController');

app.get('/api/demo/access', demoAccess);
app.post('/api/demo/access', demoAccess);
app.post('/api/demo/exchange', demoTokenExchange);

// Enhanced OpenAI API endpoint
app.post('/api/openai', openaiLimiter, async (req, res) => {
  try {
    const { 
      featureType, 
      prompt, 
      context = {}, 
      systemPrompt,
      model = "gpt-4",
      maxTokens = 2000,
      temperature = 0.3
    } = req.body;

    // Check if OpenAI is initialized
    if (!openai) {
      return res.status(503).json({ 
        error: 'OpenAI service is not configured. Please set OPENAI_API_KEY environment variable.',
        success: false 
      });
    }

    // Input validation
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ 
        error: 'Prompt is required and must be a string',
        success: false 
      });
    }

    if (!featureType || typeof featureType !== 'string') {
      return res.status(400).json({ 
        error: 'Feature type is required',
        success: false 
      });
    }

    // Sanitize input
    const sanitizedPrompt = prompt.trim();
    if (sanitizedPrompt.length === 0) {
      return res.status(400).json({ 
        error: 'Prompt cannot be empty',
        success: false 
      });
    }

    if (sanitizedPrompt.length > 4000) {
      return res.status(400).json({ 
        error: 'Prompt too long (max 4000 characters)',
        success: false 
      });
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content: systemPrompt || "You are a helpful AI assistant for LifeOS, a comprehensive life management application. Provide clear, actionable advice and insights."
      },
      {
        role: "user",
        content: sanitizedPrompt
      }
    ];

    // Add context if provided
    if (context && Object.keys(context).length > 0) {
      messages.push({
        role: "system",
        content: `Additional context: ${JSON.stringify(context)}`
      });
    }

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    const response = completion.choices[0].message.content;
    
    // Track usage
    const usage = {
      prompt_tokens: completion.usage.prompt_tokens,
      completion_tokens: completion.usage.completion_tokens,
      total_tokens: completion.usage.total_tokens,
      feature_type: featureType,
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      result: response,
      usage: usage,
      featureType: featureType,
      model: model
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
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
    
    res.status(500).json({
      error: 'OpenAI service error',
      success: false
    });
  }
});

// AI Features endpoint - returns available AI features
app.get('/api/ai/features', (req, res) => {
  const features = {
    'goal_analysis': 'Analyze and optimize user goals',
    'goal_recommendations': 'Generate personalized goal suggestions',
    'smart_goal_creation': 'Create SMART goals from natural language',
    'project_analysis': 'Analyze project timelines and risks',
    'task_prioritization': 'Prioritize tasks using AI',
    'habit_analysis': 'Analyze habit consistency and patterns',
    'habit_recommendations': 'Suggest new habits based on goals',
    'health_insights': 'Analyze health data and provide insights',
    'workout_recommendations': 'Suggest personalized workout plans',
    'financial_analysis': 'Analyze spending patterns and provide insights',
    'budget_recommendations': 'Suggest budget optimizations',
    'learning_path_optimization': 'Optimize learning paths and skill development',
    'skill_gap_analysis': 'Identify skill gaps and development opportunities',
    'time_analysis': 'Analyze time usage and productivity patterns',
    'productivity_optimization': 'Suggest productivity improvements',
    'mood_analysis': 'Analyze mood patterns and emotional well-being',
    'journal_insights': 'Provide insights from journal entries',
    'natural_language_task_creation': 'Convert natural language to structured tasks',
    'content_generation': 'Generate content and insights',
    'data_analysis': 'Analyze user data and provide insights'
  };

  res.status(200).json({
    success: true,
    features: features,
    total_features: Object.keys(features).length
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        success: false
      });
    }

    // Check if OpenAI is configured
    if (!openai) {
      return res.status(503).json({
        error: 'OpenAI service is not configured. Please set OPENAI_API_KEY environment variable.',
        success: false
      });
    }

    // Use OpenAI for real AI responses
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for FlowState, a comprehensive life management application. Help users with task management, productivity, and life organization. Provide clear, actionable advice."
        },
        {
          role: "user",
          content: message
        }
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

    res.status(200).json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    // Handle specific OpenAI errors
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
    
    res.status(500).json({
      error: 'AI chat failed',
      success: false
    });
  }
});

// Tasks endpoints
app.get('/api/tasks', async (req, res) => {
  try {
    // Mock tasks data
    const tasks = [
      {
        id: '1',
        title: 'Sample Task 1',
        description: 'This is a sample task',
        status: 'pending',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Sample Task 2',
        description: 'Another sample task',
        status: 'completed',
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      tasks: tasks,
      total: tasks.length
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: 'Failed to get tasks',
      success: false
    });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, type = 'task', priority = 'medium' } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Title is required',
        success: false
      });
    }

    // Mock task creation
    const newTask = {
      id: Date.now().toString(),
      title,
      description: description || '',
      type,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      task: newTask,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Failed to create task',
      success: false
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    success: false
  });
});


// Apple Reminders Integration endpoints (legacy - keeping for backward compatibility)
app.get('/api/integrations/apple-reminders/status', (req, res) => {
  try {
    // Check if running on Apple device
    const userAgent = req.headers['user-agent'] || '';
    const isAppleDevice = userAgent.includes('iPhone') || 
                          userAgent.includes('iPad') || 
                          userAgent.includes('Mac');
    
    res.status(200).json({
      success: true,
      data: {
        supported: isAppleDevice,
        connected: false, // Mock status
        lastSync: null,
        deviceType: isAppleDevice ? 'apple' : 'other',
        message: isAppleDevice ? 'Apple device detected' : 'Apple Reminders not available on this device'
      }
    });
  } catch (error) {
    console.error('Apple Reminders status error:', error);
    res.status(500).json({
      error: 'Failed to get Apple Reminders status',
      success: false
    });
  }
});

app.post('/api/integrations/apple-reminders/connect', (req, res) => {
  try {
    // Mock connection - in real implementation, this would request permissions
    res.status(200).json({
      success: true,
      data: {
        connected: true,
        message: 'Successfully connected to Apple Reminders (Mock)',
        permissions: {
          read: true,
          write: true,
          delete: true
        }
      }
    });
  } catch (error) {
    console.error('Apple Reminders connect error:', error);
    res.status(500).json({
      error: 'Failed to connect to Apple Reminders',
      success: false
    });
  }
});

app.get('/api/integrations/apple-reminders/reminders', (req, res) => {
  try {
    // Mock reminders data
    const mockReminders = [
      {
        id: 'reminder_1',
        title: 'Buy groceries',
        notes: 'Milk, eggs, bread, and vegetables',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        completed: false,
        list: 'Shopping',
        location: 'Whole Foods Market',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        modifiedAt: new Date().toISOString()
      },
      {
        id: 'reminder_2',
        title: 'Call dentist',
        notes: 'Schedule annual checkup',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        completed: false,
        list: 'Health',
        location: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        modifiedAt: new Date().toISOString()
      },
      {
        id: 'reminder_3',
        title: 'Finish project report',
        notes: 'Complete the quarterly project report',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        completed: true,
        list: 'Work',
        location: null,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        modifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        reminders: mockReminders,
        count: mockReminders.length,
        lastSync: new Date().toISOString(),
        message: 'Mock reminders fetched successfully'
      }
    });
  } catch (error) {
    console.error('Apple Reminders fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch Apple Reminders',
      success: false
    });
  }
});

app.post('/api/integrations/apple-reminders/reminders', (req, res) => {
  try {
    const { title, notes, dueDate, priority = 'medium', list = 'Default' } = req.body;
    
    if (!title) {
      return res.status(400).json({
        error: 'Title is required',
        success: false
      });
    }

    // Mock creating a new reminder
    const newReminder = {
      id: `reminder_${Date.now()}`,
      title,
      notes: notes || '',
      dueDate: dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority,
      completed: false,
      list,
      location: null,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: {
        reminder: newReminder,
        message: 'Reminder created successfully (Mock)'
      }
    });
  } catch (error) {
    console.error('Apple Reminders create error:', error);
    res.status(500).json({
      error: 'Failed to create Apple Reminder',
      success: false
    });
  }
});

app.put('/api/integrations/apple-reminders/reminders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, notes, dueDate, priority, completed, list } = req.body;

    // Mock updating a reminder
    const updatedReminder = {
      id,
      title: title || 'Updated Reminder',
      notes: notes || '',
      dueDate: dueDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: priority || 'medium',
      completed: completed || false,
      list: list || 'Default',
      location: null,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      modifiedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: {
        reminder: updatedReminder,
        message: 'Reminder updated successfully (Mock)'
      }
    });
  } catch (error) {
    console.error('Apple Reminders update error:', error);
    res.status(500).json({
      error: 'Failed to update Apple Reminder',
      success: false
    });
  }
});

app.delete('/api/integrations/apple-reminders/reminders/:id', (req, res) => {
  try {
    const { id } = req.params;

    res.status(200).json({
      success: true,
      data: {
        id,
        message: 'Reminder deleted successfully (Mock)'
      }
    });
  } catch (error) {
    console.error('Apple Reminders delete error:', error);
    res.status(500).json({
      error: 'Failed to delete Apple Reminder',
      success: false
    });
  }
});

// Import integration controller
const IntegrationController = require('./src/controllers/integrationController');
const integrationController = new IntegrationController();

// Integration management routes
app.use('/api/integrations', integrationController.router);

// Analytics endpoint for frontend
app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      pageViews: 0,
      userEngagement: 0,
      tasksCreated: 0,
      projectsCreated: 0,
      goalsSet: 0,
      habitsTracked: 0,
      returnVisits: 0
    },
    message: 'Analytics endpoint - mock data for demo'
  });
});

// POST analytics endpoint (for tracking)
app.post('/api/analytics', (req, res) => {
  res.json({
    success: true,
    message: 'Analytics data received'
  });
});

// Global capture endpoint (protected)
app.post('/api/capture', optionalAuth, async (req, res) => {
  try {
    const { text, type = 'task' } = req.body;
    
    // Input validation
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for capture'
      });
    }
    
    if (text.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Text too long (max 1000 characters)'
      });
    }
    
    // Sanitize input
    const sanitizedText = text.trim().substring(0, 1000);
    
    // Parse the captured text (simple parsing for demo)
    const parsedData = {
      title: sanitizedText,
      description: `Captured: ${sanitizedText}`,
      type: type,
      priority: sanitizedText.toLowerCase().includes('urgent') || sanitizedText.toLowerCase().includes('asap') ? 'High' : 'Medium',
      status: 'Not Started',
      created_at: new Date().toISOString(),
      user_id: req.userId || 'demo-user-1' // Use authenticated user ID if available
    };
    
    // In a real app, you'd save this to your database
    // For demo, we'll just return the parsed data
    
    res.json({
      success: true,
      data: parsedData,
      message: 'Item captured successfully'
    });
    
  } catch (error) {
    console.error('Capture error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture item'
    });
  }
});

// Agenda endpoints
app.get('/api/agenda/week', (req, res) => {
  res.json({
    success: true,
    data: {
      week: [],
      scheduled: [],
      available: []
    },
    message: 'Agenda endpoint - mock data for demo'
  });
});

// Site analytics endpoint
app.post('/api/site/home', (req, res) => {
  res.json({
    success: true,
    message: 'Site analytics data received'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// System status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'operational',
    services: {
      database: supabase ? 'connected' : 'disconnected',
      stripe: stripeClient ? 'connected' : 'disconnected',
      analytics: 'operational',
      capture: 'operational'
    },
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

app.listen(PORT, () => {
  console.log(`🚀 LifeOS Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
  console.log(`🤖 AI endpoints: http://localhost:${PORT}/api/ai/*`);
  console.log(`🍎 Apple Reminders: http://localhost:${PORT}/api/integrations/apple-reminders/*`);
});
