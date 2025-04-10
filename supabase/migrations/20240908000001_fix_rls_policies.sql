-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kingdoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE troops ENABLE ROW LEVEL SECURITY;
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can only view their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can only update their own profiles" ON user_profiles;

DROP POLICY IF EXISTS "Users can view their own kingdoms" ON kingdoms;
DROP POLICY IF EXISTS "Users can update their own kingdoms" ON kingdoms;
DROP POLICY IF EXISTS "Users can insert their own kingdoms" ON kingdoms;
DROP POLICY IF EXISTS "Users can only view their own kingdoms" ON kingdoms;
DROP POLICY IF EXISTS "Users can only update their own kingdoms" ON kingdoms;

DROP POLICY IF EXISTS "Users can view their own resources" ON resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
DROP POLICY IF EXISTS "Users can insert their own resources" ON resources;
DROP POLICY IF EXISTS "Users can only view their own resources" ON resources;
DROP POLICY IF EXISTS "Users can only update their own resources" ON resources;

DROP POLICY IF EXISTS "Users can view their own buildings" ON buildings;
DROP POLICY IF EXISTS "Users can update their own buildings" ON buildings;
DROP POLICY IF EXISTS "Users can insert their own buildings" ON buildings;
DROP POLICY IF EXISTS "Users can only view their own buildings" ON buildings;
DROP POLICY IF EXISTS "Users can only update their own buildings" ON buildings;

DROP POLICY IF EXISTS "Users can view their own troops" ON troops;
DROP POLICY IF EXISTS "Users can update their own troops" ON troops;
DROP POLICY IF EXISTS "Users can insert their own troops" ON troops;
DROP POLICY IF EXISTS "Users can only view their own troops" ON troops;
DROP POLICY IF EXISTS "Users can only update their own troops" ON troops;

DROP POLICY IF EXISTS "Users can view their own attacks" ON attacks;
DROP POLICY IF EXISTS "Users can update their own attacks" ON attacks;
DROP POLICY IF EXISTS "Users can insert their own attacks" ON attacks;
DROP POLICY IF EXISTS "Users can only view their own attacks" ON attacks;
DROP POLICY IF EXISTS "Users can only update their own attacks" ON attacks;
DROP POLICY IF EXISTS "Users can only view attacks against them" ON attacks;

-- Create policies for user_profiles table
CREATE POLICY "Users can view their own profiles"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for kingdoms table
CREATE POLICY "Users can view their own kingdoms"
ON kingdoms FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own kingdoms"
ON kingdoms FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own kingdoms"
ON kingdoms FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policies for resources table
CREATE POLICY "Users can view their own resources"
ON resources FOR SELECT
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own resources"
ON resources FOR UPDATE
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own resources"
ON resources FOR INSERT
WITH CHECK (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Create policies for buildings table
CREATE POLICY "Users can view their own buildings"
ON buildings FOR SELECT
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own buildings"
ON buildings FOR UPDATE
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own buildings"
ON buildings FOR INSERT
WITH CHECK (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Create policies for troops table
CREATE POLICY "Users can view their own troops"
ON troops FOR SELECT
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own troops"
ON troops FOR UPDATE
USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own troops"
ON troops FOR INSERT
WITH CHECK (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Create policies for attacks table
CREATE POLICY "Users can view their own attacks"
ON attacks FOR SELECT
USING (attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()) OR 
       defender_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own attacks"
ON attacks FOR UPDATE
USING (attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own attacks"
ON attacks FOR INSERT
WITH CHECK (attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Enable realtime for all tables
alter publication supabase_realtime add table user_profiles;
alter publication supabase_realtime add table kingdoms;
alter publication supabase_realtime add table resources;
alter publication supabase_realtime add table buildings;
alter publication supabase_realtime add table troops;
alter publication supabase_realtime add table attacks;