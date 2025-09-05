-- Create a user directly in Supabase auth
-- Replace 'your-email@example.com' with your actual email

-- First, create the user in auth.users
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
  gen_random_uuid(), -- This will generate a new UUID
  'your-email@example.com', -- Replace with your email
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Your Name"}',
  false,
  '',
  '',
  '',
  ''
);

-- Now check what user ID was created
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at
FROM auth.users au
WHERE au.email = 'your-email@example.com' -- Replace with your email
ORDER BY au.created_at DESC;

-- After you get the user ID, create the profile
-- (Run this after you get the user ID from above)
-- INSERT INTO public.profiles (id, email, full_name, avatar_url, timezone, preferences) 
-- VALUES (
--   'PASTE_YOUR_USER_ID_HERE',
--   'your-email@example.com',
--   'Your Name',
--   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
--   'UTC',
--   '{"theme": "light", "notifications": true}'
-- );
