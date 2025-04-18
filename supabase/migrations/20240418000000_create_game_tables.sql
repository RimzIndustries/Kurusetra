-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE game_status AS ENUM ('waiting', 'in_progress', 'completed', 'cancelled');
CREATE TYPE player_status AS ENUM ('active', 'inactive', 'eliminated');
CREATE TYPE resource_type AS ENUM ('gold', 'wood', 'stone', 'food', 'population');

-- Create tables
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status game_status NOT NULL DEFAULT 'waiting',
    max_players INTEGER NOT NULL DEFAULT 4,
    current_players INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    game_id UUID NOT NULL REFERENCES games(id),
    kingdom_name VARCHAR(255) NOT NULL,
    status player_status NOT NULL DEFAULT 'active',
    color VARCHAR(7) NOT NULL,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, game_id)
);

CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id),
    resource_type resource_type NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, resource_type)
);

CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id),
    building_type VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    health INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES players(id),
    unit_type VARCHAR(50) NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    health INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    player_id UUID REFERENCES players(id),
    event_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_resources_player_id ON resources(player_id);
CREATE INDEX idx_buildings_player_id ON buildings(player_id);
CREATE INDEX idx_units_player_id ON units(player_id);
CREATE INDEX idx_game_events_game_id ON game_events(game_id);

-- Create RLS policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- Games policies
CREATE POLICY "Games are viewable by everyone" ON games
    FOR SELECT USING (true);

CREATE POLICY "Users can create games" ON games
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Game creators can update their games" ON games
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM players WHERE game_id = id AND user_id = auth.uid()
    ));

-- Players policies
CREATE POLICY "Players are viewable by game participants" ON players
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can join games" ON players
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players can update their own data" ON players
    FOR UPDATE USING (user_id = auth.uid());

-- Resources policies
CREATE POLICY "Resources are viewable by game participants" ON resources
    FOR SELECT USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can update their own resources" ON resources
    FOR UPDATE USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

-- Buildings policies
CREATE POLICY "Buildings are viewable by game participants" ON buildings
    FOR SELECT USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their own buildings" ON buildings
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

-- Units policies
CREATE POLICY "Units are viewable by game participants" ON units
    FOR SELECT USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can manage their own units" ON units
    FOR ALL USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

-- Game events policies
CREATE POLICY "Game events are viewable by game participants" ON game_events
    FOR SELECT USING (
        game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Players can create game events" ON game_events
    FOR INSERT WITH CHECK (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

-- Create functions
CREATE OR REPLACE FUNCTION update_player_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_last_active_trigger
    BEFORE UPDATE ON players
    FOR EACH ROW
    EXECUTE FUNCTION update_player_last_active();

-- Create function to check game status
CREATE OR REPLACE FUNCTION check_game_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update game status based on player count
    IF NEW.status = 'waiting' AND NEW.current_players >= NEW.max_players THEN
        NEW.status := 'in_progress';
        NEW.started_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_game_status_trigger
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION check_game_status(); 