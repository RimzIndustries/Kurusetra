-- Create additional enum types
CREATE TYPE alliance_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE combat_type AS ENUM ('attack', 'defense', 'raid');
CREATE TYPE combat_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE building_type AS ENUM (
    'town_hall', 'barracks', 'farm', 'mine', 'lumber_mill', 
    'market', 'temple', 'wall', 'tower', 'warehouse'
);
CREATE TYPE unit_type AS ENUM (
    'worker', 'soldier', 'archer', 'cavalry', 'siege', 
    'scout', 'healer', 'mage', 'berserker', 'guardian'
);

-- Create alliance table
CREATE TABLE IF NOT EXISTS alliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    player_id UUID NOT NULL REFERENCES players(id),
    target_player_id UUID NOT NULL REFERENCES players(id),
    status alliance_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, player_id, target_player_id)
);

-- Create combat table
CREATE TABLE IF NOT EXISTS combats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    attacker_id UUID NOT NULL REFERENCES players(id),
    defender_id UUID NOT NULL REFERENCES players(id),
    combat_type combat_type NOT NULL,
    status combat_status NOT NULL DEFAULT 'pending',
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    result JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create combat units table
CREATE TABLE IF NOT EXISTS combat_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    combat_id UUID NOT NULL REFERENCES combats(id),
    player_id UUID NOT NULL REFERENCES players(id),
    unit_type unit_type NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    health INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create research table
CREATE TABLE IF NOT EXISTS researches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id),
    research_type VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, research_type)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id),
    achievement_type VARCHAR(50) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, achievement_type)
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    player_id UUID NOT NULL REFERENCES players(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_alliances_game_id ON alliances(game_id);
CREATE INDEX idx_alliances_player_id ON alliances(player_id);
CREATE INDEX idx_combats_game_id ON combats(game_id);
CREATE INDEX idx_combats_attacker_id ON combats(attacker_id);
CREATE INDEX idx_combats_defender_id ON combats(defender_id);
CREATE INDEX idx_combat_units_combat_id ON combat_units(combat_id);
CREATE INDEX idx_researches_player_id ON researches(player_id);
CREATE INDEX idx_achievements_player_id ON achievements(player_id);
CREATE INDEX idx_chat_messages_game_id ON chat_messages(game_id);

-- Enable RLS
ALTER TABLE alliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE combats ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE researches ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Alliances are viewable by game participants" ON alliances
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their alliances" ON alliances
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Combats are viewable by game participants" ON combats
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their combats" ON combats
    FOR ALL USING (
        attacker_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Combat units are viewable by game participants" ON combat_units
    FOR SELECT USING (
        combat_id IN (SELECT id FROM combats WHERE 
            attacker_id IN (SELECT id FROM players WHERE user_id = auth.uid()) OR
            defender_id IN (SELECT id FROM players WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Players can manage their combat units" ON combat_units
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Researches are viewable by game participants" ON researches
    FOR SELECT USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their researches" ON researches
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Achievements are viewable by game participants" ON achievements
    FOR SELECT USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their achievements" ON achievements
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Chat messages are viewable by game participants" ON chat_messages
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can create chat messages" ON chat_messages
    FOR INSERT WITH CHECK (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

-- Create functions
CREATE OR REPLACE FUNCTION check_combat_eligibility()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if both players are active
    IF NOT EXISTS (
        SELECT 1 FROM players 
        WHERE id = NEW.attacker_id AND status = 'active'
    ) OR NOT EXISTS (
        SELECT 1 FROM players 
        WHERE id = NEW.defender_id AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Both players must be active to start combat';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_combat_eligibility_trigger
    BEFORE INSERT ON combats
    FOR EACH ROW
    EXECUTE FUNCTION check_combat_eligibility();

-- Function to calculate combat result
CREATE OR REPLACE FUNCTION calculate_combat_result(combat_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    attacker_units RECORD;
    defender_units RECORD;
    attacker_power INTEGER;
    defender_power INTEGER;
BEGIN
    -- Calculate attacker power
    SELECT SUM(count * health) INTO attacker_power
    FROM combat_units
    WHERE combat_id = combat_id AND player_id = (
        SELECT attacker_id FROM combats WHERE id = combat_id
    );

    -- Calculate defender power
    SELECT SUM(count * health) INTO defender_power
    FROM combat_units
    WHERE combat_id = combat_id AND player_id = (
        SELECT defender_id FROM combats WHERE id = combat_id
    );

    -- Determine winner and calculate losses
    result := jsonb_build_object(
        'winner', CASE WHEN attacker_power > defender_power THEN 'attacker' ELSE 'defender' END,
        'attacker_power', attacker_power,
        'defender_power', defender_power,
        'attacker_losses', ROUND(defender_power * 0.1),
        'defender_losses', ROUND(attacker_power * 0.1)
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update game status when all players are eliminated
CREATE OR REPLACE FUNCTION check_game_completion()
RETURNS TRIGGER AS $$
DECLARE
    active_players INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_players
    FROM players
    WHERE game_id = NEW.game_id AND status = 'active';

    IF active_players <= 1 THEN
        UPDATE games
        SET status = 'completed',
            ended_at = CURRENT_TIMESTAMP
        WHERE id = NEW.game_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_game_completion_trigger
    AFTER UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION check_game_completion(); 