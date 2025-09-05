-- Life OS Database Migration Script
-- This script adds missing columns and tables to existing schema
-- Run this AFTER the main schema to add missing features

-- Add missing columns to existing projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#3B82F6';

-- Add missing columns to existing tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS priority_matrix VARCHAR(50) DEFAULT 'Priority 4. Low',
ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS deadline_date DATE,
ADD COLUMN IF NOT EXISTS daily_priority INTEGER DEFAULT 0 CHECK (daily_priority >= 0 AND daily_priority <= 5),
ADD COLUMN IF NOT EXISTS dependency_report VARCHAR(50) DEFAULT 'Actionable' CHECK (dependency_report IN ('Actionable', 'Waiting', 'Delegated', 'Someday')),
ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS time_tracker_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_tracker_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update tasks table to use 'name' instead of 'title' if needed
UPDATE public.tasks SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- Create life_areas table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.life_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Add life_area_id to existing tables if not exists
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS life_area_id UUID REFERENCES public.life_areas(id) ON DELETE SET NULL;

ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS life_area_id UUID REFERENCES public.life_areas(id) ON DELETE SET NULL;

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS life_area_id UUID REFERENCES public.life_areas(id) ON DELETE SET NULL;

-- Create relationship tables
CREATE TABLE IF NOT EXISTS public.task_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, project_id)
);

CREATE TABLE IF NOT EXISTS public.task_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, goal_id)
);

CREATE TABLE IF NOT EXISTS public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocking_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  blocked_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'depends_on')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocking_task_id, blocked_task_id),
  CHECK (blocking_task_id != blocked_task_id)
);

CREATE TABLE IF NOT EXISTS public.time_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('Daily', 'Weekly', 'Monthly')),
  report_date DATE NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  do_today BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_life_area ON public.tasks(life_area_id);
CREATE INDEX IF NOT EXISTS idx_tasks_do_date ON public.tasks(do_date);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON public.tasks(deadline_date);
CREATE INDEX IF NOT EXISTS idx_tasks_important ON public.tasks(is_important);
CREATE INDEX IF NOT EXISTS idx_tasks_urgent ON public.tasks(is_urgent);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON public.tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority_matrix ON public.tasks(priority_matrix);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_life_area ON public.projects(life_area_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_life_area ON public.goals(life_area_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);

CREATE INDEX IF NOT EXISTS idx_life_areas_user_id ON public.life_areas(user_id);

CREATE INDEX IF NOT EXISTS idx_task_projects_task ON public.task_projects(task_id);
CREATE INDEX IF NOT EXISTS idx_task_projects_project ON public.task_projects(project_id);

CREATE INDEX IF NOT EXISTS idx_task_goals_task ON public.task_goals(task_id);
CREATE INDEX IF NOT EXISTS idx_task_goals_goal ON public.task_goals(goal_id);

CREATE INDEX IF NOT EXISTS idx_task_dependencies_blocking ON public.task_dependencies(blocking_task_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_blocked ON public.task_dependencies(blocked_task_id);

CREATE INDEX IF NOT EXISTS idx_time_tracking_task ON public.time_tracking(task_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_user ON public.time_tracking(user_id);

-- Enable RLS on new tables
ALTER TABLE public.life_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Users can view own life areas" ON public.life_areas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own life areas" ON public.life_areas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own life areas" ON public.life_areas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own life areas" ON public.life_areas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own task projects" ON public.task_projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_projects.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task projects" ON public.task_projects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_projects.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task projects" ON public.task_projects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_projects.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task projects" ON public.task_projects FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_projects.task_id AND tasks.user_id = auth.uid())
);

CREATE POLICY "Users can view own task goals" ON public.task_goals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task goals" ON public.task_goals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task goals" ON public.task_goals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task goals" ON public.task_goals FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_goals.task_id AND tasks.user_id = auth.uid())
);

CREATE POLICY "Users can view own task dependencies" ON public.task_dependencies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.blocking_task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task dependencies" ON public.task_dependencies FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.blocking_task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task dependencies" ON public.task_dependencies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.blocking_task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task dependencies" ON public.task_dependencies FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.blocking_task_id AND tasks.user_id = auth.uid())
);

CREATE POLICY "Users can view own time tracking" ON public.time_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own time tracking" ON public.time_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own time tracking" ON public.time_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own time tracking" ON public.time_tracking FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own task reports" ON public.task_reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_reports.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task reports" ON public.task_reports FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_reports.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task reports" ON public.task_reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_reports.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task reports" ON public.task_reports FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_reports.task_id AND tasks.user_id = auth.uid())
);

CREATE POLICY "Users can view own task templates" ON public.task_templates FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own task templates" ON public.task_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own task templates" ON public.task_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own task templates" ON public.task_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own task comments" ON public.task_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_comments.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task comments" ON public.task_comments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_comments.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task comments" ON public.task_comments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_comments.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task comments" ON public.task_comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_comments.task_id AND tasks.user_id = auth.uid())
);

CREATE POLICY "Users can view own task attachments" ON public.task_attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_attachments.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task attachments" ON public.task_attachments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_attachments.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task attachments" ON public.task_attachments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_attachments.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task attachments" ON public.task_attachments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_attachments.task_id AND tasks.user_id = auth.uid())
);

CREATE POLICY "Users can view own task history" ON public.task_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_history.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can insert own task history" ON public.task_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_history.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can update own task history" ON public.task_history FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_history.task_id AND tasks.user_id = auth.uid())
);
CREATE POLICY "Users can delete own task history" ON public.task_history FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_history.task_id AND tasks.user_id = auth.uid())
);

-- Insert sample data for testing
INSERT INTO public.life_areas (user_id, name, description, color, icon, sort_order) VALUES
('00000000-0000-0000-0000-000000000000', 'Personal Growth', 'Focus on self-improvement and learning', '#3B82F6', '🌱', 1),
('00000000-0000-0000-0000-000000000000', 'Health & Fitness', 'Maintain physical and mental well-being', '#10B981', '💪', 2),
('00000000-0000-0000-0000-000000000000', 'Finances', 'Manage money and investments', '#F59E0B', '💰', 3),
('00000000-0000-0000-0000-000000000000', 'Career', 'Develop professional skills and advance career', '#8B5CF6', '💼', 4),
('00000000-0000-0000-0000-000000000000', 'Family', 'Nurture relationships with family', '#EC4899', '👨‍👩‍👧‍👦', 5),
('00000000-0000-0000-0000-000000000000', 'Home', 'Create a comfortable and organized living space', '#6B7280', '🏡', 6),
('00000000-0000-0000-0000-000000000000', 'Social', 'Connect with friends and community', '#F97316', '🤝', 7),
('00000000-0000-0000-0000-000000000000', 'Hobbies', 'Pursue interests and passions', '#84CC16', '🎨', 8)
ON CONFLICT (user_id, name) DO NOTHING;
