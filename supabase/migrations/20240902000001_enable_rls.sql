-- Enable Row Level Security (RLS) on all game-related tables

-- Enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_profiles table
DROP POLICY IF EXISTS "Users can only access their own profiles" ON user_profiles;
CREATE POLICY "Users can only access their own profiles"
ON user_profiles
FOR ALL
USING (auth.uid() = user_id);

-- Enable RLS on kingdoms table
ALTER TABLE kingdoms ENABLE ROW LEVEL SECURITY;

-- Create policy for kingdoms table
DROP POLICY IF EXISTS "Users can only access their own kingdoms" ON kingdoms;
CREATE POLICY "Users can only access their own kingdoms"
ON kingdoms
FOR ALL
USING (auth.uid() = user_id);

-- Enable RLS on resources table
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policy for resources table
DROP POLICY IF EXISTS "Users can only access their own resources" ON resources;
CREATE POLICY "Users can only access their own resources"
ON resources
FOR ALL
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Enable RLS on buildings table
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- Create policy for buildings table
DROP POLICY IF EXISTS "Users can only access their own buildings" ON buildings;
CREATE POLICY "Users can only access their own buildings"
ON buildings
FOR ALL
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Enable RLS on troops table
ALTER TABLE troops ENABLE ROW LEVEL SECURITY;

-- Create policy for troops table
DROP POLICY IF EXISTS "Users can only access their own troops" ON troops;
CREATE POLICY "Users can only access their own troops"
ON troops
FOR ALL
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Enable RLS on attacks table
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;

-- Create policy for attacks table
DROP POLICY IF EXISTS "Users can only access attacks they're involved in" ON attacks;
CREATE POLICY "Users can only access attacks they're involved in"
ON attacks
FOR ALL
USING (
  attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid())
  OR
  defender_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid())
);

-- Add realtime publication for all tables
alter publication supabase_realtime add table user_profiles;
alter publication supabase_realtime add table kingdoms;
alter publication supabase_realtime add table resources;
alter publication supabase_realtime add table buildings;
alter publication supabase_realtime add table troops;
alter publication supabase_realtime add table attacks;