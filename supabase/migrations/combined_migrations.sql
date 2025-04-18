-- Migration 1: Create base tables
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 2: Enhance game systems
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration 3: Add PvP system
CREATE TABLE IF NOT EXISTS player_pvp_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    power_level INTEGER NOT NULL DEFAULT 1000,
    win_count INTEGER DEFAULT 0,
    loss_count INTEGER DEFAULT 0,
    draw_count INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id)
);

CREATE TABLE IF NOT EXISTS pvp_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenger_id UUID REFERENCES players(id) ON DELETE CASCADE,
    defender_id UUID REFERENCES players(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
    match_type TEXT NOT NULL CHECK (match_type IN ('friendly', 'ranked')),
    power_difference INTEGER NOT NULL,
    winner_id UUID REFERENCES players(id),
    match_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (challenger_id != defender_id)
);

-- Migration 4: Add alliance system
CREATE TABLE IF NOT EXISTS alliances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    leader_id UUID REFERENCES players(id),
    max_members INTEGER DEFAULT 15,
    current_members INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alliance_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    rank_name TEXT NOT NULL,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alliance_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    rank_id UUID REFERENCES alliance_ranks(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Migration 5: Add war system
CREATE TABLE IF NOT EXISTS wars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    war_type TEXT NOT NULL CHECK (war_type IN ('player', 'alliance')),
    attacker_id UUID,
    defender_id UUID,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('active', 'ended', 'cancelled')),
    war_score INTEGER DEFAULT 0,
    war_goals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS war_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    war_id UUID REFERENCES wars(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    side TEXT NOT NULL CHECK (side IN ('attacker', 'defender')),
    contribution_score INTEGER DEFAULT 0,
    losses JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_pvp_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliance_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE wars ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Players can view their own data"
ON players FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Players can update their own data"
ON players FOR UPDATE
USING (auth.uid() = id);

-- Create indexes
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_resources_player_id ON resources(player_id);
CREATE INDEX idx_pvp_stats_power_level ON player_pvp_stats(power_level);
CREATE INDEX idx_alliances_name ON alliances(name);
CREATE INDEX idx_war_participants_war_id ON war_participants(war_id); 