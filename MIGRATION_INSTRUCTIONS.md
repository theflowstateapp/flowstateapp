# 🔧 Database Migration Instructions

## The Problem:
You're getting an error `column "assignee_id" does not exist` because the existing database schema doesn't have all the columns we need for the enhanced task management system.

## The Solution:
Apply the migration script that adds missing columns and tables without affecting existing data.

## Steps to Fix:

### 1. Apply the Migration
1. **Open** `supabase-migration.sql` in your editor
2. **Copy** the entire contents (Ctrl+A, Ctrl+C)
3. **Go to** your Supabase Dashboard → SQL Editor
4. **Paste** the migration script
5. **Click Run**

### 2. What the Migration Does:
- ✅ Adds missing columns to existing tables (`assignee_id`, `life_area_id`, etc.)
- ✅ Creates new tables (`life_areas`, `task_projects`, `task_goals`, etc.)
- ✅ Adds proper indexes for performance
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Inserts sample data for testing
- ✅ Preserves all existing data

### 3. Verify the Migration
After running the migration, run:
```bash
node test-database-schema.js
```

You should see:
```
✅ Table 'life_areas' exists
✅ Table 'task_projects' exists
✅ Table 'task_goals' exists
✅ Table 'task_dependencies' exists
✅ Table 'time_tracking' exists
✅ Table 'task_reports' exists
✅ Table 'task_templates' exists
✅ Table 'task_comments' exists
✅ Table 'task_attachments' exists
✅ Table 'task_history' exists
```

### 4. Expected Result:
- All tables will exist with proper relationships
- Sample data will be available
- No more `assignee_id` errors
- Ready for Step 2: Enhanced New Task Form

---

**Ready to apply the migration?** Copy `supabase-migration.sql` and run it in your Supabase SQL Editor! 🚀
