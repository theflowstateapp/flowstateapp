-- Analytics events table for server-side conversion tracking
-- Run this SQL in Supabase SQL Editor

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  type text not null,                 -- e.g. 'click'
  src text,                           -- e.g. 'home-hero', 'home-pricing'
  variant text,                       -- '1' or '2'
  plan text,                          -- 'free' (optional)
  to_key text,                        -- 'demo_access', 'static_preview', ...
  path text,                          -- request path
  referer text,
  ip text,
  ua text
);

-- Create index for better query performance
create index if not exists idx_analytics_events_ts on analytics_events(ts desc);
create index if not exists idx_analytics_events_type_src on analytics_events(type, src);

-- If RLS is enabled, create policy to allow service role access
-- alter table analytics_events enable row level security;
-- create policy allow_service_role on analytics_events for all using (auth.role() = 'service_role');
