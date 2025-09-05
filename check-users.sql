-- Check existing users in the profiles table
SELECT id, email, full_name, created_at 
FROM public.profiles 
ORDER BY created_at DESC;

-- This will show you all existing users
-- You can then replace '00000000-0000-0000-0000-000000000001' 
-- with your actual user ID in the sample-data.sql
