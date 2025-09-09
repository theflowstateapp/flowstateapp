-- Planning System Tables
-- These tables support daily planning, weekly reviews, and agenda management

-- Day Reviews table (for daily shutdown/reflection)
CREATE TABLE IF NOT EXISTS public.day_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id VARCHAR(50) DEFAULT 'qa-ws',
  day DATE NOT NULL,
  completed_tasks INTEGER DEFAULT 0,
  carry_over_tasks INTEGER DEFAULT 0,
  flow_minutes INTEGER DEFAULT 0,
  highlights TEXT,
  challenges TEXT,
  gratitude TEXT,
  mood VARCHAR(50),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  productivity_score INTEGER CHECK (productivity_score >= 1 AND energy_level <= 5),
  lessons_learned TEXT,
  tomorrow_focus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, day)
);

-- Day Plans table (for tomorrow planning)
CREATE TABLE IF NOT EXISTS public.day_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id VARCHAR(50) DEFAULT 'qa-ws',
  day DATE NOT NULL,
  task_ids UUID[] DEFAULT '{}',
  scheduled JSONB DEFAULT '[]',
  planned_tasks JSONB DEFAULT '[]',
  time_blocks JSONB DEFAULT '[]',
  priorities TEXT[],
  energy_plan TEXT,
  backup_tasks JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, day)
);

-- Weekly Reviews table (for weekly planning)
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  workspace_id VARCHAR(50) DEFAULT 'qa-ws',
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  accomplishments TEXT[],
  challenges TEXT[],
  lessons_learned TEXT,
  next_week_priorities TEXT[],
  energy_insights TEXT,
  productivity_patterns TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workspace_id, week_start)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_day_reviews_user_day ON public.day_reviews(user_id, day);
CREATE INDEX IF NOT EXISTS idx_day_reviews_workspace ON public.day_reviews(workspace_id);
CREATE INDEX IF NOT EXISTS idx_day_plans_user_day ON public.day_plans(user_id, day);
CREATE INDEX IF NOT EXISTS idx_day_plans_workspace ON public.day_plans(workspace_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user_week ON public.weekly_reviews(user_id, week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_reviews_workspace ON public.weekly_reviews(workspace_id);

-- Enable row level security
ALTER TABLE public.day_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can manage their own day reviews" ON public.day_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own day plans" ON public.day_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own weekly reviews" ON public.weekly_reviews
  FOR ALL USING (auth.uid() = user_id);
