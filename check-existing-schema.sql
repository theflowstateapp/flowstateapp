-- Check what tables and types already exist
-- Run this first to see what's already set up

-- Check existing types
SELECT typname as type_name 
FROM pg_type 
WHERE typname IN ('item_status', 'item_priority', 'item_type');

-- Check existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'projects', 'areas', 'resources', 'archives', 'tasks', 'inbox_items', 'habits', 'habit_logs', 'journal_entries', 'goals');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'projects', 'areas', 'resources', 'archives', 'tasks', 'inbox_items', 'habits', 'habit_logs', 'journal_entries', 'goals');
