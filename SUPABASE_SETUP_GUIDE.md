# 🗄️ Supabase Setup Guide - Step by Step

## Quick Setup (5 minutes)

### **Step 1: Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### **Step 2: Create New Project**
1. Click "New Project"
2. **Organization**: Create new or use existing
3. **Project Name**: `flowstate-app` (or your preferred name)
4. **Database Password**: Generate a strong password (save it!)
5. **Region**: Choose closest to your users (US East for most users)
6. Click "Create new project"

### **Step 3: Get API Keys**
1. Wait for project to finish setting up (2-3 minutes)
2. Go to **Settings** → **API** (left sidebar)
3. Copy these values:

```bash
# Project URL
SUPABASE_URL=https://your-project-id.supabase.co

# API Keys
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Step 4: Update Backend Configuration**
1. Open `backend/.env` file
2. Replace the placeholder values:

```bash
# Replace these lines in backend/.env
SUPABASE_URL=https://your-actual-project-id.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

### **Step 5: Apply Database Schema**
Run this command to set up the database tables:

```bash
cd backend
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Read schema file
const fs = require('fs');
const schema = fs.readFileSync('../supabase-complete-schema.sql', 'utf8');

// Split by semicolon and execute each statement
const statements = schema.split(';').filter(stmt => stmt.trim());

async function applySchema() {
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.log('Statement:', statement.substring(0, 100) + '...');
          console.log('Error:', error.message);
        } else {
          console.log('✅ Statement executed successfully');
        }
      } catch (err) {
        console.log('❌ Error executing statement:', err.message);
      }
    }
  }
  console.log('🎉 Database schema setup complete!');
}

applySchema();
"
```

### **Step 6: Test Supabase Connection**
```bash
# Test the connection
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@flowstate.app","password":"testpass123","firstName":"Test","lastName":"User"}'
```

---

## 🎯 What This Enables

### **Before Supabase (Current):**
- ❌ Data lost on server restart
- ❌ No user authentication
- ❌ No persistent storage
- ❌ Mock data only

### **After Supabase (Target):**
- ✅ Persistent data storage
- ✅ Real user authentication
- ✅ User accounts and profiles
- ✅ Real task/note/event storage
- ✅ Data survives server restarts

---

## 🔧 Troubleshooting

### **Common Issues:**

1. **"Invalid API key"**
   - Check if you copied the keys correctly
   - Ensure no extra spaces or characters

2. **"Project not found"**
   - Verify the project URL is correct
   - Check if project is still setting up

3. **"Permission denied"**
   - Use the service role key for backend operations
   - Anon key is for frontend only

4. **Schema errors**
   - Check if tables already exist
   - Verify SQL syntax in schema file

### **Verification Steps:**
1. Check Supabase dashboard → Table Editor
2. Should see tables: profiles, tasks, projects, etc.
3. Test user registration in the app
4. Check if data persists after refresh

---

## 📊 Expected Results

After successful setup:
- ✅ Backend logs: "Supabase connected successfully"
- ✅ No more "Supabase not configured" warnings
- ✅ User registration creates real accounts
- ✅ Tasks/notes persist in database
- ✅ Data visible in Supabase dashboard

---

## 🚀 Next Steps

Once Supabase is working:
1. **Test user registration** in the app
2. **Create tasks/notes** and verify they persist
3. **Set up OpenAI** for real AI responses
4. **Deploy to production** with confidence

**Need help?** Check the backend logs for any error messages and verify your API keys are correct.