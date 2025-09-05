-- Life OS Complete Database Schema Migration (Safe Version - No Sample Data)
-- This script creates a complete schema with all required fields
-- It handles existing objects gracefully

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop and recreate tables to ensure complete schema
-- This is safe since tables are empty

-- Drop existing tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS public.task_history CASCADE;
DROP TABLE IF EXISTS public.task_attachments CASCADE;
DROP TABLE IF EXISTS public.task_comments CASCADE;
DROP TABLE IF EXISTS public.task_templates CASCADE;
DROP TABLE IF EXISTS public.task_reports CASCADE;
DROP TABLE IF EXISTS public.time_tracking CASCADE;
DROP TABLE IF EXISTS public.task_dependencies CASCADE;
DROP TABLE IF EXISTS public.task_goals CASCADE;
DROP TABLE IF EXISTS public.task_projects CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.goals CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.life_areas CASCADE;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Life Areas table (A in PARA)
CREATE TABLE public.life_areas (
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

-- Projects table (P in PARA)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  due_date DATE,
  start_date DATE,
  completed_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  life_area_id UUID REFERENCES public.life_areas(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tags TEXT[],
  image_url TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'On Hold')),
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  due_date DATE,
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  life_area_id UUID REFERENCES public.life_areas(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tags TEXT[],
  image_url TEXT,
  icon VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (comprehensive)
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Core Properties
  status VARCHAR(50) DEFAULT 'Inbox' CHECK (status IN ('Inbox', 'Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
  do_date DATE,
  start_date DATE,
  completed_date DATE,
  
  -- Task Management
  is_important BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  priority_matrix VARCHAR(50) DEFAULT 'Priority 4. Low',
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  deadline_date DATE,
  daily_priority INTEGER DEFAULT 0 CHECK (daily_priority >= 0 AND daily_priority <= 5),
  
  -- Dependencies
  dependency_report VARCHAR(50) DEFAULT 'Actionable' CHECK (dependency_report IN ('Actionable', 'Waiting', 'Delegated', 'Someday')),
  
  -- Relations
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  life_area_id UUID REFERENCES public.life_areas(id) ON DELETE SET NULL,
  
  -- Time Tracking
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  time_tracker_start TIMESTAMP WITH TIME ZONE,
  time_tracker_end TIMESTAMP WITH TIME ZONE,
  
  -- System
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task-Project relationships (Many-to-Many)
CREATE TABLE public.task_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, project_id)
);

-- Task-Goal relationships (Many-to-Many)
CREATE TABLE public.task_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, goal_id)
);

-- Task Dependencies (Many-to-Many for blocked by/blocking relationships)
CREATE TABLE public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocking_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  blocked_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  dependency_type VARCHAR(20) DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'depends_on')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocking_task_id, blocked_task_id),
  CHECK (blocking_task_id != blocked_task_id)
);

-- Time Tracking table
CREATE TABLE public.time_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Reports table
CREATE TABLE public.task_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('Daily', 'Weekly', 'Monthly')),
  report_date DATE NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  do_today BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Templates table
CREATE TABLE public.task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Comments table
CREATE TABLE public.task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Attachments table
CREATE TABLE public.task_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(100),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task History table (for audit trail)
CREATE TABLE public.task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  field_name VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
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

-- Create triggers for updated_at timestamps (only if they don't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goals_updated_at ON public.goals;
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_life_areas_updated_at ON public.life_areas;
CREATE TRIGGER update_life_areas_updated_at BEFORE UPDATE ON public.life_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_task_templates_updated_at ON public.task_templates;
CREATE TRIGGER update_task_templates_updated_at BEFORE UPDATE ON public.task_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_task_comments_updated_at ON public.task_comments;
CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON public.task_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Life areas policies
DROP POLICY IF EXISTS "Users can view own life areas" ON public.life_areas;
DROP POLICY IF EXISTS "Users can insert own life areas" ON public.life_areas;
DROP POLICY IF EXISTS "Users can update own life areas" ON public.life_areas;
DROP POLICY IF EXISTS "Users can delete own life areas" ON public.life_areas;

CREATE POLICY "Users can view own life areas" ON public.life_areas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own life areas" ON public.life_areas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own life areas" ON public.life_areas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own life areas" ON public.life_areas FOR DELETE USING (auth.uid() = user_id);

-- Projects policies
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;

CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Task projects policies
DROP POLICY IF EXISTS "Users can view own task projects" ON public.task_projects;
DROP POLICY IF EXISTS "Users can insert own task projects" ON public.task_projects;
DROP POLICY IF EXISTS "Users can update own task projects" ON public.task_projects;
DROP POLICY IF EXISTS "Users can delete own task projects" ON public.task_projects;

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

-- Task goals policies
DROP POLICY IF EXISTS "Users can view own task goals" ON public.task_goals;
DROP POLICY IF EXISTS "Users can insert own task goals" ON public.task_goals;
DROP POLICY IF EXISTS "Users can update own task goals" ON public.task_goals;
DROP POLICY IF EXISTS "Users can delete own task goals" ON public.task_goals;

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

-- Task dependencies policies
DROP POLICY IF EXISTS "Users can view own task dependencies" ON public.task_dependencies;
DROP POLICY IF EXISTS "Users can insert own task dependencies" ON public.task_dependencies;
DROP POLICY IF EXISTS "Users can update own task dependencies" ON public.task_dependencies;
DROP POLICY IF EXISTS "Users can delete own task dependencies" ON public.task_dependencies;

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

-- Time tracking policies
DROP POLICY IF EXISTS "Users can view own time tracking" ON public.time_tracking;
DROP POLICY IF EXISTS "Users can insert own time tracking" ON public.time_tracking;
DROP POLICY IF EXISTS "Users can update own time tracking" ON public.time_tracking;
DROP POLICY IF EXISTS "Users can delete own time tracking" ON public.time_tracking;

CREATE POLICY "Users can view own time tracking" ON public.time_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own time tracking" ON public.time_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own time tracking" ON public.time_tracking FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own time tracking" ON public.time_tracking FOR DELETE USING (auth.uid() = user_id);

-- Task reports policies
DROP POLICY IF EXISTS "Users can view own task reports" ON public.task_reports;
DROP POLICY IF EXISTS "Users can insert own task reports" ON public.task_reports;
DROP POLICY IF EXISTS "Users can update own task reports" ON public.task_reports;
DROP POLICY IF EXISTS "Users can delete own task reports" ON public.task_reports;

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

-- Task templates policies
DROP POLICY IF EXISTS "Users can view own task templates" ON public.task_templates;
DROP POLICY IF EXISTS "Users can insert own task templates" ON public.task_templates;
DROP POLICY IF EXISTS "Users can update own task templates" ON public.task_templates;
DROP POLICY IF EXISTS "Users can delete own task templates" ON public.task_templates;

CREATE POLICY "Users can view own task templates" ON public.task_templates FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own task templates" ON public.task_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own task templates" ON public.task_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own task templates" ON public.task_templates FOR DELETE USING (auth.uid() = user_id);

-- Task comments policies
DROP POLICY IF EXISTS "Users can view own task comments" ON public.task_comments;
DROP POLICY IF EXISTS "Users can insert own task comments" ON public.task_comments;
DROP POLICY IF EXISTS "Users can update own task comments" ON public.task_comments;
DROP POLICY IF EXISTS "Users can delete own task comments" ON public.task_comments;

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

-- Task attachments policies
DROP POLICY IF EXISTS "Users can view own task attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can insert own task attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can update own task attachments" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can delete own task attachments" ON public.task_attachments;

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

-- Task history policies
DROP POLICY IF EXISTS "Users can view own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can insert own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can update own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can delete own task history" ON public.task_history;

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
