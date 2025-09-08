-- Extend focus_sessions with ritual + intention
ALTER TABLE focus_sessions
  ADD COLUMN IF NOT EXISTS intention text,
  ADD COLUMN IF NOT EXISTS ritual jsonb,
  ADD COLUMN IF NOT EXISTS prep_done_at timestamptz;

-- Add index for intention searches
CREATE INDEX IF NOT EXISTS idx_focus_sessions_intention ON focus_sessions(intention) WHERE intention IS NOT NULL;

-- Add index for ritual searches
CREATE INDEX IF NOT EXISTS idx_focus_sessions_ritual ON focus_sessions USING GIN (ritual) WHERE ritual IS NOT NULL;
