#!/bin/bash

# Database Setup Script for LifeOS
# This script creates all the necessary database tables and initial data

echo "🗄️  SETTING UP LIFOOS DATABASE"
echo "==============================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "database-schema.sql" ]; then
    echo "❌ database-schema.sql not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Database schema file found: database-schema.sql"
echo ""

# Check if we have Supabase credentials
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  Supabase credentials not found in environment variables."
    echo "   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    echo "   You can find these in your Supabase project settings."
    echo ""
    echo "   Example:"
    echo "   export SUPABASE_URL='https://your-project.supabase.co'"
    echo "   export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'"
    echo ""
    read -p "Do you want to continue with the setup? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔧 Setting up database tables..."
echo ""

# Create a temporary SQL file with the schema
TEMP_SQL="temp_schema.sql"

# Add the schema content
cat > "$TEMP_SQL" << 'EOF'
-- LifeOS Database Schema
-- This file contains all the database tables and relationships for the LifeOS application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{
    "theme": "light",
    "notifications": true,
    "emailUpdates": true,
    "language": "en",
    "timezone": "UTC"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Life Areas (PARA methodology)
CREATE TABLE IF NOT EXISTS areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'folder',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  type TEXT DEFAULT 'reference' CHECK (type IN ('reference', 'tool', 'template', 'guide')),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Archives table
CREATE TABLE IF NOT EXISTS archives (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_type TEXT NOT NULL CHECK (original_type IN ('project', 'task', 'resource')),
  original_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inbox items (for quick capture)
CREATE TABLE IF NOT EXISTS inbox_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'task' CHECK (type IN ('task', 'project', 'resource', 'note')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  target_count INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  color TEXT DEFAULT '#10B981',
  icon TEXT DEFAULT 'target',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit tracking entries
CREATE TABLE IF NOT EXISTS habit_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('excellent', 'good', 'neutral', 'poor', 'terrible')),
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Focus sessions
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL, -- in minutes
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and tracking
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  icon TEXT DEFAULT 'file',
  fields JSONB DEFAULT '[]'::jsonb,
  patterns JSONB DEFAULT '[]'::jsonb,
  usage_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_area_id ON projects(area_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_area_id ON tasks(area_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_areas_user_id ON areas(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_archives_user_id ON archives(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_items_user_id ON inbox_items(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_items_processed ON inbox_items(processed);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_habit_id ON habit_entries(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_date ON habit_entries(date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inbox_items_updated_at BEFORE UPDATE ON inbox_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own areas" ON areas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own resources" ON resources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own archives" ON archives FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own inbox items" ON inbox_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own habits" ON habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own habit entries" ON habit_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own focus sessions" ON focus_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own analytics" ON user_analytics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own templates" ON templates FOR ALL USING (auth.uid() = user_id);

-- Health check function
CREATE OR REPLACE FUNCTION health_check()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'status', 'healthy',
    'timestamp', NOW(),
    'database', 'connected'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
EOF

echo "📝 Created temporary SQL file: $TEMP_SQL"
echo ""

# Execute the SQL using psql if available, otherwise provide instructions
if command -v psql &> /dev/null; then
    echo "🔧 Executing SQL schema..."
    if [ ! -z "$SUPABASE_URL" ] && [ ! -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        # Extract database URL from Supabase URL
        DB_URL=$(echo $SUPABASE_URL | sed 's/https:\/\//postgresql:\/\/postgres:/' | sed 's/\.supabase\.co/.supabase.co:5432\/postgres/')
        
        echo "Connecting to database..."
        PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" psql "$DB_URL" -f "$TEMP_SQL"
        
        if [ $? -eq 0 ]; then
            echo "✅ Database schema created successfully!"
        else
            echo "❌ Failed to create database schema"
            exit 1
        fi
    else
        echo "⚠️  Supabase credentials not available for direct database connection"
        echo "   Please run the SQL manually in your Supabase dashboard"
    fi
else
    echo "⚠️  psql not found. Please install PostgreSQL client or run the SQL manually."
    echo ""
    echo "📋 To set up the database manually:"
    echo "   1. Go to your Supabase dashboard"
    echo "   2. Navigate to SQL Editor"
    echo "   3. Copy and paste the contents of $TEMP_SQL"
    echo "   4. Execute the SQL"
fi

# Clean up temporary file
rm -f "$TEMP_SQL"

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify tables were created in your Supabase dashboard"
echo "   2. Test the backend endpoints"
echo "   3. Run the frontend integration tests"
echo ""
echo "🔗 Useful links:"
echo "   - Supabase Dashboard: https://supabase.com/dashboard"
echo "   - Backend Health: http://localhost:3001/api/health"
echo "   - Data Dashboard: http://localhost:3001/api/data/dashboard"
echo ""
