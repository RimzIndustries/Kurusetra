-- Add setup_completed and setup_completed_at columns to user_registrations table
ALTER TABLE user_registrations ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE user_registrations ADD COLUMN IF NOT EXISTS setup_completed_at TIMESTAMPTZ;

-- Create user_events table for tracking important user events
CREATE TABLE IF NOT EXISTS user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS user_events_user_id_idx ON user_events(user_id);
CREATE INDEX IF NOT EXISTS user_events_event_type_idx ON user_events(event_type);

-- Enable realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE user_events;

-- Add RLS policies for user_events
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own events
DROP POLICY IF EXISTS "Users can view their own events" ON user_events;
CREATE POLICY "Users can view their own events"
  ON user_events FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow the system to insert events
DROP POLICY IF EXISTS "System can insert events" ON user_events;
CREATE POLICY "System can insert events"
  ON user_events FOR INSERT
  WITH CHECK (true);
