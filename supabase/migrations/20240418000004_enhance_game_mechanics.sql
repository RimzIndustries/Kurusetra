-- Enhance game settings
ALTER TABLE games
    ADD COLUMN game_mode VARCHAR(50) NOT NULL DEFAULT 'standard',
    ADD COLUMN difficulty_level VARCHAR(50) NOT NULL DEFAULT 'normal',
    ADD COLUMN map_type VARCHAR(50) NOT NULL DEFAULT 'continents',
    ADD COLUMN resource_abundance VARCHAR(50) NOT NULL DEFAULT 'normal',
    ADD COLUMN starting_era VARCHAR(50) NOT NULL DEFAULT 'ancient',
    ADD COLUMN technology_tree JSONB DEFAULT '{
        "ancient": ["basic_farming", "basic_mining", "basic_construction"],
        "classical": ["advanced_farming", "metal_working", "masonry"],
        "medieval": ["crop_rotation", "steel_working", "architecture"],
        "renaissance": ["scientific_method", "gunpowder", "naval_warfare"],
        "industrial": ["steam_power", "railways", "mass_production"]
    }'::jsonb,
    ADD COLUMN weather_system JSONB DEFAULT '{
        "seasons": true,
        "disasters": true,
        "effects": {
            "drought": {"resource_penalty": 0.5, "duration": 3},
            "flood": {"building_damage": 0.3, "duration": 2},
            "storm": {"unit_damage": 0.2, "duration": 1}
        }
    }'::jsonb;

-- Enhance player starting conditions
ALTER TABLE players
    ADD COLUMN civilization_type VARCHAR(50) NOT NULL DEFAULT 'generic',
    ADD COLUMN starting_technologies JSONB DEFAULT '["basic_farming", "basic_mining"]'::jsonb,
    ADD COLUMN starting_population_growth_rate FLOAT NOT NULL DEFAULT 1.0,
    ADD COLUMN starting_happiness INTEGER NOT NULL DEFAULT 100,
    ADD COLUMN starting_culture INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN starting_faith INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN starting_great_people_points JSONB DEFAULT '{
        "scientist": 0,
        "engineer": 0,
        "merchant": 0,
        "artist": 0,
        "general": 0
    }'::jsonb;

-- Enhance building system
CREATE TABLE IF NOT EXISTS building_specializations (
    building_type building_type PRIMARY KEY,
    specialization_type VARCHAR(50) NOT NULL,
    specialization_effects JSONB NOT NULL,
    required_population INTEGER NOT NULL DEFAULT 1,
    maintenance_cost JSONB NOT NULL,
    happiness_effect INTEGER NOT NULL DEFAULT 0,
    culture_effect INTEGER NOT NULL DEFAULT 0,
    faith_effect INTEGER NOT NULL DEFAULT 0,
    great_people_points JSONB NOT NULL
);

-- Enhance unit system
CREATE TABLE IF NOT EXISTS unit_promotions (
    promotion_type VARCHAR(50) PRIMARY KEY,
    required_experience INTEGER NOT NULL,
    effects JSONB NOT NULL,
    prerequisites JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS unit_experience (
    unit_id UUID PRIMARY KEY REFERENCES units(id),
    experience_points INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    promotions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhance research system
CREATE TABLE IF NOT EXISTS technology_prerequisites (
    technology VARCHAR(50) PRIMARY KEY,
    required_technologies JSONB NOT NULL,
    era VARCHAR(50) NOT NULL,
    research_cost INTEGER NOT NULL,
    effects JSONB NOT NULL,
    unlocks JSONB NOT NULL
);

-- Enhance territory system
CREATE TABLE IF NOT EXISTS territory_features (
    territory_id UUID PRIMARY KEY REFERENCES territories(id),
    terrain_type VARCHAR(50) NOT NULL,
    elevation INTEGER NOT NULL DEFAULT 0,
    vegetation VARCHAR(50),
    water_source BOOLEAN DEFAULT false,
    strategic_resources JSONB DEFAULT '{}'::jsonb,
    luxury_resources JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enhance action system
CREATE TABLE IF NOT EXISTS action_requirements (
    action_type VARCHAR(50) PRIMARY KEY,
    required_resources JSONB NOT NULL,
    required_technologies JSONB DEFAULT '[]'::jsonb,
    required_buildings JSONB DEFAULT '[]'::jsonb,
    required_units JSONB DEFAULT '[]'::jsonb,
    cooldown INTEGER NOT NULL DEFAULT 0, -- in turns
    effects JSONB NOT NULL
);

-- Add indexes
CREATE INDEX idx_territory_features_territory_id ON territory_features(territory_id);
CREATE INDEX idx_unit_experience_unit_id ON unit_experience(unit_id);

-- Enable RLS
ALTER TABLE building_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_requirements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Building specializations are viewable by everyone" ON building_specializations
    FOR SELECT USING (true);

CREATE POLICY "Unit promotions are viewable by everyone" ON unit_promotions
    FOR SELECT USING (true);

CREATE POLICY "Unit experience is viewable by game participants" ON unit_experience
    FOR SELECT USING (
        unit_id IN (SELECT id FROM units WHERE player_id IN (
            SELECT id FROM players WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Technology prerequisites are viewable by everyone" ON technology_prerequisites
    FOR SELECT USING (true);

CREATE POLICY "Territory features are viewable by game participants" ON territory_features
    FOR SELECT USING (
        territory_id IN (SELECT id FROM territories WHERE game_id IN (
            SELECT game_id FROM players WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "Action requirements are viewable by everyone" ON action_requirements
    FOR SELECT USING (true);

-- Create functions for enhanced mechanics
CREATE OR REPLACE FUNCTION calculate_population_growth()
RETURNS TRIGGER AS $$
DECLARE
    food_surplus INTEGER;
    happiness_modifier FLOAT;
BEGIN
    -- Calculate food surplus
    SELECT amount INTO food_surplus
    FROM resources
    WHERE player_id = NEW.player_id AND resource_type = 'food';

    -- Calculate happiness modifier
    SELECT 
        CASE 
            WHEN happiness >= 80 THEN 1.2
            WHEN happiness >= 60 THEN 1.1
            WHEN happiness >= 40 THEN 1.0
            WHEN happiness >= 20 THEN 0.9
            ELSE 0.8
        END INTO happiness_modifier
    FROM players
    WHERE id = NEW.player_id;

    -- Update population
    IF food_surplus > 0 THEN
        UPDATE resources
        SET amount = amount + (food_surplus * happiness_modifier * NEW.starting_population_growth_rate / 100)
        WHERE player_id = NEW.player_id AND resource_type = 'population';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_population_growth_trigger
    AFTER UPDATE ON resources
    FOR EACH ROW
    WHEN (NEW.resource_type = 'food')
    EXECUTE FUNCTION calculate_population_growth();

-- Function to process weather effects
CREATE OR REPLACE FUNCTION process_weather_effects(game_id UUID)
RETURNS VOID AS $$
DECLARE
    weather_event JSONB;
    player RECORD;
BEGIN
    -- Get random weather event based on season
    SELECT jsonb_build_object(
        'type', CASE 
            WHEN EXTRACT(MONTH FROM CURRENT_TIMESTAMP) IN (12,1,2) THEN 'storm'
            WHEN EXTRACT(MONTH FROM CURRENT_TIMESTAMP) IN (6,7,8) THEN 'drought'
            ELSE 'flood'
        END,
        'intensity', random() * 0.5 + 0.5
    ) INTO weather_event;

    -- Apply effects to each player
    FOR player IN SELECT * FROM players WHERE game_id = game_id AND status = 'active' LOOP
        CASE weather_event->>'type'
            WHEN 'drought' THEN
                -- Reduce resource production
                UPDATE resources
                SET amount = amount * (1 - (weather_event->>'intensity')::float)
                WHERE player_id = player.id
                AND resource_type IN ('food', 'gold');
            WHEN 'flood' THEN
                -- Damage buildings
                UPDATE buildings
                SET health = health * (1 - (weather_event->>'intensity')::float)
                WHERE player_id = player.id;
            WHEN 'storm' THEN
                -- Damage units
                UPDATE units
                SET health = health * (1 - (weather_event->>'intensity')::float)
                WHERE player_id = player.id;
        END CASE;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to process great people
CREATE OR REPLACE FUNCTION process_great_people(player_id UUID)
RETURNS VOID AS $$
DECLARE
    points RECORD;
    threshold INTEGER := 100;
BEGIN
    -- Get great people points
    SELECT * INTO points
    FROM players
    WHERE id = player_id;

    -- Check each type of great person
    FOR key, value IN SELECT * FROM jsonb_each_text(points.starting_great_people_points) LOOP
        IF value::integer >= threshold THEN
            -- Spawn great person
            INSERT INTO units (player_id, unit_type, count, position_x, position_y)
            VALUES (
                player_id,
                'great_' || key,
                1,
                (SELECT position_x FROM players WHERE id = player_id),
                (SELECT position_y FROM players WHERE id = player_id)
            );

            -- Reset points
            UPDATE players
            SET starting_great_people_points = jsonb_set(
                starting_great_people_points,
                ARRAY[key],
                '0'::jsonb
            )
            WHERE id = player_id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to process technology research
CREATE OR REPLACE FUNCTION process_technology_research()
RETURNS TRIGGER AS $$
DECLARE
    tech RECORD;
    effects JSONB;
BEGIN
    -- Get technology details
    SELECT * INTO tech
    FROM technology_prerequisites
    WHERE technology = NEW.research_type;

    -- Apply technology effects
    effects := tech.effects;
    FOR key, value IN SELECT * FROM jsonb_each_text(effects) LOOP
        CASE key
            WHEN 'resource_production' THEN
                -- Update resource production rates
                UPDATE building_requirements
                SET production_rates = jsonb_set(
                    production_rates,
                    ARRAY[value->>'resource'],
                    to_jsonb((production_rates->value->>'resource')::float * (1 + (value->>'multiplier')::float))
                )
                WHERE building_type = value->>'building';
            WHEN 'unit_stats' THEN
                -- Update unit stats
                UPDATE unit_stats
                SET 
                    base_attack = base_attack * (1 + (value->>'attack_bonus')::float),
                    base_defense = base_defense * (1 + (value->>'defense_bonus')::float)
                WHERE unit_type = value->>'unit';
            WHEN 'building_effects' THEN
                -- Update building effects
                UPDATE building_specializations
                SET specialization_effects = jsonb_set(
                    specialization_effects,
                    ARRAY[value->>'effect'],
                    to_jsonb((specialization_effects->value->>'effect')::float * (1 + (value->>'multiplier')::float))
                )
                WHERE building_type = value->>'building';
        END CASE;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER process_technology_research_trigger
    AFTER UPDATE ON researches
    FOR EACH ROW
    WHEN (NEW.progress = 100 AND OLD.progress < 100)
    EXECUTE FUNCTION process_technology_research(); 