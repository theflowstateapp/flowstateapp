# Life OS - Supabase Setup Instructions

## 🚀 Phase 1: Supabase Setup (Week 1)

### Step 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)** and create a new account or sign in
2. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Enter project name: `life-os`
   - Enter database password (save this!)
   - Choose region closest to your users
   - Click "Create new project"

### Step 2: Get Your API Keys

1. **Go to Settings > API** in your Supabase dashboard
2. **Copy these values**:
   - Project URL
   - Anon (public) key
3. **Create `.env` file** in your project root:
   ```bash
   REACT_APP_SUPABASE_URL=your_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

### Step 3: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql`
3. **Run the SQL** to create all tables and policies
4. **Verify tables** are created in the Table Editor

### Step 4: Configure Authentication

1. **Go to Authentication > Settings**
2. **Configure email templates** (optional but recommended)
3. **Set up email confirmation** if needed
4. **Configure OAuth providers** (Google, GitHub, etc.) if desired

### Step 5: Test the Setup

1. **Start your React app**:
   ```bash
   npm start
   ```
2. **Test authentication** by trying to sign up/sign in
3. **Check the database** to see if user profiles are created

## 📋 What We've Created

### ✅ Database Schema
- **Profiles table** - User profiles extending Supabase auth
- **Projects table** - P in PARA method
- **Areas table** - A in PARA method  
- **Resources table** - R in PARA method
- **Archives table** - A in PARA method
- **Tasks table** - Task management
- **Inbox items table** - GTD inbox
- **Habits table** - Habit tracking
- **Journal entries table** - Journaling
- **Goals table** - Goal setting

### ✅ Security Features
- **Row Level Security (RLS)** - Users can only access their own data
- **Authentication policies** - Secure user management
- **Automatic profile creation** - Profiles created on signup

### ✅ React Integration
- **Supabase client** - Configured and ready to use
- **Auth context** - React context for authentication
- **Auth modal** - Sign up/sign in component
- **Helper functions** - Common database operations

## 🔧 Next Steps

### Phase 2: API Integration (Week 2)
1. **Connect frontend to Supabase**
2. **Implement real-time features**
3. **Add file uploads**
4. **Create business logic layer**

### Phase 3: Advanced Features (Week 3-4)
1. **Third-party integrations**
2. **AI features**
3. **Analytics**
4. **Advanced permissions**

## 🐛 Troubleshooting

### Common Issues:
1. **Environment variables not loading** - Restart your React app
2. **RLS policies blocking access** - Check user authentication
3. **Database connection errors** - Verify API keys
4. **Auth not working** - Check Supabase auth settings

### Debug Commands:
```bash
# Check if Supabase is connected
console.log(process.env.REACT_APP_SUPABASE_URL)

# Test database connection
const { data, error } = await supabase.from('profiles').select('*')
console.log('Data:', data, 'Error:', error)
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

**Ready for Phase 2?** Let me know when you've completed the Supabase setup and we'll move on to API integration! 🚀

