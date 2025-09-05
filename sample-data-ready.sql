-- Sample Data for Life OS Testing - READY TO USE
-- User ID: 1362be08-16dc-405b-9940-9d04c8f3293d

-- Sample Areas (Life Areas)
INSERT INTO public.areas (id, user_id, name, description, color, icon, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Health & Fitness', 'Physical and mental well-being', '#EF4444', 'heart', true),
('550e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Career & Work', 'Professional development and work goals', '#3B82F6', 'briefcase', true),
('550e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Finance', 'Financial planning and money management', '#10B981', 'dollar-sign', true),
('550e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Relationships', 'Family, friends, and social connections', '#F59E0B', 'users', true),
('550e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Learning & Growth', 'Education, skills, and personal development', '#8B5CF6', 'book-open', true),
('550e8400-e29b-41d4-a716-446655440006', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Personal', 'Hobbies, interests, and personal time', '#EC4899', 'star', true);

-- Sample Projects
INSERT INTO public.projects (id, user_id, title, description, status, priority, due_date, progress, tags, area_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Website Redesign', 'Redesign company website with modern UI/UX', 'active', 'high', '2024-03-15', 65, ARRAY['work', 'design', 'web'], '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Learn React', 'Master React fundamentals and advanced concepts', 'active', 'medium', '2024-04-01', 40, ARRAY['learning', 'programming', 'react'], '550e8400-e29b-41d4-a716-446655440005'),
('660e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Home Renovation', 'Kitchen and bathroom renovation project', 'active', 'medium', '2024-06-01', 25, ARRAY['home', 'renovation', 'personal'], '550e8400-e29b-41d4-a716-446655440006'),
('660e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Fitness Challenge', 'Complete 30-day fitness challenge', 'active', 'high', '2024-02-28', 80, ARRAY['fitness', 'health', 'challenge'], '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Investment Portfolio', 'Build diversified investment portfolio', 'active', 'medium', '2024-12-31', 30, ARRAY['finance', 'investment', 'planning'], '550e8400-e29b-41d4-a716-446655440003');

-- Sample Tasks
INSERT INTO public.tasks (id, user_id, title, description, status, priority, due_date, estimated_time, tags, project_id, area_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Design homepage mockup', 'Create wireframes and mockups for homepage', 'active', 'high', '2024-01-20', 120, ARRAY['design', 'ui'], '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Complete React tutorial', 'Finish React fundamentals course', 'active', 'medium', '2024-01-25', 180, ARRAY['learning', 'react'], '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005'),
('770e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Book contractor meeting', 'Schedule meeting with renovation contractor', 'active', 'medium', '2024-01-18', 30, ARRAY['home', 'planning'], '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006'),
('770e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Morning workout', 'Complete 30-minute cardio session', 'active', 'high', '2024-01-15', 30, ARRAY['fitness', 'health'], '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Research ETFs', 'Research and compare different ETF options', 'active', 'medium', '2024-01-22', 90, ARRAY['finance', 'research'], '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003');

-- Sample Inbox Items
INSERT INTO public.inbox_items (id, user_id, title, content, item_type, status, priority, tags) VALUES
('880e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Review Q1 marketing strategy', 'Need to analyze performance and plan Q2', 'inbox', 'active', 'high', ARRAY['work', 'marketing', 'strategy']),
('880e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Book dentist appointment', 'Check available slots for next week', 'inbox', 'active', 'medium', ARRAY['health', 'personal']),
('880e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Interesting article about productivity', 'https://example.com/productivity-tips', 'inbox', 'active', 'low', ARRAY['learning', 'productivity']),
('880e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Plan weekend trip', 'Research destinations and book accommodation', 'inbox', 'active', 'medium', ARRAY['personal', 'travel']),
('880e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Call mom', 'Check how she''s doing', 'inbox', 'active', 'high', ARRAY['personal', 'relationships']);

-- Sample Habits
INSERT INTO public.habits (id, user_id, name, description, frequency, target_count, current_streak, longest_streak, is_active, area_id) VALUES
('990e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Morning Exercise', '30-minute workout every morning', 'daily', 1, 12, 15, true, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Read 30 minutes', 'Read books for personal growth', 'daily', 1, 8, 21, true, '550e8400-e29b-41d4-a716-446655440005'),
('990e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Meditation', '10-minute mindfulness practice', 'daily', 1, 5, 7, true, '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Weekly Review', 'Review goals and plan next week', 'weekly', 1, 3, 8, true, '550e8400-e29b-41d4-a716-446655440006'),
('990e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Save Money', 'Save $100 per week', 'weekly', 1, 4, 12, true, '550e8400-e29b-41d4-a716-446655440003');

-- Sample Habit Logs
INSERT INTO public.habit_logs (id, habit_id, user_id, completed_at, notes) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', '2024-01-15 07:00:00+00', 'Great workout, felt energized'),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', '2024-01-14 07:00:00+00', 'Cardio session completed'),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', '2024-01-15 21:00:00+00', 'Read chapter 5 of Atomic Habits'),
('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', '2024-01-15 22:00:00+00', 'Focused breathing meditation'),
('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', '2024-01-14 18:00:00+00', 'Weekly review completed, goals on track');

-- Sample Journal Entries
INSERT INTO public.journal_entries (id, user_id, title, content, mood, tags, is_private) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Productive Day', 'Today was incredibly productive. Completed the website mockup and made significant progress on the React tutorial. Feeling accomplished and motivated.', 'happy', ARRAY['productivity', 'work', 'learning'], true),
('bb0e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Fitness Milestone', 'Reached day 12 of my fitness challenge! The morning workouts are becoming a habit and I can feel the difference in my energy levels.', 'excited', ARRAY['fitness', 'health', 'milestone'], true),
('bb0e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Financial Planning', 'Spent time today researching investment options. Feeling more confident about financial planning and building wealth for the future.', 'neutral', ARRAY['finance', 'planning', 'future'], true),
('bb0e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Family Time', 'Had a great dinner with family tonight. It''s important to maintain these connections and create lasting memories.', 'happy', ARRAY['family', 'relationships', 'gratitude'], true),
('bb0e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Learning Reflection', 'Reflecting on my learning journey. The React tutorial is challenging but rewarding. Need to stay consistent with daily practice.', 'neutral', ARRAY['learning', 'reflection', 'growth'], true);

-- Sample Goals
INSERT INTO public.goals (id, user_id, title, description, target_date, status, progress, goal_type, area_id) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Launch Business Website', 'Complete website redesign and launch by Q1', '2024-03-31', 'active', 65, 'short-term', '550e8400-e29b-41d4-a716-446655440002'),
('cc0e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Master React Development', 'Become proficient in React and build portfolio projects', '2024-06-30', 'active', 40, 'short-term', '550e8400-e29b-41d4-a716-446655440005'),
('cc0e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Complete Home Renovation', 'Finish kitchen and bathroom renovation project', '2024-12-31', 'active', 25, 'long-term', '550e8400-e29b-41d4-a716-446655440006'),
('cc0e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Build Emergency Fund', 'Save 6 months of living expenses', '2024-12-31', 'active', 60, 'short-term', '550e8400-e29b-41d4-a716-446655440003'),
('cc0e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Run Half Marathon', 'Train and complete a half marathon', '2024-10-31', 'active', 30, 'long-term', '550e8400-e29b-41d4-a716-446655440001');

-- Sample Resources
INSERT INTO public.resources (id, user_id, title, description, url, resource_type, tags, area_id, project_id) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', 'React Documentation', 'Official React documentation and tutorials', 'https://react.dev', 'article', ARRAY['react', 'programming', 'documentation'], '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002'),
('dd0e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Atomic Habits Book', 'James Clear''s book on building good habits', 'https://jamesclear.com/atomic-habits', 'book', ARRAY['habits', 'productivity', 'self-improvement'], '550e8400-e29b-41d4-a716-446655440005', NULL),
('dd0e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'UI Design Principles', 'Guide to modern UI/UX design principles', 'https://example.com/ui-design', 'article', ARRAY['design', 'ui', 'ux'], '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Investment Guide', 'Comprehensive guide to ETF investing', 'https://example.com/investment-guide', 'article', ARRAY['finance', 'investment', 'etf'], '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005'),
('dd0e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'Fitness App Template', 'Template for tracking workouts and progress', 'https://example.com/fitness-template', 'template', ARRAY['fitness', 'tracking', 'template'], '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004');

-- Sample Archives
INSERT INTO public.archives (id, user_id, original_id, original_type, title, description, archived_at) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '1362be08-16dc-405b-9940-9d04c8f3293d', '660e8400-e29b-41d4-a716-446655440001', 'project', 'Old Website Design', 'Previous website design project completed in 2023', '2024-01-01 00:00:00+00'),
('ee0e8400-e29b-41d4-a716-446655440002', '1362be08-16dc-405b-9940-9d04c8f3293d', '770e8400-e29b-41d4-a716-446655440001', 'task', 'Research Competitors', 'Competitor analysis task from Q4 2023', '2024-01-01 00:00:00+00'),
('ee0e8400-e29b-41d4-a716-446655440003', '1362be08-16dc-405b-9940-9d04c8f3293d', 'dd0e8400-e29b-41d4-a716-446655440001', 'resource', 'Old React Tutorial', 'Previous React tutorial from 2023', '2024-01-01 00:00:00+00'),
('ee0e8400-e29b-41d4-a716-446655440004', '1362be08-16dc-405b-9940-9d04c8f3293d', 'bb0e8400-e29b-41d4-a716-446655440001', 'resource', 'Old Journal Entry', 'Journal entry from December 2023', '2024-01-01 00:00:00+00'),
('ee0e8400-e29b-41d4-a716-446655440005', '1362be08-16dc-405b-9940-9d04c8f3293d', 'cc0e8400-e29b-41d4-a716-446655440001', 'project', '2023 Career Goal', 'Career goal from 2023 that was completed', '2024-01-01 00:00:00+00');
