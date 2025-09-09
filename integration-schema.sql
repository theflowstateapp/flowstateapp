-- LifeOS Integration Database Schema Extensions
-- This script extends the existing schema to support third-party integrations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Integration Connections Table
-- Stores OAuth connections and integration settings for each user
CREATE TABLE IF NOT EXISTS public.integration_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_user_id VARCHAR(255),
  provider_user_email VARCHAR(255),
  provider_user_name VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_frequency VARCHAR(20) DEFAULT 'hourly' CHECK (sync_frequency IN ('realtime', '15min', 'hourly', 'daily', 'weekly')),
  sync_enabled BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Sync History Table
-- Tracks all synchronization activities for monitoring and debugging
CREATE TABLE IF NOT EXISTS public.sync_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_id UUID REFERENCES public.integration_connections(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  sync_type VARCHAR(20) NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual', 'webhook')),
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound', 'bidirectional')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  items_synced INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  items_deleted INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  error_details JSONB,
  warning_details JSONB,
  metadata JSONB DEFAULT '{}'
);

-- Webhook Subscriptions Table
-- Manages webhook subscriptions for real-time updates
CREATE TABLE IF NOT EXISTS public.webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_id UUID REFERENCES public.integration_connections(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_id VARCHAR(255),
  events TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Data Mapping Table
-- Maps data between LifeOS and third-party platforms
CREATE TABLE IF NOT EXISTS public.integration_data_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_id UUID REFERENCES public.integration_connections(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  lifeos_type VARCHAR(50) NOT NULL CHECK (lifeos_type IN ('task', 'project', 'goal', 'event', 'note', 'contact')),
  lifeos_id UUID NOT NULL,
  provider_type VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_data JSONB,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_status VARCHAR(20) DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider, lifeos_type, lifeos_id),
  UNIQUE(user_id, provider, provider_type, provider_id)
);

-- Integration Settings Table
-- Stores user-specific settings for each integration
CREATE TABLE IF NOT EXISTS public.integration_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_id UUID REFERENCES public.integration_connections(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider, setting_key)
);

-- Integration Analytics Table
-- Tracks usage analytics for integrations
CREATE TABLE IF NOT EXISTS public.integration_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_id UUID REFERENCES public.integration_connections(id) ON DELETE CASCADE NOT NULL,
  provider VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC,
  metric_unit VARCHAR(20),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Integration Errors Table
-- Logs integration errors for debugging and monitoring
CREATE TABLE IF NOT EXISTS public.integration_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_id UUID REFERENCES public.integration_connections(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  error_type VARCHAR(50) NOT NULL,
  error_code VARCHAR(50),
  error_message TEXT NOT NULL,
  error_details JSONB,
  stack_trace TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_integration_connections_user_id ON public.integration_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_connections_provider ON public.integration_connections(provider);
CREATE INDEX IF NOT EXISTS idx_integration_connections_active ON public.integration_connections(is_active);

CREATE INDEX IF NOT EXISTS idx_sync_history_user_id ON public.sync_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_integration_id ON public.sync_history(integration_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_provider ON public.sync_history(provider);
CREATE INDEX IF NOT EXISTS idx_sync_history_status ON public.sync_history(status);
CREATE INDEX IF NOT EXISTS idx_sync_history_started_at ON public.sync_history(started_at);

CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_user_id ON public.webhook_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_integration_id ON public.webhook_subscriptions(integration_id);
CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_active ON public.webhook_subscriptions(is_active);

CREATE INDEX IF NOT EXISTS idx_integration_data_mapping_user_id ON public.integration_data_mapping(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_data_mapping_integration_id ON public.integration_data_mapping(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_data_mapping_lifeos_id ON public.integration_data_mapping(lifeos_id);
CREATE INDEX IF NOT EXISTS idx_integration_data_mapping_provider_id ON public.integration_data_mapping(provider_id);

CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON public.integration_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_integration_id ON public.integration_settings(integration_id);

CREATE INDEX IF NOT EXISTS idx_integration_analytics_user_id ON public.integration_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_analytics_integration_id ON public.integration_analytics(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_analytics_recorded_at ON public.integration_analytics(recorded_at);

CREATE INDEX IF NOT EXISTS idx_integration_errors_user_id ON public.integration_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_integration_errors_integration_id ON public.integration_errors(integration_id);
CREATE INDEX IF NOT EXISTS idx_integration_errors_provider ON public.integration_errors(provider);
CREATE INDEX IF NOT EXISTS idx_integration_errors_created_at ON public.integration_errors(created_at);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_integration_connections_updated_at 
    BEFORE UPDATE ON public.integration_connections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_subscriptions_updated_at 
    BEFORE UPDATE ON public.webhook_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_data_mapping_updated_at 
    BEFORE UPDATE ON public.integration_data_mapping 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_settings_updated_at 
    BEFORE UPDATE ON public.integration_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_data_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_errors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integration_connections
CREATE POLICY "Users can view their own integration connections" ON public.integration_connections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration connections" ON public.integration_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration connections" ON public.integration_connections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration connections" ON public.integration_connections
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for sync_history
CREATE POLICY "Users can view their own sync history" ON public.sync_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync history" ON public.sync_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for webhook_subscriptions
CREATE POLICY "Users can view their own webhook subscriptions" ON public.webhook_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own webhook subscriptions" ON public.webhook_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhook subscriptions" ON public.webhook_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhook subscriptions" ON public.webhook_subscriptions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for integration_data_mapping
CREATE POLICY "Users can view their own data mappings" ON public.integration_data_mapping
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data mappings" ON public.integration_data_mapping
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data mappings" ON public.integration_data_mapping
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data mappings" ON public.integration_data_mapping
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for integration_settings
CREATE POLICY "Users can view their own integration settings" ON public.integration_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration settings" ON public.integration_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration settings" ON public.integration_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integration settings" ON public.integration_settings
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for integration_analytics
CREATE POLICY "Users can view their own integration analytics" ON public.integration_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration analytics" ON public.integration_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for integration_errors
CREATE POLICY "Users can view their own integration errors" ON public.integration_errors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integration errors" ON public.integration_errors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integration errors" ON public.integration_errors
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.integration_connections TO authenticated;
GRANT ALL ON public.sync_history TO authenticated;
GRANT ALL ON public.webhook_subscriptions TO authenticated;
GRANT ALL ON public.integration_data_mapping TO authenticated;
GRANT ALL ON public.integration_settings TO authenticated;
GRANT ALL ON public.integration_analytics TO authenticated;
GRANT ALL ON public.integration_errors TO authenticated;

-- Insert sample data for testing (optional)
-- INSERT INTO public.integration_connections (user_id, provider, provider_user_id, is_active) 
-- VALUES ('your-user-id', 'google_calendar', 'google-user-id', true);

-- Create views for easier querying
CREATE OR REPLACE VIEW public.integration_summary AS
SELECT 
    ic.user_id,
    ic.provider,
    ic.is_active,
    ic.last_sync_at,
    ic.sync_frequency,
    COUNT(sh.id) as total_syncs,
    COUNT(CASE WHEN sh.status = 'completed' THEN 1 END) as successful_syncs,
    COUNT(CASE WHEN sh.status = 'failed' THEN 1 END) as failed_syncs,
    AVG(sh.duration_ms) as avg_sync_duration,
    COUNT(ie.id) as total_errors,
    COUNT(CASE WHEN ie.is_resolved = false THEN 1 END) as unresolved_errors
FROM public.integration_connections ic
LEFT JOIN public.sync_history sh ON ic.id = sh.integration_id
LEFT JOIN public.integration_errors ie ON ic.id = ie.integration_id
GROUP BY ic.id, ic.user_id, ic.provider, ic.is_active, ic.last_sync_at, ic.sync_frequency;

-- Grant access to the view
GRANT SELECT ON public.integration_summary TO authenticated;




