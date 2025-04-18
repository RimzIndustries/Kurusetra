-- Enhance alliance system
CREATE TABLE IF NOT EXISTS alliance_ranks (
    rank_type VARCHAR(50) PRIMARY KEY,
    permissions JSONB NOT NULL,
    requirements JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS alliance_members (
    alliance_id UUID NOT NULL REFERENCES alliances(id),
    player_id UUID NOT NULL REFERENCES players(id),
    rank_type VARCHAR(50) NOT NULL REFERENCES alliance_ranks(rank_type),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    contribution_points INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (alliance_id, player_id)
);

-- Add war system
CREATE TABLE IF NOT EXISTS wars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id),
    war_type VARCHAR(50) NOT NULL CHECK (war_type IN ('player_war', 'alliance_war')),
    attacker_id UUID NOT NULL,
    defender_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended', 'truce')),
    war_score INTEGER NOT NULL DEFAULT 0,
    war_goals JSONB NOT NULL,
    war_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (war_type = 'player_war' AND attacker_id IN (SELECT id FROM players) AND defender_id IN (SELECT id FROM players)) OR
        (war_type = 'alliance_war' AND attacker_id IN (SELECT id FROM alliances) AND defender_id IN (SELECT id FROM alliances))
    )
);

CREATE TABLE IF NOT EXISTS war_participants (
    war_id UUID NOT NULL REFERENCES wars(id),
    participant_id UUID NOT NULL,
    participant_type VARCHAR(50) NOT NULL CHECK (participant_type IN ('player', 'alliance')),
    side VARCHAR(50) NOT NULL CHECK (side IN ('attacker', 'defender')),
    war_contribution INTEGER NOT NULL DEFAULT 0,
    losses JSONB DEFAULT '{}'::jsonb,
    gains JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (war_id, participant_id),
    CHECK (
        (participant_type = 'player' AND participant_id IN (SELECT id FROM players)) OR
        (participant_type = 'alliance' AND participant_id IN (SELECT id FROM alliances))
    )
);

CREATE TABLE IF NOT EXISTS war_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    war_id UUID NOT NULL REFERENCES wars(id),
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('battle', 'raid', 'siege', 'truce_proposal', 'peace_treaty')),
    attacker_id UUID NOT NULL,
    defender_id UUID NOT NULL,
    location_x INTEGER NOT NULL,
    location_y INTEGER NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_wars_game_id ON wars(game_id);
CREATE INDEX idx_wars_attacker_id ON wars(attacker_id);
CREATE INDEX idx_wars_defender_id ON wars(defender_id);
CREATE INDEX idx_war_participants_war_id ON war_participants(war_id);
CREATE INDEX idx_war_participants_participant_id ON war_participants(participant_id);
CREATE INDEX idx_war_events_war_id ON war_events(war_id);

-- Enable RLS
ALTER TABLE alliance_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliance_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE wars ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE war_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Alliance ranks are viewable by everyone" ON alliance_ranks
    FOR SELECT USING (true);

CREATE POLICY "Alliance members can view their alliance" ON alliance_members
    FOR SELECT USING (
        player_id IN (SELECT id FROM players WHERE user_id = auth.uid())
    );

CREATE POLICY "Wars are viewable by participants" ON wars
    FOR SELECT USING (
        id IN (
            SELECT war_id FROM war_participants 
            WHERE participant_id IN (
                SELECT id FROM players WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "War participants are viewable by participants" ON war_participants
    FOR SELECT USING (
        war_id IN (
            SELECT id FROM wars 
            WHERE id IN (
                SELECT war_id FROM war_participants 
                WHERE participant_id IN (
                    SELECT id FROM players WHERE user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "War events are viewable by participants" ON war_events
    FOR SELECT USING (
        war_id IN (
            SELECT id FROM wars 
            WHERE id IN (
                SELECT war_id FROM war_participants 
                WHERE participant_id IN (
                    SELECT id FROM players WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Create functions for war system
CREATE OR REPLACE FUNCTION declare_war(
    p_game_id UUID,
    p_war_type VARCHAR(50),
    p_attacker_id UUID,
    p_defender_id UUID,
    p_war_goals JSONB
)
RETURNS UUID AS $$
DECLARE
    v_war_id UUID;
    v_attacker_rank INTEGER;
    v_defender_rank INTEGER;
    v_rank_difference INTEGER;
BEGIN
    -- Check rank difference for player wars
    IF p_war_type = 'player_war' THEN
        SELECT score INTO v_attacker_rank
        FROM players
        WHERE id = p_attacker_id;

        SELECT score INTO v_defender_rank
        FROM players
        WHERE id = p_defender_id;

        v_rank_difference := ABS(v_attacker_rank - v_defender_rank);
        
        -- Only allow war if rank difference is within 20%
        IF v_rank_difference > (LEAST(v_attacker_rank, v_defender_rank) * 0.2) THEN
            RAISE EXCEPTION 'Rank difference too large for war declaration';
        END IF;
    END IF;

    -- Create war
    INSERT INTO wars (
        game_id,
        war_type,
        attacker_id,
        defender_id,
        war_goals
    )
    VALUES (
        p_game_id,
        p_war_type,
        p_attacker_id,
        p_defender_id,
        p_war_goals
    )
    RETURNING id INTO v_war_id;

    -- Add participants
    IF p_war_type = 'player_war' THEN
        -- Add single players
        INSERT INTO war_participants (war_id, participant_id, participant_type, side)
        VALUES 
            (v_war_id, p_attacker_id, 'player', 'attacker'),
            (v_war_id, p_defender_id, 'player', 'defender');
    ELSE
        -- Add alliance members
        INSERT INTO war_participants (war_id, participant_id, participant_type, side)
        SELECT 
            v_war_id,
            player_id,
            'player',
            CASE 
                WHEN alliance_id = p_attacker_id THEN 'attacker'
                ELSE 'defender'
            END
        FROM alliance_members
        WHERE alliance_id IN (p_attacker_id, p_defender_id);
    END IF;

    RETURN v_war_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_battle(
    p_war_id UUID,
    p_attacker_id UUID,
    p_defender_id UUID,
    p_location_x INTEGER,
    p_location_y INTEGER,
    p_attacker_units JSONB,
    p_defender_units JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_battle_result JSONB;
    v_attacker_power INTEGER;
    v_defender_power INTEGER;
    v_attacker_losses JSONB;
    v_defender_losses JSONB;
    v_territory_gains JSONB;
BEGIN
    -- Calculate battle power
    SELECT calculate_battle_power(p_attacker_units) INTO v_attacker_power;
    SELECT calculate_battle_power(p_defender_units) INTO v_defender_power;

    -- Calculate losses based on power difference
    v_attacker_losses := calculate_losses(p_attacker_units, v_defender_power / v_attacker_power);
    v_defender_losses := calculate_losses(p_defender_units, v_attacker_power / v_defender_power);

    -- Calculate territory gains
    IF v_attacker_power > v_defender_power * 1.5 THEN
        v_territory_gains := jsonb_build_object(
            'territories', ARRAY(
                SELECT id FROM territories 
                WHERE player_id = p_defender_id 
                AND position_x = p_location_x 
                AND position_y = p_location_y
            )
        );
    END IF;

    -- Record battle event
    INSERT INTO war_events (
        war_id,
        event_type,
        attacker_id,
        defender_id,
        location_x,
        location_y,
        event_data
    )
    VALUES (
        p_war_id,
        'battle',
        p_attacker_id,
        p_defender_id,
        p_location_x,
        p_location_y,
        jsonb_build_object(
            'attacker_power', v_attacker_power,
            'defender_power', v_defender_power,
            'attacker_losses', v_attacker_losses,
            'defender_losses', v_defender_losses,
            'territory_gains', v_territory_gains
        )
    );

    -- Update war score
    UPDATE wars
    SET war_score = war_score + (
        CASE 
            WHEN v_attacker_power > v_defender_power THEN 1
            ELSE -1
        END
    )
    WHERE id = p_war_id;

    -- Update participant losses and gains
    UPDATE war_participants
    SET 
        losses = losses || v_attacker_losses,
        gains = gains || v_territory_gains
    WHERE war_id = p_war_id AND participant_id = p_attacker_id;

    UPDATE war_participants
    SET losses = losses || v_defender_losses
    WHERE war_id = p_war_id AND participant_id = p_defender_id;

    -- Return battle result
    RETURN jsonb_build_object(
        'attacker_power', v_attacker_power,
        'defender_power', v_defender_power,
        'attacker_losses', v_attacker_losses,
        'defender_losses', v_defender_losses,
        'territory_gains', v_territory_gains
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_battle_power(units JSONB)
RETURNS INTEGER AS $$
DECLARE
    v_total_power INTEGER := 0;
    v_unit RECORD;
BEGIN
    FOR v_unit IN SELECT * FROM jsonb_each_text(units) LOOP
        SELECT 
            (base_attack + base_defense) * v_unit.value::integer
        INTO v_total_power
        FROM unit_stats
        WHERE unit_type = v_unit.key::unit_type;
    END LOOP;
    RETURN v_total_power;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_losses(units JSONB, power_ratio FLOAT)
RETURNS JSONB AS $$
DECLARE
    v_losses JSONB := '{}'::jsonb;
    v_unit RECORD;
    v_loss_count INTEGER;
BEGIN
    FOR v_unit IN SELECT * FROM jsonb_each_text(units) LOOP
        v_loss_count := FLOOR(v_unit.value::integer * power_ratio * 0.5);
        v_losses := v_losses || jsonb_build_object(v_unit.key, v_loss_count);
    END LOOP;
    RETURN v_losses;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE OR REPLACE FUNCTION check_war_conditions()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if war should end based on war score
    IF NEW.war_score >= 10 THEN
        NEW.status := 'ended';
        NEW.ended_at := CURRENT_TIMESTAMP;
        NEW.war_results := jsonb_build_object(
            'winner', CASE WHEN NEW.war_score > 0 THEN 'attacker' ELSE 'defender' END,
            'final_score', NEW.war_score
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_war_conditions_trigger
    BEFORE UPDATE ON wars
    FOR EACH ROW
    EXECUTE FUNCTION check_war_conditions(); 