-- Add game settings and rules
ALTER TABLE games
    ADD COLUMN map_size INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN turn_duration INTEGER NOT NULL DEFAULT 300, -- in seconds
    ADD COLUMN max_turns INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN victory_conditions JSONB DEFAULT '{
        "domination": {"required_territory": 0.5},
        "score": {"target_score": 10000},
        "time_limit": {"max_turns": 100}
    }'::jsonb,
    ADD COLUMN current_turn INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN turn_end_time TIMESTAMP WITH TIME ZONE;

-- Add player starting conditions
ALTER TABLE players
    ADD COLUMN starting_resources JSONB DEFAULT '{
        "gold": 1000,
        "wood": 500,
        "stone": 500,
        "food": 1000,
        "population": 10
    }'::jsonb,
    ADD COLUMN starting_buildings JSONB DEFAULT '[
        {"type": "town_hall", "level": 1},
        {"type": "farm", "level": 1},
        {"type": "lumber_mill", "level": 1}
    ]'::jsonb,
    ADD COLUMN starting_units JSONB DEFAULT '[
        {"type": "worker", "count": 5},
        {"type": "soldier", "count": 2}
    ]'::jsonb,
    ADD COLUMN score INTEGER NOT NULL DEFAULT 0;

-- Add building requirements and effects
CREATE TABLE IF NOT EXISTS building_requirements (
    building_type building_type PRIMARY KEY,
    required_resources JSONB NOT NULL,
    required_buildings JSONB DEFAULT '{}'::jsonb,
    production_rates JSONB NOT NULL,
    max_level INTEGER NOT NULL DEFAULT 5,
    upgrade_multiplier FLOAT NOT NULL DEFAULT 1.5
);

-- Add unit requirements and stats
CREATE TABLE IF NOT EXISTS unit_stats (
    unit_type unit_type PRIMARY KEY,
    required_resources JSONB NOT NULL,
    required_buildings JSONB DEFAULT '{}'::jsonb,
    base_health INTEGER NOT NULL,
    base_attack INTEGER NOT NULL,
    base_defense INTEGER NOT NULL,
    training_time INTEGER NOT NULL, -- in seconds
    population_cost INTEGER NOT NULL
);

-- Add research requirements and effects
CREATE TABLE IF NOT EXISTS research_effects (
    research_type research_type PRIMARY KEY,
    required_resources JSONB NOT NULL,
    required_buildings JSONB DEFAULT '{}'::jsonb,
    research_time INTEGER NOT NULL, -- in seconds
    effects JSONB NOT NULL
);

-- Add territory control
CREATE TABLE IF NOT EXISTS territories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    player_id UUID REFERENCES players(id),
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    size INTEGER NOT NULL DEFAULT 1,
    resources JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, position_x, position_y)
);

-- Add turn-based actions
CREATE TABLE IF NOT EXISTS player_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    player_id UUID NOT NULL REFERENCES players(id),
    turn INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_territories_game_id ON territories(game_id);
CREATE INDEX idx_territories_player_id ON territories(player_id);
CREATE INDEX idx_player_actions_game_turn ON player_actions(game_id, turn);
CREATE INDEX idx_player_actions_player_turn ON player_actions(player_id, turn);

-- Enable RLS
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_effects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Territories are viewable by game participants" ON territories
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their territories" ON territories
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Player actions are viewable by game participants" ON player_actions
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their actions" ON player_actions
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

-- Create functions for game flow
CREATE OR REPLACE FUNCTION initialize_player()
RETURNS TRIGGER AS $$
BEGIN
    -- Create starting resources
    INSERT INTO resources (player_id, resource_type, amount)
    SELECT NEW.id, key::resource_type, value::integer
    FROM jsonb_each_text(NEW.starting_resources);

    -- Create starting buildings
    INSERT INTO buildings (player_id, building_type, level, position_x, position_y)
    SELECT 
        NEW.id,
        (building->>'type')::building_type,
        (building->>'level')::integer,
        NEW.position_x + (row_number() OVER () - 1) * 2,
        NEW.position_y
    FROM jsonb_array_elements(NEW.starting_buildings) AS building;

    -- Create starting units
    INSERT INTO units (player_id, unit_type, count, position_x, position_y)
    SELECT 
        NEW.id,
        (unit->>'type')::unit_type,
        (unit->>'count')::integer,
        NEW.position_x,
        NEW.position_y
    FROM jsonb_array_elements(NEW.starting_units) AS unit;

    -- Create initial territory
    INSERT INTO territories (game_id, player_id, position_x, position_y, size)
    VALUES (NEW.game_id, NEW.id, NEW.position_x, NEW.position_y, 1);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER initialize_player_trigger
    AFTER INSERT ON players
    FOR EACH ROW
    EXECUTE FUNCTION initialize_player();

-- Function to process turn
CREATE OR REPLACE FUNCTION process_turn(game_id UUID)
RETURNS VOID AS $$
DECLARE
    current_turn INTEGER;
    player RECORD;
    action RECORD;
BEGIN
    -- Get current turn
    SELECT current_turn INTO current_turn FROM games WHERE id = game_id;

    -- Process each player's actions
    FOR player IN SELECT * FROM players WHERE game_id = game_id AND status = 'active' LOOP
        -- Process resources
        UPDATE resources r
        SET amount = r.amount + (
            SELECT COALESCE(SUM(b.production_rates->>r.resource_type::text), 0)
            FROM buildings b
            WHERE b.player_id = player.id
        )
        WHERE r.player_id = player.id;

        -- Process actions
        FOR action IN SELECT * FROM player_actions 
                     WHERE game_id = game_id 
                     AND player_id = player.id 
                     AND turn = current_turn 
                     AND status = 'pending' LOOP
            -- Process different action types
            CASE action.action_type
                WHEN 'build' THEN
                    -- Handle building construction
                    NULL; -- Implementation needed
                WHEN 'train' THEN
                    -- Handle unit training
                    NULL; -- Implementation needed
                WHEN 'research' THEN
                    -- Handle research
                    NULL; -- Implementation needed
                WHEN 'move' THEN
                    -- Handle unit movement
                    NULL; -- Implementation needed
                WHEN 'attack' THEN
                    -- Handle combat
                    NULL; -- Implementation needed
            END CASE;

            -- Mark action as processed
            UPDATE player_actions
            SET status = 'completed'
            WHERE id = action.id;
        END LOOP;

        -- Update player score
        UPDATE players
        SET score = (
            SELECT COALESCE(SUM(amount), 0) FROM resources WHERE player_id = player.id
        ) + (
            SELECT COUNT(*) FROM territories WHERE player_id = player.id
        ) * 100
        WHERE id = player.id;
    END LOOP;

    -- Check victory conditions
    PERFORM check_victory_conditions(game_id);

    -- Increment turn
    UPDATE games
    SET current_turn = current_turn + 1,
        turn_end_time = CURRENT_TIMESTAMP + (turn_duration || ' seconds')::interval
    WHERE id = game_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check victory conditions
CREATE OR REPLACE FUNCTION check_victory_conditions(game_id UUID)
RETURNS VOID AS $$
DECLARE
    game RECORD;
    territory_count INTEGER;
    max_score INTEGER;
BEGIN
    SELECT * INTO game FROM games WHERE id = game_id;

    -- Check domination victory
    SELECT COUNT(*) INTO territory_count
    FROM territories
    WHERE game_id = game_id AND player_id IS NOT NULL;

    IF territory_count >= (game.map_size * game.map_size * (game.victory_conditions->'domination'->>'required_territory')::float) THEN
        UPDATE games
        SET status = 'completed',
            ended_at = CURRENT_TIMESTAMP
        WHERE id = game_id;
        RETURN;
    END IF;

    -- Check score victory
    SELECT MAX(score) INTO max_score
    FROM players
    WHERE game_id = game_id;

    IF max_score >= (game.victory_conditions->'score'->>'target_score')::integer THEN
        UPDATE games
        SET status = 'completed',
            ended_at = CURRENT_TIMESTAMP
        WHERE id = game_id;
        RETURN;
    END IF;

    -- Check turn limit
    IF game.current_turn >= game.max_turns THEN
        UPDATE games
        SET status = 'completed',
            ended_at = CURRENT_TIMESTAMP
        WHERE id = game_id;
    END IF;
END;
$$ LANGUAGE plpgsql; 