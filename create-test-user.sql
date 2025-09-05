-- First, let's create a test user profile
-- This will create a profile for the sample user ID used in the sample data

INSERT INTO public.profiles (id, email, full_name, avatar_url, timezone, preferences) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@lifeos.com',
  'Demo User',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'UTC',
  '{"theme": "light", "notifications": true}'
);

-- Now run the sample-data.sql after this
