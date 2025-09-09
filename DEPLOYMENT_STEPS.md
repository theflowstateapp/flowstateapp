# QA System Deployment - Step-by-Step Guide

## 🎯 What You Need to Do Next

### Step 1: Database Setup (5 minutes)
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `qa-runs-schema.sql`
4. Click "Run" to execute the SQL
5. Verify the `qa_runs` table was created

### Step 2: Environment Variables (3 minutes)
1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to Environment Variables
4. Add new variable:
   - Name: `QA_SECRET`
   - Value: Generate a long random string (use: `openssl rand -hex 32`)
   - Environment: Production, Preview, Development
5. Save the changes

### Step 3: GitHub Secrets (2 minutes)
1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `QA_SECRET`
5. Value: Same value you used in Vercel
6. Click "Add secret"

### Step 4: Deploy to Production (5 minutes)
1. Commit all the QA files to your repository:
   ```bash
   git add .
   git commit -m "Add comprehensive QA system with production monitoring"
   git push origin main
   ```
2. Wait for Vercel deployment to complete (check Vercel dashboard)

### Step 5: Test the System (5 minutes)
1. Set your QA secret locally:
   ```bash
   export QA_SECRET="your-secret-from-step-2"
   ```
2. Run the comprehensive test:
   ```bash
   ./scripts/qa-system-test.sh
   ```
3. If tests pass, you're done! If not, check the troubleshooting section.

### Step 6: Verify Admin Panel (1 minute)
1. Open: https://theflowstateapp.com/api/admin/qa
2. You should see a clean HTML interface with QA status
3. Click "Run Now" to test the system

## 🔍 Troubleshooting

### If endpoints return 404:
- Check Vercel deployment logs
- Verify files are in `api/qa/` and `api/admin/` folders
- Wait a few minutes for Vercel to propagate changes

### If endpoints return 403:
- Double-check QA_SECRET matches between Vercel and your local environment
- Verify the secret is set in all environments (Production, Preview, Development)

### If database errors occur:
- Verify `qa_runs` table exists in Supabase
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel
- Verify RLS policies are configured correctly

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ `./scripts/qa-system-test.sh` shows all tests passing
- ✅ Admin panel loads at `/api/admin/qa`
- ✅ GitHub Actions run automatically on push to main
- ✅ QA runs are stored in the database

## 📞 Need Help?

If you run into issues:
1. Check Vercel function logs
2. Check Supabase logs
3. Run individual endpoint tests to isolate the problem
4. The deployment guide has detailed troubleshooting steps
