-- LifeOS Database Schema for Data Relationships and AI Integration
-- This schema ensures all data is properly linked and AI can analyze complete user data

-- Users table with subscription info
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  subscription_status VARCHAR(20) DEFAULT 'free',
  subscription_tier VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Areas table (PARA method)
CREATE TABLE areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table linked to areas
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  priority VARCHAR(20) DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  due_date DATE,
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table linked to projects
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goals table linked to areas
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  priority VARCHAR(20) DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goal milestones
CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  frequency VARCHAR(20) DEFAULT 'daily',
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  reminder_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habit check-ins
CREATE TABLE habit_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Journal entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Health records
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2),
  unit VARCHAR(20),
  notes TEXT,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- Financial records
CREATE TABLE financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'income' or 'expense'
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning sessions
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_name VARCHAR(255),
  topic VARCHAR(255),
  duration_minutes INTEGER,
  progress_percentage INTEGER,
  notes TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  limits JSONB NOT NULL,
  features TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status VARCHAR(20) DEFAULT 'active',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  amount INTEGER DEFAULT 1,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- AI usage logs
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL,
  prompt TEXT,
  context JSONB,
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  model_used VARCHAR(50) DEFAULT 'gpt-4',
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  request_data JSONB,
  response_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage alerts
CREATE TABLE usage_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Billing history
CREATE TABLE billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  invoice_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, limits, features) VALUES
('free', 0, '{
  "ai_requests": 50,
  "ai_tokens": 50000,
  "storage_gb": 0.5,
  "projects": 5,
  "tasks": 100,
  "goals": 10,
  "habits": 10,
  "journal_entries": 50,
  "health_records": 100,
  "financial_records": 100,
  "learning_sessions": 50
}', ARRAY[
  'Basic goal tracking',
  'Simple habit tracking',
  'Task management',
  'Basic health metrics',
  'Email support'
]),
('pro', 999, '{
  "ai_requests": 500,
  "ai_tokens": 500000,
  "storage_gb": 10,
  "projects": 50,
  "tasks": 1000,
  "goals": 100,
  "habits": 50,
  "journal_entries": 500,
  "health_records": 1000,
  "financial_records": 1000,
  "learning_sessions": 500
}', ARRAY[
  'Advanced goal setting & milestones',
  'Project & task management',
  'Comprehensive habit tracking',
  'Health & wellness dashboard',
  'Finance tracking',
  'Learning & skill development',
  'Journal & reflection tools',
  'Priority support',
  'Data export',
  'AI-powered insights',
  'Advanced analytics',
  'Smart recommendations',
  'Personalized insights'
]),
('enterprise', 2499, '{
  "ai_requests": 2000,
  "ai_tokens": 2000000,
  "storage_gb": 100,
  "projects": 200,
  "tasks": 5000,
  "goals": 500,
  "habits": 200,
  "journal_entries": 2000,
  "health_records": 5000,
  "financial_records": 5000,
  "learning_sessions": 2000
}', ARRAY[
  'Everything in Pro',
  'Team collaboration',
  'Shared goals & projects',
  'Family health tracking',
  'Team analytics',
  'Admin dashboard',
  'API access',
  'Dedicated support',
  'Custom integrations',
  'White-label options',
  'Advanced AI features',
  'Custom AI training'
]);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_area_id ON projects(area_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_area_id ON goals(area_id);
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);

-- Create functions for usage tracking
CREATE OR REPLACE FUNCTION get_user_usage(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  plan_name VARCHAR(50),
  ai_requests BIGINT,
  ai_requests_limit INTEGER,
  ai_tokens BIGINT,
  ai_tokens_limit INTEGER,
  storage_bytes BIGINT,
  storage_limit_bytes BIGINT,
  projects_count BIGINT,
  projects_limit INTEGER,
  tasks_count BIGINT,
  tasks_limit INTEGER,
  goals_count BIGINT,
  goals_limit INTEGER,
  habits_count BIGINT,
  habits_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    sp.name,
    COALESCE(ai_usage.ai_requests, 0),
    sp.limits->>'ai_requests'::INTEGER,
    COALESCE(ai_usage.ai_tokens, 0),
    sp.limits->>'ai_tokens'::INTEGER,
    COALESCE(storage_usage.storage_bytes, 0),
    (sp.limits->>'storage_gb')::INTEGER * 1024 * 1024 * 1024,
    COALESCE(projects_count.count, 0),
    sp.limits->>'projects'::INTEGER,
    COALESCE(tasks_count.count, 0),
    sp.limits->>'tasks'::INTEGER,
    COALESCE(goals_count.count, 0),
    sp.limits->>'goals'::INTEGER,
    COALESCE(habits_count.count, 0),
    sp.limits->>'habits'::INTEGER
  FROM users u
  LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
  LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as ai_requests, SUM(total_tokens) as ai_tokens
    FROM ai_usage_logs 
    WHERE user_id = p_user_id 
    AND timestamp >= date_trunc('month', CURRENT_DATE)
    GROUP BY user_id
  ) ai_usage ON u.id = ai_usage.user_id
  LEFT JOIN (
    SELECT user_id, SUM(amount) as storage_bytes
    FROM usage_logs 
    WHERE user_id = p_user_id 
    AND category = 'storage_bytes'
    AND timestamp >= date_trunc('month', CURRENT_DATE)
    GROUP BY user_id
  ) storage_usage ON u.id = storage_usage.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM projects 
    WHERE user_id = p_user_id
    GROUP BY user_id
  ) projects_count ON u.id = projects_count.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM tasks 
    WHERE user_id = p_user_id
    GROUP BY user_id
  ) tasks_count ON u.id = tasks_count.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM goals 
    WHERE user_id = p_user_id
    GROUP BY user_id
  ) goals_count ON u.id = goals_count.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM habits 
    WHERE user_id = p_user_id
    GROUP BY user_id
  ) habits_count ON u.id = habits_count.user_id
  WHERE u.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to track AI usage
CREATE OR REPLACE FUNCTION track_ai_usage(
  p_user_id UUID,
  p_feature_type VARCHAR(50),
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_model_used VARCHAR(50),
  p_request_data JSONB,
  p_response_data JSONB
) RETURNS JSONB AS $$
DECLARE
  usage_id UUID;
BEGIN
  INSERT INTO ai_usage_logs (
    user_id, 
    feature_type, 
    input_tokens, 
    output_tokens, 
    total_tokens, 
    model_used, 
    request_data, 
    response_data
  ) VALUES (
    p_user_id,
    p_feature_type,
    p_input_tokens,
    p_output_tokens,
    p_input_tokens + p_output_tokens,
    p_model_used,
    p_request_data,
    p_response_data
  ) RETURNING id INTO usage_id;
  
  RETURN jsonb_build_object('usage_id', usage_id);
END;
$$ LANGUAGE plpgsql;
