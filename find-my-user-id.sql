-- Check your current user ID
-- Run this first to see your user ID

SELECT 
  au.id as auth_user_id,
  au.email,
  p.full_name,
  p.created_at as profile_created
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- Copy the auth_user_id from the result and use it to replace 
-- '00000000-0000-0000-0000-000000000001' in sample-data.sql
