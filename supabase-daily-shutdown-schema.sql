-- Daily Shutdown Database Schema
-- Creates tables for day reviews and tomorrow planning

-- Per-day review (IST-dated)
CREATE TABLE IF NOT EXISTS day_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  day date NOT NULL,               -- IST calendar day
  completed_tasks int DEFAULT 0,
  carry_over_tasks int DEFAULT 0,
  flow_minutes int DEFAULT 0,
  highlights text,                 -- plain text (<= 500 chars)
  gratitude text,                  -- optional
  mood text,                       -- e.g., "🙂" or "ok/happy/stressed"
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, workspace_id, day)
);

-- Tomorrow plan (Pick 3 + optional morning blocks)
CREATE TABLE IF NOT EXISTS day_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  day date NOT NULL,               -- the day being planned (IST; usually tomorrow)
  task_ids text[] NOT NULL,        -- up to 3 task ids
  scheduled jsonb,                 -- [{taskId,startAt,endAt}] (optional)
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, workspace_id, day)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_day_reviews_user_day ON day_reviews(user_id, day);
CREATE INDEX IF NOT EXISTS idx_day_reviews_workspace_day ON day_reviews(workspace_id, day);
CREATE INDEX IF NOT EXISTS idx_day_plans_user_day ON day_plans(user_id, day);
CREATE INDEX IF NOT EXISTS idx_day_plans_workspace_day ON day_plans(workspace_id, day);

-- Add RLS policies (if RLS is enabled)
-- Service role can insert/update for serverless functions
ALTER TABLE day_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all records
CREATE POLICY IF NOT EXISTS "Service role can manage day_reviews" ON day_reviews
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role can manage day_plans" ON day_plans
  FOR ALL USING (auth.role() = 'service_role');
