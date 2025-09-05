# 🚀 Flow State Backend Setup Guide

## Prerequisites Setup

### 1. Supabase Setup (Required for Database)

**Step 1: Create Supabase Account**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub/Google
3. Create a new project

**Step 2: Get API Keys**
1. Go to Project Settings → API
2. Copy these values:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

**Step 3: Update .env file**
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. OpenAI Setup (Required for AI Features)

**Step 1: Get OpenAI API Key**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys section
4. Create a new API key

**Step 2: Update .env file**
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. JWT Secrets (Required for Authentication)

**Generate secure JWT secrets:**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate refresh secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Update .env file:**
```bash
JWT_SECRET=your-generated-jwt-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here
```

## Quick Setup Script

Run this to generate JWT secrets automatically:

```bash
# Generate JWT secrets
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> .env
echo "JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> .env
```

## Database Schema Setup

After configuring Supabase, run the database schema:

```bash
# Apply the database schema
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Read and execute schema file
const fs = require('fs');
const schema = fs.readFileSync('../supabase-complete-schema.sql', 'utf8');

supabase.rpc('exec_sql', { sql: schema })
  .then(({ data, error }) => {
    if (error) {
      console.error('Schema setup failed:', error);
    } else {
      console.log('✅ Database schema applied successfully');
    }
  });
"
```

## Testing the Setup

1. **Start the backend:**
   ```bash
   npm run dev
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3001/api/health
   ```

3. **Test authentication:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123","firstName":"Test","lastName":"User"}'
   ```

## Next Steps

Once backend is configured:
1. ✅ Test capture functionality with real data
2. ✅ Test Apple Reminders integration
3. ✅ Plan domain purchase and deployment
4. ✅ Create deployment guide

## Troubleshooting

**Common Issues:**

1. **Supabase Connection Failed**
   - Check if URL and keys are correct
   - Ensure project is not paused
   - Verify network connectivity

2. **JWT Errors**
   - Ensure JWT secrets are properly generated
   - Check if secrets are not empty

3. **OpenAI API Errors**
   - Verify API key is valid
   - Check if you have credits/billing set up
   - Ensure API key has proper permissions

**Need Help?**
- Check backend logs: `tail -f logs/server.log`
- Test individual endpoints with curl
- Verify environment variables are loaded correctly
