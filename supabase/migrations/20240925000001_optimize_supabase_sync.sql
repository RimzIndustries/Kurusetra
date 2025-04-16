-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_game_states_user_id ON game_states(user_id);
CREATE INDEX IF NOT EXISTS idx_game_states_kingdom_id ON game_states(kingdom_id);

-- Add function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_states_updated_at ON game_states;
CREATE TRIGGER update_game_states_updated_at
BEFORE UPDATE ON game_states
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Ensure realtime is enabled for all game tables
alter publication supabase_realtime add table user_profiles;
alter publication supabase_realtime add table game_states;
alter publication supabase_realtime add table kingdoms;
alter publication supabase_realtime add table buildings;
alter publication supabase_realtime add table resources;
alter publication supabase_realtime add table military_units;

-- Add a function to handle resource production calculations
CREATE OR REPLACE FUNCTION calculate_resource_production(user_id UUID)
RETURNS TABLE (
    gold_production NUMERIC,
    food_production NUMERIC,
    wood_production NUMERIC,
    stone_production NUMERIC,
    iron_production NUMERIC
) AS $$
DECLARE
    kingdom_id UUID;
BEGIN
    -- Get the kingdom ID for this user
    SELECT k.id INTO kingdom_id FROM kingdoms k WHERE k.user_id = calculate_resource_production.user_id;
    
    -- Return calculated production rates
    RETURN QUERY
    WITH building_counts AS (
        SELECT 
            b.type,
            SUM(b.level) as total_level
        FROM 
            buildings b
        WHERE 
            b.kingdom_id = kingdom_id AND
            b.status = 'active'
        GROUP BY 
            b.type
    )
    SELECT
        -- Base gold production + market bonus
        10 + COALESCE((SELECT total_level * 15 FROM building_counts WHERE type = 'market'), 0) as gold_production,
        -- Base food production + farm bonus
        20 + COALESCE((SELECT total_level * 10 FROM building_counts WHERE type = 'farm'), 0) as food_production,
        -- Base wood production + lumbermill bonus
        15 + COALESCE((SELECT total_level * 8 FROM building_counts WHERE type = 'lumbermill'), 0) as wood_production,
        -- Base stone production + mine bonus
        8 + COALESCE((SELECT total_level * 5 FROM building_counts WHERE type = 'mine'), 0) as stone_production,
        -- Base iron production + mine bonus
        5 + COALESCE((SELECT total_level * 3 FROM building_counts WHERE type = 'mine'), 0) as iron_production;
END;
$$ LANGUAGE plpgsql;
