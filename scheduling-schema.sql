-- Add scheduling fields to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ;

-- Create workspace preferences table
CREATE TABLE IF NOT EXISTS public.workspace_preferences (
    workspace_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    weekday_start TEXT DEFAULT '09:00',
    weekday_end TEXT DEFAULT '18:00',
    weekend_start TEXT DEFAULT '10:00',
    weekend_end TEXT DEFAULT '16:00',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for scheduling queries
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_status_due 
ON public.tasks(workspace_id, status, due_at);

CREATE INDEX IF NOT EXISTS idx_tasks_workspace_schedule 
ON public.tasks(workspace_id, start_at, end_at);

-- Enable RLS for workspace preferences
ALTER TABLE public.workspace_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for workspace preferences
CREATE POLICY "Users can view their own workspace preferences" ON public.workspace_preferences
FOR SELECT USING (workspace_id = auth.uid());

CREATE POLICY "Users can insert their own workspace preferences" ON public.workspace_preferences
FOR INSERT WITH CHECK (workspace_id = auth.uid());

CREATE POLICY "Users can update their own workspace preferences" ON public.workspace_preferences
FOR UPDATE USING (workspace_id = auth.uid());

CREATE POLICY "Users can delete their own workspace preferences" ON public.workspace_preferences
FOR DELETE USING (workspace_id = auth.uid());

-- Insert default preferences for existing users
INSERT INTO public.workspace_preferences (workspace_id, weekday_start, weekday_end, weekend_start, weekend_end, timezone)
SELECT id, '09:00', '18:00', '10:00', '16:00', 'Asia/Kolkata'
FROM public.profiles
WHERE id NOT IN (SELECT workspace_id FROM public.workspace_preferences)
ON CONFLICT (workspace_id) DO NOTHING;
