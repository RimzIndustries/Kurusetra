-- Initialize alliance ranks
INSERT INTO alliance_ranks (rank_type, permissions, requirements)
VALUES 
    ('leader', '{
        "declare_war": true,
        "accept_members": true,
        "kick_members": true,
        "manage_ranks": true,
        "manage_treasury": true,
        "manage_diplomacy": true
    }'::jsonb, '{
        "contribution_points": 1000,
        "membership_duration": 30
    }'::jsonb),
    ('officer', '{
        "declare_war": true,
        "accept_members": true,
        "kick_members": true,
        "manage_treasury": true
    }'::jsonb, '{
        "contribution_points": 500,
        "membership_duration": 15
    }'::jsonb),
    ('veteran', '{
        "declare_war": true,
        "manage_treasury": true
    }'::jsonb, '{
        "contribution_points": 200,
        "membership_duration": 7
    }'::jsonb),
    ('member', '{
        "participate_war": true,
        "contribute_resources": true
    }'::jsonb, '{
        "contribution_points": 0,
        "membership_duration": 0
    }'::jsonb);

-- Initialize war types and goals
CREATE TABLE IF NOT EXISTS war_types (
    type_name VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in turns
    victory_conditions JSONB NOT NULL,
    rewards JSONB NOT NULL,
    penalties JSONB NOT NULL
);

INSERT INTO war_types (type_name, description, duration, victory_conditions, rewards, penalties)
VALUES 
    ('territorial', 'War for territory control', 20, '{
        "territory_control": 0.6,
        "war_score": 10
    }'::jsonb, '{
        "territory_gain": 0.3,
        "resource_bonus": 0.2
    }'::jsonb, '{
        "territory_loss": 0.2,
        "resource_penalty": 0.1
    }'::jsonb),
    ('resource', 'War for resource control', 15, '{
        "resource_control": 0.7,
        "war_score": 8
    }'::jsonb, '{
        "resource_gain": 0.4,
        "production_bonus": 0.15
    }'::jsonb, '{
        "resource_loss": 0.3,
        "production_penalty": 0.1
    }'::jsonb),
    ('total', 'Total war for complete domination', 30, '{
        "complete_domination": true,
        "war_score": 15
    }'::jsonb, '{
        "complete_control": true,
        "prestige_bonus": 0.5
    }'::jsonb, '{
        "complete_loss": true,
        "prestige_penalty": 0.3
    }'::jsonb);

-- Create war history view
CREATE OR REPLACE VIEW war_history AS
SELECT 
    w.id,
    w.game_id,
    w.war_type,
    w.started_at,
    w.ended_at,
    w.status,
    w.war_score,
    w.war_goals,
    w.war_results,
    CASE 
        WHEN w.war_type = 'player_war' THEN 
            (SELECT username FROM players WHERE id = w.attacker_id)
        ELSE 
            (SELECT name FROM alliances WHERE id = w.attacker_id)
    END AS attacker_name,
    CASE 
        WHEN w.war_type = 'player_war' THEN 
            (SELECT username FROM players WHERE id = w.defender_id)
        ELSE 
            (SELECT name FROM alliances WHERE id = w.defender_id)
    END AS defender_name,
    (
        SELECT COUNT(*) 
        FROM war_events 
        WHERE war_id = w.id 
        AND event_type = 'battle'
    ) AS total_battles,
    (
        SELECT jsonb_build_object(
            'attacker', SUM(CASE WHEN wp.side = 'attacker' THEN wp.war_contribution ELSE 0 END),
            'defender', SUM(CASE WHEN wp.side = 'defender' THEN wp.war_contribution ELSE 0 END)
        )
        FROM war_participants wp
        WHERE wp.war_id = w.id
    ) AS total_contributions
FROM wars w;

-- Create alliance war readiness view
CREATE OR REPLACE VIEW alliance_war_readiness AS
SELECT 
    a.id AS alliance_id,
    a.name AS alliance_name,
    COUNT(DISTINCT am.player_id) AS total_members,
    COUNT(DISTINCT CASE WHEN ar.rank_type IN ('leader', 'officer') THEN am.player_id END) AS active_commanders,
    SUM(am.contribution_points) AS total_contribution,
    (
        SELECT jsonb_build_object(
            'total_units', SUM(u.count),
            'total_power', SUM(u.count * (us.base_attack + us.base_defense))
        )
        FROM units u
        JOIN unit_stats us ON u.unit_type = us.unit_type
        WHERE u.player_id IN (SELECT player_id FROM alliance_members WHERE alliance_id = a.id)
    ) AS military_strength,
    (
        SELECT jsonb_build_object(
            'gold', SUM(r.amount),
            'food', SUM(r.amount)
        )
        FROM resources r
        WHERE r.player_id IN (SELECT player_id FROM alliance_members WHERE alliance_id = a.id)
        AND r.resource_type IN ('gold', 'food')
    ) AS resource_stockpile
FROM alliances a
JOIN alliance_members am ON a.id = am.alliance_id
JOIN alliance_ranks ar ON am.rank_type = ar.rank_type
GROUP BY a.id, a.name;

-- Create player war readiness view
CREATE OR REPLACE VIEW player_war_readiness AS
SELECT 
    p.id AS player_id,
    p.username,
    p.score,
    (
        SELECT jsonb_build_object(
            'total_units', SUM(u.count),
            'total_power', SUM(u.count * (us.base_attack + us.base_defense))
        )
        FROM units u
        JOIN unit_stats us ON u.unit_type = us.unit_type
        WHERE u.player_id = p.id
    ) AS military_strength,
    (
        SELECT jsonb_build_object(
            'gold', SUM(r.amount),
            'food', SUM(r.amount)
        )
        FROM resources r
        WHERE r.player_id = p.id
        AND r.resource_type IN ('gold', 'food')
    ) AS resource_stockpile,
    (
        SELECT COUNT(*)
        FROM territories t
        WHERE t.player_id = p.id
    ) AS controlled_territories,
    (
        SELECT jsonb_build_object(
            'active', COUNT(*) FILTER (WHERE w.status = 'active'),
            'won', COUNT(*) FILTER (WHERE w.status = 'ended' AND w.war_score > 0),
            'lost', COUNT(*) FILTER (WHERE w.status = 'ended' AND w.war_score < 0)
        )
        FROM wars w
        JOIN war_participants wp ON w.id = wp.war_id
        WHERE wp.participant_id = p.id
    ) AS war_history
FROM players p;

-- Create functions for war synchronization
CREATE OR REPLACE FUNCTION sync_war_participants()
RETURNS TRIGGER AS $$
BEGIN
    -- For player wars
    IF NEW.war_type = 'player_war' THEN
        -- Add attacker
        INSERT INTO war_participants (war_id, participant_id, participant_type, side)
        VALUES (NEW.id, NEW.attacker_id, 'player', 'attacker')
        ON CONFLICT (war_id, participant_id) DO NOTHING;

        -- Add defender
        INSERT INTO war_participants (war_id, participant_id, participant_type, side)
        VALUES (NEW.id, NEW.defender_id, 'player', 'defender')
        ON CONFLICT (war_id, participant_id) DO NOTHING;
    -- For alliance wars
    ELSE
        -- Add alliance members as participants
        INSERT INTO war_participants (war_id, participant_id, participant_type, side)
        SELECT 
            NEW.id,
            am.player_id,
            'player',
            CASE 
                WHEN am.alliance_id = NEW.attacker_id THEN 'attacker'
                ELSE 'defender'
            END
        FROM alliance_members am
        WHERE am.alliance_id IN (NEW.attacker_id, NEW.defender_id)
        ON CONFLICT (war_id, participant_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_war_participants_trigger
    AFTER INSERT ON wars
    FOR EACH ROW
    EXECUTE FUNCTION sync_war_participants();

-- Create function to update war readiness
CREATE OR REPLACE FUNCTION update_war_readiness()
RETURNS TRIGGER AS $$
BEGIN
    -- Update player war readiness
    REFRESH MATERIALIZED VIEW player_war_readiness;

    -- Update alliance war readiness
    REFRESH MATERIALIZED VIEW alliance_war_readiness;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for war readiness updates
CREATE TRIGGER update_war_readiness_trigger
    AFTER INSERT OR UPDATE OR DELETE ON units
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_war_readiness();

CREATE TRIGGER update_war_readiness_resources_trigger
    AFTER INSERT OR UPDATE OR DELETE ON resources
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_war_readiness();

CREATE TRIGGER update_war_readiness_territories_trigger
    AFTER INSERT OR UPDATE OR DELETE ON territories
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_war_readiness(); 