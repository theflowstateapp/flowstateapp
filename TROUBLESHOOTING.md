# Troubleshooting "Fail to Fetch" Error

## Common Causes and Solutions:

### 1. **Environment Variables Not Loading**
- The app needs to be restarted after creating the .env file
- Check if variables are loaded by visiting `/test` page

### 2. **Supabase Project Settings**
Make sure your Supabase project has:
- ✅ **Authentication enabled**
- ✅ **Email auth provider enabled**
- ✅ **Site URL configured** (http://localhost:3000)
- ✅ **Redirect URLs configured** (http://localhost:3000/app)

### 3. **Network/CORS Issues**
- Check if Supabase is accessible from your network
- Try accessing Supabase dashboard to verify project is active

### 4. **Database Schema Not Applied**
- Make sure you've run the `supabase-schema.sql` in your Supabase SQL Editor
- Check if the `profiles` table exists

## Quick Fix Steps:

1. **Visit the test page**: Go to `http://localhost:3000/test`
2. **Check the debug connection** component
3. **Open browser console** (F12) and look for errors
4. **Check Supabase dashboard** for project status

## If Still Not Working:

1. **Verify Supabase Project**:
   - Go to https://supabase.com/dashboard
   - Check if your project is active
   - Verify the URL and API key are correct

2. **Test Direct Connection**:
   - Open browser console on `/test` page
   - Look for connection test results

3. **Alternative: Create User Directly**:
   - Use the `create-user-directly.sql` script in Supabase
   - Then add sample data with your user ID
