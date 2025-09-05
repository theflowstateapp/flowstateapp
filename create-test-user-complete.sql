-- Step 1: Create a test user in the auth.users table
-- This bypasses the normal signup process for testing purposes

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@lifeos.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo User", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}',
  false,
  '',
  '',
  '',
  ''
);

-- Step 2: Create the profile record
INSERT INTO public.profiles (id, email, full_name, avatar_url, timezone, preferences) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@lifeos.com',
  'Demo User',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'UTC',
  '{"theme": "light", "notifications": true}'
);

-- Now you can run sample-data.sql
