-- Ensure each user can only access their own profile data
DROP POLICY IF EXISTS "Users can only access their own profile" ON user_profiles;
CREATE POLICY "Users can only access their own profile"
  ON user_profiles
  FOR ALL
  USING (auth.uid() = user_id);

-- Ensure each user can only access their own kingdom data
DROP POLICY IF EXISTS "Users can only access their own kingdom" ON kingdoms;
CREATE POLICY "Users can only access their own kingdom"
  ON kingdoms
  FOR ALL
  USING (auth.uid() = user_id);

-- Ensure each user can only access resources for their own kingdom
DROP POLICY IF EXISTS "Users can only access their own resources" ON resources;
CREATE POLICY "Users can only access their own resources"
  ON resources
  FOR ALL
  USING ((SELECT user_id FROM kingdoms WHERE id = kingdom_id) = auth.uid());

-- Ensure each user can only access buildings for their own kingdom
DROP POLICY IF EXISTS "Users can only access their own buildings" ON buildings;
CREATE POLICY "Users can only access their own buildings"
  ON buildings
  FOR ALL
  USING ((SELECT user_id FROM kingdoms WHERE id = kingdom_id) = auth.uid());

-- Ensure each user can only access troops for their own kingdom
DROP POLICY IF EXISTS "Users can only access their own troops" ON troops;
CREATE POLICY "Users can only access their own troops"
  FOR ALL
  ON troops
  USING ((SELECT user_id FROM kingdoms WHERE id = kingdom_id) = auth.uid());

-- For attacks table, users can see attacks where they are either the attacker or defender
DROP POLICY IF EXISTS "Users can see attacks involving their kingdom" ON attacks;
CREATE POLICY "Users can see attacks involving their kingdom"
  FOR SELECT
  ON attacks
  USING (
    (SELECT user_id FROM kingdoms WHERE id = source_kingdom_id) = auth.uid() OR
    (SELECT user_id FROM kingdoms WHERE id = target_kingdom_id) = auth.uid()
  );

-- Users can only create attacks where they are the attacker
DROP POLICY IF EXISTS "Users can only create attacks from their kingdom" ON attacks;
CREATE POLICY "Users can only create attacks from their kingdom"
  FOR INSERT
  ON attacks
  WITH CHECK ((SELECT user_id FROM kingdoms WHERE id = source_kingdom_id) = auth.uid());

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kingdoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE troops ENABLE ROW LEVEL SECURITY;
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;
