-- Create buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kingdom_id UUID NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  gold_cost INTEGER NOT NULL DEFAULT 0,
  food_cost INTEGER NOT NULL DEFAULT 0,
  time_to_upgrade TEXT,
  benefits TEXT,
  icon TEXT,
  construction_status TEXT DEFAULT 'idle',
  completion_time BIGINT,
  health INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own buildings";
CREATE POLICY "Users can view their own buildings"
  ON buildings
  FOR SELECT
  USING (
    kingdom_id IN (
      SELECT id FROM kingdoms WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own buildings";
CREATE POLICY "Users can insert their own buildings"
  ON buildings
  FOR INSERT
  WITH CHECK (
    kingdom_id IN (
      SELECT id FROM kingdoms WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own buildings";
CREATE POLICY "Users can update their own buildings"
  ON buildings
  FOR UPDATE
  USING (
    kingdom_id IN (
      SELECT id FROM kingdoms WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own buildings";
CREATE POLICY "Users can delete their own buildings"
  ON buildings
  FOR DELETE
  USING (
    kingdom_id IN (
      SELECT id FROM kingdoms WHERE user_id = auth.uid()
    )
  );

-- Enable realtime
alter publication supabase_realtime add table buildings;