-- Sample Data for FlowState App
-- This script populates the database with realistic sample data

-- Insert sample tasks
INSERT INTO tasks (id, user_id, title, description, status, priority, due_date, created_at, updated_at) VALUES
('task-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Complete project proposal', 'Write the executive summary and technical requirements for the Q4 product launch', 'in_progress', 'high', '2025-09-10', '2025-09-01T10:00:00Z', '2025-09-06T14:30:00Z'),
('task-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Review team feedback', 'Go through all feedback from the design team and implement changes', 'completed', 'medium', '2025-09-05', '2025-09-01T11:00:00Z', '2025-09-05T16:00:00Z'),
('task-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Prepare presentation slides', 'Create slides for the upcoming client presentation', 'pending', 'high', '2025-09-12', '2025-09-02T09:00:00Z', '2025-09-02T09:00:00Z'),
('task-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Call client for follow-up', 'Discuss project timeline and next steps with the main client', 'pending', 'medium', '2025-09-08', '2025-09-03T14:00:00Z', '2025-09-03T14:00:00Z'),
('task-5', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Update project documentation', 'Add latest changes to project wiki and documentation', 'pending', 'low', '2025-09-15', '2025-09-04T10:00:00Z', '2025-09-04T10:00:00Z'),
('task-6', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Research competitor analysis', 'Analyze top 3 competitors and their strategies', 'in_progress', 'medium', '2025-09-11', '2025-09-05T11:00:00Z', '2025-09-06T10:00:00Z'),
('task-7', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Schedule team meeting', 'Find time slot for next sprint planning session', 'completed', 'high', '2025-09-06', '2025-09-05T15:00:00Z', '2025-09-06T09:00:00Z'),
('task-8', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Review code pull requests', 'Check and approve pending PRs from the development team', 'pending', 'medium', '2025-09-09', '2025-09-06T08:00:00Z', '2025-09-06T08:00:00Z');

-- Insert sample projects
INSERT INTO projects (id, user_id, name, description, status, priority, start_date, end_date, progress, created_at, updated_at) VALUES
('project-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Q4 Product Launch', 'Launch new product features for Q4 including AI integration and mobile app', 'active', 'high', '2025-09-01', '2025-12-31', 65, '2025-08-15T10:00:00Z', '2025-09-06T14:30:00Z'),
('project-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Website Redesign', 'Complete redesign of company website with modern UI/UX', 'planning', 'medium', '2025-10-01', '2025-11-30', 25, '2025-09-01T09:00:00Z', '2025-09-05T16:00:00Z'),
('project-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Mobile App Development', 'Develop mobile app for iOS and Android platforms', 'completed', 'high', '2025-06-01', '2025-08-31', 100, '2025-05-15T10:00:00Z', '2025-08-31T18:00:00Z'),
('project-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'AI Integration', 'Integrate AI features into existing product suite', 'active', 'high', '2025-08-01', '2025-10-31', 40, '2025-07-15T10:00:00Z', '2025-09-06T11:00:00Z');

-- Insert sample goals
INSERT INTO goals (id, user_id, title, description, category, status, target_date, progress, created_at, updated_at) VALUES
('goal-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Complete Q4 Product Launch', 'Successfully launch all planned features for Q4', 'work', 'in_progress', '2025-12-31', 65, '2025-08-01T10:00:00Z', '2025-09-06T14:30:00Z'),
('goal-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Learn AI Development', 'Master AI development skills and implement AI features', 'learning', 'in_progress', '2025-11-30', 30, '2025-08-15T10:00:00Z', '2025-09-05T16:00:00Z'),
('goal-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Improve Work-Life Balance', 'Better manage time and reduce work stress', 'personal', 'in_progress', '2025-12-31', 50, '2025-09-01T10:00:00Z', '2025-09-06T10:00:00Z'),
('goal-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Read 12 Books This Year', 'Read one book per month for personal development', 'personal', 'in_progress', '2025-12-31', 75, '2025-01-01T10:00:00Z', '2025-09-06T09:00:00Z');

-- Insert sample habits
INSERT INTO habits (id, user_id, name, description, frequency, target_count, current_streak, longest_streak, created_at, updated_at) VALUES
('habit-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Daily Exercise', 'Exercise for at least 30 minutes every day', 'daily', 1, 7, 15, '2025-08-01T10:00:00Z', '2025-09-06T18:00:00Z'),
('habit-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Morning Meditation', 'Meditate for 10 minutes every morning', 'daily', 1, 12, 25, '2025-08-15T10:00:00Z', '2025-09-06T07:00:00Z'),
('habit-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Read Books', 'Read for at least 30 minutes before bed', 'daily', 1, 5, 20, '2025-09-01T10:00:00Z', '2025-09-06T22:00:00Z'),
('habit-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Code Practice', 'Practice coding for 1 hour every day', 'daily', 1, 3, 10, '2025-08-20T10:00:00Z', '2025-09-06T20:00:00Z');

-- Insert sample journal entries
INSERT INTO journal (id, user_id, title, content, mood, tags, created_at, updated_at) VALUES
('journal-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Great Progress Today', 'Made significant progress on the Q4 product launch. The team is really coming together and the AI integration is looking promising. Feeling optimistic about the upcoming deadline.', 'happy', 'work,progress,team', '2025-09-06T18:00:00Z', '2025-09-06T18:00:00Z'),
('journal-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Learning AI Development', 'Spent the morning learning about machine learning algorithms. It''s challenging but exciting. The possibilities are endless when it comes to AI integration.', 'excited', 'learning,ai,development', '2025-09-05T20:00:00Z', '2025-09-05T20:00:00Z'),
('journal-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Work-Life Balance', 'Trying to find a better balance between work and personal life. Started implementing the Pomodoro technique and it''s helping with focus.', 'thoughtful', 'balance,productivity,focus', '2025-09-04T19:00:00Z', '2025-09-04T19:00:00Z'),
('journal-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Team Meeting Success', 'Had a productive team meeting today. Everyone is aligned on the project goals and timeline. The collaboration is really paying off.', 'satisfied', 'team,meeting,collaboration', '2025-09-03T17:00:00Z', '2025-09-03T17:00:00Z');

-- Insert sample notes
INSERT INTO notes (id, user_id, title, content, category, tags, is_pinned, created_at, updated_at) VALUES
('note-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Meeting Notes - Product Planning', 'Key points from today''s product planning meeting:\n- AI integration timeline: 2 weeks\n- Mobile app testing: Next week\n- Client feedback: Positive overall\n- Next steps: Finalize UI mockups', 'meeting', 'product,planning,ai', true, '2025-09-06T14:00:00Z', '2025-09-06T14:00:00Z'),
('note-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'AI Development Resources', 'Useful resources for AI development:\n- TensorFlow documentation\n- PyTorch tutorials\n- Machine Learning course on Coursera\n- AI research papers database', 'learning', 'ai,development,resources', true, '2025-09-05T16:00:00Z', '2025-09-05T16:00:00Z'),
('note-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Project Ideas', 'Ideas for future projects:\n- Personal finance tracker\n- Habit tracking app\n- Learning management system\n- Social media analytics tool', 'ideas', 'projects,ideas,future', false, '2025-09-04T12:00:00Z', '2025-09-04T12:00:00Z'),
('note-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Client Requirements', 'Client requirements for Q4 product:\n- Must be mobile-responsive\n- AI-powered recommendations\n- Real-time collaboration\n- Advanced analytics dashboard', 'client', 'requirements,client,q4', true, '2025-09-03T10:00:00Z', '2025-09-03T10:00:00Z');

-- Insert sample integrations
INSERT INTO integrations (id, user_id, name, type, status, config, created_at, updated_at) VALUES
('integration-1', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Google Calendar', 'calendar', 'connected', '{"calendar_id": "primary", "sync_enabled": true}', '2025-09-05T16:45:00Z', '2025-09-05T16:45:00Z'),
('integration-2', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Gmail', 'email', 'connected', '{"inbox_sync": true, "labels": ["FlowState"]}', '2025-09-04T14:30:00Z', '2025-09-04T14:30:00Z'),
('integration-3', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Apple Reminders', 'tasks', 'available', '{}', '2025-09-01T10:00:00Z', '2025-09-01T10:00:00Z'),
('integration-4', '906c2412-fb9d-4f4a-8d5d-cdb8272f2ec0', 'Todoist', 'tasks', 'setup_required', '{}', '2025-09-01T10:00:00Z', '2025-09-01T10:00:00Z');
