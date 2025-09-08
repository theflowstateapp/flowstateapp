# Pre-Focus Ritual Database Schema Application Guide

## Overview
This guide explains how to apply the Pre-Focus Ritual database schema to your production Supabase instance.

## Schema File Location
- File: `supabase-focus-ritual-schema.sql`
- Contains: Extensions to the existing `focus_sessions` table

## Manual Application Steps

### Option 1: Supabase Dashboard (Recommended)
1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your FlowState project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Apply the Schema**
   - Copy the contents of `supabase-focus-ritual-schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

4. **Verify Application**
   - Check that the query executed successfully
   - Verify no errors in the output

### Option 2: Supabase CLI (If Available)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the schema
supabase db push
```

## Schema Contents
The schema adds three new columns to the `focus_sessions` table:

```sql
-- Extend focus_sessions with ritual + intention
ALTER TABLE focus_sessions
  ADD COLUMN IF NOT EXISTS intention text,
  ADD COLUMN IF NOT EXISTS ritual jsonb,
  ADD COLUMN IF NOT EXISTS prep_done_at timestamptz;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_intention ON focus_sessions(intention) WHERE intention IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_focus_sessions_ritual ON focus_sessions USING GIN (ritual) WHERE ritual IS NOT NULL;
```

## Verification Steps
After applying the schema:

1. **Check Table Structure**
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'focus_sessions';
   ```

2. **Test API Endpoints**
   - Test `/api/focus/start` with intention and ritual data
   - Test `/api/focus/stop` returns intention and ritual in response

3. **Verify Indexes**
   ```sql
   SELECT indexname, indexdef 
   FROM pg_indexes 
   WHERE tablename = 'focus_sessions';
   ```

## Expected Results
After successful application:
- ✅ `focus_sessions` table has `intention`, `ritual`, and `prep_done_at` columns
- ✅ Indexes are created for performance
- ✅ APIs accept and return intention/ritual data
- ✅ Pre-Focus Ritual functionality is fully operational

## Troubleshooting
- **Permission Errors**: Ensure you have admin access to the Supabase project
- **Column Already Exists**: The `IF NOT EXISTS` clause prevents errors
- **Index Creation Fails**: Check if indexes already exist

## Next Steps
1. Apply the schema using one of the methods above
2. Test the complete Pre-Focus Ritual flow
3. Verify all functionality works with real database
4. Enable app tour and analytics collection
