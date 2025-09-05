-- Verification Script for Sample Data
-- Run this after inserting sample-data.sql to verify everything worked

-- Check Areas
SELECT 'Areas' as table_name, COUNT(*) as count FROM public.areas WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Projects
SELECT 'Projects' as table_name, COUNT(*) as count FROM public.projects WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Tasks
SELECT 'Tasks' as table_name, COUNT(*) as count FROM public.tasks WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Inbox Items
SELECT 'Inbox Items' as table_name, COUNT(*) as count FROM public.inbox_items WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Habits
SELECT 'Habits' as table_name, COUNT(*) as count FROM public.habits WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Habit Logs
SELECT 'Habit Logs' as table_name, COUNT(*) as count FROM public.habit_logs WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Journal Entries
SELECT 'Journal Entries' as table_name, COUNT(*) as count FROM public.journal_entries WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Goals
SELECT 'Goals' as table_name, COUNT(*) as count FROM public.goals WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Resources
SELECT 'Resources' as table_name, COUNT(*) as count FROM public.resources WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
-- Check Archives
SELECT 'Archives' as table_name, COUNT(*) as count FROM public.archives WHERE user_id = '00000000-0000-0000-0000-000000000001';
