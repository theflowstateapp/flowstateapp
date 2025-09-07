-- Demo Mode Database Schema Updates
-- Run this in Supabase SQL Editor

-- Create workspaces table for demo mode
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  isDemo BOOLEAN DEFAULT FALSE,
  date_key TEXT, -- YYYY-MM-DD format for daily demo workspaces
  seededAt TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add workspace_id to existing tables
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE goals ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE habits ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id);

-- Enable RLS on workspaces
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for workspaces
CREATE POLICY "Users can view own workspaces" ON workspaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workspaces" ON workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workspaces" ON workspaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workspaces" ON workspaces FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_isDemo ON workspaces(isDemo);
CREATE INDEX IF NOT EXISTS idx_workspaces_date_key ON workspaces(date_key);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_goals_workspace_id ON goals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_habits_workspace_id ON habits(workspace_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_workspace_id ON journal_entries(workspace_id);

-- Add demo_mode to profiles preferences
-- This will be handled in the application code when creating profiles
