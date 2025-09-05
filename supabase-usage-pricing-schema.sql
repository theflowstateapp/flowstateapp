-- Life OS Usage-Based Pricing Schema
-- Similar to OpenAI's pricing model with free tier and usage-based billing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) DEFAULT 0.00,
  price_yearly DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Usage Limits (similar to OpenAI's model)
  free_ai_requests_per_month INTEGER DEFAULT 0,
  free_ai_tokens_per_month INTEGER DEFAULT 0,
  free_storage_gb DECIMAL(5,2) DEFAULT 0.00,
  free_projects_per_month INTEGER DEFAULT 0,
  free_tasks_per_month INTEGER DEFAULT 0,
  
  -- AI Usage Pricing (per 1000 tokens)
  ai_input_token_price DECIMAL(10,6) DEFAULT 0.00,
  ai_output_token_price DECIMAL(10,6) DEFAULT 0.00,
  
  -- Additional Features
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  
  -- Subscription Details
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  
  -- Payment Details
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  payment_method_id VARCHAR(255),
  
  -- Usage Tracking
  ai_requests_used_this_period INTEGER DEFAULT 0,
  ai_tokens_used_this_period INTEGER DEFAULT 0,
  storage_used_gb DECIMAL(5,2) DEFAULT 0.00,
  projects_created_this_period INTEGER DEFAULT 0,
  tasks_created_this_period INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- AI Usage Tracking Table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Usage Details
  feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('task_analysis', 'project_analysis', 'goal_analysis', 'habit_suggestions', 'time_optimization', 'content_generation')),
  model_used VARCHAR(50) DEFAULT 'gpt-4',
  
  -- Token Usage
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  
  -- Cost Calculation
  input_cost DECIMAL(10,6) DEFAULT 0.00,
  output_cost DECIMAL(10,6) DEFAULT 0.00,
  total_cost DECIMAL(10,6) DEFAULT 0.00,
  
  -- Request Details
  request_data JSONB,
  response_data JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing History Table
CREATE TABLE IF NOT EXISTS public.billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  
  -- Billing Details
  billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Usage Summary
  ai_requests_used INTEGER DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  storage_used_gb DECIMAL(5,2) DEFAULT 0.00,
  projects_created INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  
  -- Cost Breakdown
  base_plan_cost DECIMAL(10,2) DEFAULT 0.00,
  usage_cost DECIMAL(10,2) DEFAULT 0.00,
  total_cost DECIMAL(10,2) DEFAULT 0.00,
  
  -- Payment Details
  stripe_invoice_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Alerts Table
CREATE TABLE IF NOT EXISTS public.usage_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('usage_threshold', 'billing_reminder', 'payment_failed', 'plan_upgrade_suggested')),
  threshold_percentage INTEGER DEFAULT 80,
  current_usage INTEGER DEFAULT 0,
  limit_amount INTEGER DEFAULT 0,
  
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Insert default subscription plans (Indian market pricing)
INSERT INTO public.subscription_plans (name, display_name, description, price_monthly, price_yearly, currency, free_ai_requests_per_month, free_ai_tokens_per_month, free_storage_gb, free_projects_per_month, free_tasks_per_month, ai_input_token_price, ai_output_token_price, features, is_popular, sort_order) VALUES
(
  'free',
  'Free',
  'Perfect for getting started with Life OS',
  0.00,
  0.00,
  'INR',
  50, -- 50 AI requests per month
  50000, -- 50k tokens per month
  0.5, -- 500MB storage
  5, -- 5 projects per month
  100, -- 100 tasks per month
  0.0001, -- ₹0.0001 per input token
  0.0002, -- ₹0.0002 per output token
  '["Basic goal tracking", "Simple habit tracking", "Task management", "Basic health metrics", "Email support"]',
  false,
  1
),
(
  'pro',
  'Pro',
  'Complete life management system for professionals',
  999.00, -- ₹999/month
  9999.00, -- ₹9999/year (2 months free)
  'INR',
  500, -- 500 AI requests per month
  500000, -- 500k tokens per month
  10.0, -- 10GB storage
  50, -- 50 projects per month
  1000, -- 1000 tasks per month
  0.00008, -- ₹0.00008 per input token (20% discount)
  0.00015, -- ₹0.00015 per output token (25% discount)
  '["Advanced goal setting & milestones", "Project & task management", "Comprehensive habit tracking", "Health & wellness dashboard", "Finance tracking", "Learning & skill development", "Journal & reflection tools", "Priority support", "Data export", "AI-powered insights", "Advanced analytics"]',
  true,
  2
),
(
  'enterprise',
  'Enterprise',
  'For teams and organizations',
  2499.00, -- ₹2499/month
  24999.00, -- ₹24999/year (2 months free)
  'INR',
  2000, -- 2000 AI requests per month
  2000000, -- 2M tokens per month
  100.0, -- 100GB storage
  200, -- 200 projects per month
  5000, -- 5000 tasks per month
  0.00006, -- ₹0.00006 per input token (40% discount)
  0.00012, -- ₹0.00012 per output token (40% discount)
  '["Everything in Pro", "Team collaboration", "Shared goals & projects", "Family health tracking", "Team analytics", "Admin dashboard", "API access", "Dedicated support", "Custom integrations", "White-label options"]',
  false,
  3
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_feature_type ON public.ai_usage_logs(feature_type);

CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON public.billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_period ON public.billing_history(billing_period_start, billing_period_end);

CREATE INDEX IF NOT EXISTS idx_usage_alerts_user_id ON public.usage_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_alerts_is_read ON public.usage_alerts(is_read);

-- Create functions for usage tracking
CREATE OR REPLACE FUNCTION public.track_ai_usage(
  p_user_id UUID,
  p_feature_type VARCHAR(50),
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_model_used VARCHAR(50) DEFAULT 'gpt-4',
  p_request_data JSONB DEFAULT '{}',
  p_response_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usage_id UUID;
  v_subscription public.user_subscriptions;
  v_plan public.subscription_plans;
  v_input_cost DECIMAL(10,6);
  v_output_cost DECIMAL(10,6);
  v_total_cost DECIMAL(10,6);
BEGIN
  -- Get user's subscription and plan
  SELECT * INTO v_subscription 
  FROM public.user_subscriptions 
  WHERE user_id = p_user_id AND status = 'active';
  
  SELECT * INTO v_plan 
  FROM public.subscription_plans 
  WHERE id = v_subscription.plan_id;
  
  -- Calculate costs
  v_input_cost := (p_input_tokens / 1000.0) * v_plan.ai_input_token_price;
  v_output_cost := (p_output_tokens / 1000.0) * v_plan.ai_output_token_price;
  v_total_cost := v_input_cost + v_output_cost;
  
  -- Insert usage log
  INSERT INTO public.ai_usage_logs (
    user_id, feature_type, model_used, input_tokens, output_tokens, 
    total_tokens, input_cost, output_cost, total_cost, 
    request_data, response_data
  ) VALUES (
    p_user_id, p_feature_type, p_model_used, p_input_tokens, p_output_tokens,
    p_input_tokens + p_output_tokens, v_input_cost, v_output_cost, v_total_cost,
    p_request_data, p_response_data
  ) RETURNING id INTO v_usage_id;
  
  -- Update subscription usage
  IF v_subscription.id IS NOT NULL THEN
    UPDATE public.user_subscriptions 
    SET 
      ai_requests_used_this_period = ai_requests_used_this_period + 1,
      ai_tokens_used_this_period = ai_tokens_used_this_period + p_input_tokens + p_output_tokens,
      updated_at = NOW()
    WHERE id = v_subscription.id;
  END IF;
  
  RETURN v_usage_id;
END;
$$;

-- Function to get current usage for a user
CREATE OR REPLACE FUNCTION public.get_user_usage(p_user_id UUID)
RETURNS TABLE(
  plan_name VARCHAR(100),
  plan_display_name VARCHAR(100),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  ai_requests_used INTEGER,
  ai_requests_limit INTEGER,
  ai_tokens_used INTEGER,
  ai_tokens_limit INTEGER,
  storage_used_gb DECIMAL(5,2),
  storage_limit_gb DECIMAL(5,2),
  projects_created INTEGER,
  projects_limit INTEGER,
  tasks_created INTEGER,
  tasks_limit INTEGER,
  usage_percentage DECIMAL(5,2),
  estimated_cost DECIMAL(10,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.name,
    sp.display_name,
    us.current_period_start,
    us.current_period_end,
    us.ai_requests_used_this_period,
    sp.free_ai_requests_per_month,
    us.ai_tokens_used_this_period,
    sp.free_ai_tokens_per_month,
    us.storage_used_gb,
    sp.free_storage_gb,
    us.projects_created_this_period,
    sp.free_projects_per_month,
    us.tasks_created_this_period,
    sp.free_tasks_per_month,
    CASE 
      WHEN sp.free_ai_tokens_per_month > 0 THEN 
        (us.ai_tokens_used_this_period::DECIMAL / sp.free_ai_tokens_per_month::DECIMAL) * 100
      ELSE 0
    END as usage_percentage,
    CASE 
      WHEN us.ai_tokens_used_this_period > sp.free_ai_tokens_per_month THEN
        ((us.ai_tokens_used_this_period - sp.free_ai_tokens_per_month) / 1000.0) * 
        (sp.ai_input_token_price + sp.ai_output_token_price)
      ELSE 0
    END as estimated_cost
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id AND us.status = 'active';
END;
$$;

-- Function to check if user can use AI feature
CREATE OR REPLACE FUNCTION public.can_use_ai_feature(p_user_id UUID, p_feature_type VARCHAR(50))
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscription public.user_subscriptions;
  v_plan public.subscription_plans;
BEGIN
  -- Get user's subscription
  SELECT * INTO v_subscription 
  FROM public.user_subscriptions 
  WHERE user_id = p_user_id AND status = 'active';
  
  IF v_subscription.id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get plan details
  SELECT * INTO v_plan 
  FROM public.subscription_plans 
  WHERE id = v_subscription.plan_id;
  
  -- Check if user has exceeded limits
  IF v_subscription.ai_requests_used_this_period >= v_plan.free_ai_requests_per_month THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;
