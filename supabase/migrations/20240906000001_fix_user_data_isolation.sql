-- Enable Row Level Security (RLS) on all game tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kingdoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE troops ENABLE ROW LEVEL SECURITY;
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles table
DROP POLICY IF EXISTS "Users can view their own profiles" ON user_profiles;
CREATE POLICY "Users can view their own profiles"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profiles" ON user_profiles;
CREATE POLICY "Users can update their own profiles"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policies for kingdoms table
DROP POLICY IF EXISTS "Users can view their own kingdoms" ON kingdoms;
CREATE POLICY "Users can view their own kingdoms"
    ON kingdoms FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own kingdoms" ON kingdoms;
CREATE POLICY "Users can update their own kingdoms"
    ON kingdoms FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own kingdoms" ON kingdoms;
CREATE POLICY "Users can insert their own kingdoms"
    ON kingdoms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policies for resources table
DROP POLICY IF EXISTS "Users can view their own resources" ON resources;
CREATE POLICY "Users can view their own resources"
    ON resources FOR SELECT
    USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own resources" ON resources;
CREATE POLICY "Users can update their own resources"
    ON resources FOR UPDATE
    USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own resources" ON resources;
CREATE POLICY "Users can insert their own resources"
    ON resources FOR INSERT
    WITH CHECK (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Create policies for buildings table
DROP POLICY IF EXISTS "Users can view their own buildings" ON buildings;
CREATE POLICY "Users can view their own buildings"
    ON buildings FOR SELECT
    USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own buildings" ON buildings;
CREATE POLICY "Users can update their own buildings"
    ON buildings FOR UPDATE
    USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own buildings" ON buildings;
CREATE POLICY "Users can insert their own buildings"
    ON buildings FOR INSERT
    WITH CHECK (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Create policies for troops table
DROP POLICY IF EXISTS "Users can view their own troops" ON troops;
CREATE POLICY "Users can view their own troops"
    ON troops FOR SELECT
    USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own troops" ON troops;
CREATE POLICY "Users can update their own troops"
    ON troops FOR UPDATE
    USING (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own troops" ON troops;
CREATE POLICY "Users can insert their own troops"
    ON troops FOR INSERT
    WITH CHECK (kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

-- Create policies for attacks table
DROP POLICY IF EXISTS "Users can view their own attacks" ON attacks;
CREATE POLICY "Users can view their own attacks"
    ON attacks FOR SELECT
    USING (attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()) OR 
           defender_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own attacks" ON attacks;
CREATE POLICY "Users can update their own attacks"
    ON attacks FOR UPDATE
    USING (attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own attacks" ON attacks;
CREATE POLICY "Users can insert their own attacks"
    ON attacks FOR INSERT
    WITH CHECK (attacker_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid()));
