-- QA Runs table for storing smoke test execution history
-- This table tracks each QA smoke test run with detailed results

-- First, create the table
create table if not exists qa_runs (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  env text default 'production',
  build_id text,
  version text,               -- git sha or SITE_BUILD_ID if available
  ok boolean not null,
  total_ms int,
  steps jsonb,                -- array of {name, ok, ms, error?, details?}
  artifacts jsonb             -- { taskId, sessionId, plannedTomorrow, scheduledThisWeekMin }
);

-- Create indexes for efficient queries
create index if not exists idx_qa_runs_ts on qa_runs(ts desc);
create index if not exists idx_qa_runs_ok on qa_runs(ok);
create index if not exists idx_qa_runs_env on qa_runs(env);

-- Enable row level security
alter table qa_runs enable row level security;

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Service role can manage qa_runs" on qa_runs;
drop policy if exists "Public can read qa_runs" on qa_runs;

-- Create policies for access control
create policy "Service role can manage qa_runs" on qa_runs
  for all using (auth.role() = 'service_role');

create policy "Public can read qa_runs" on qa_runs
  for select using (true);
