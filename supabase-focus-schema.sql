-- Focus Mode Database Schema
-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  start_at timestamptz NOT NULL DEFAULT now(),
  end_at timestamptz NULL,
  planned_minutes integer NOT NULL DEFAULT 50,
  actual_minutes integer NULL,
  distraction_count integer NOT NULL DEFAULT 0,
  notes text NULL,
  self_rating integer NULL CHECK (self_rating >= 1 AND self_rating <= 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create focus_events table (append-only)
CREATE TABLE IF NOT EXISTS focus_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES focus_sessions(id) ON DELETE CASCADE,
  ts timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL CHECK (type IN ('start', 'pause', 'resume', 'stop', 'distraction', 'note')),
  payload jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_workspace ON focus_sessions(user_id, workspace_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_start_at ON focus_sessions(start_at);
CREATE INDEX IF NOT EXISTS idx_focus_events_session_id ON focus_events(session_id);
CREATE INDEX IF NOT EXISTS idx_focus_events_ts ON focus_events(ts);

-- RLS policies (service role only for now)
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_events ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert/update/select
CREATE POLICY "Service role can manage focus_sessions" ON focus_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage focus_events" ON focus_events
  FOR ALL USING (auth.role() = 'service_role');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_focus_sessions_updated_at 
  BEFORE UPDATE ON focus_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
