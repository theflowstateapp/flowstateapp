-- Focus Sessions and Events Tables
-- These tables support the focus/pomodoro functionality

-- Focus Sessions table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  workspace_id VARCHAR(50) DEFAULT 'qa-ws',
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE,
  planned_minutes INTEGER NOT NULL DEFAULT 25,
  actual_minutes INTEGER,
  intention TEXT,
  ritual TEXT,
  distraction_count INTEGER DEFAULT 0,
  self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Focus Events table (for tracking interruptions, breaks, etc.)
CREATE TABLE IF NOT EXISTS public.focus_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.focus_sessions(id) ON DELETE CASCADE NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('start', 'pause', 'resume', 'break', 'distraction', 'end')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON public.focus_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_start_at ON public.focus_sessions(start_at);
CREATE INDEX IF NOT EXISTS idx_focus_events_session_id ON public.focus_events(session_id);
CREATE INDEX IF NOT EXISTS idx_focus_events_timestamp ON public.focus_events(timestamp);

-- Enable row level security
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_events ENABLE ROW LEVEL SECURITY;

-- Create policies for access control
CREATE POLICY "Users can manage their own focus sessions" ON public.focus_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own focus events" ON public.focus_events
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.focus_sessions WHERE id = session_id));
