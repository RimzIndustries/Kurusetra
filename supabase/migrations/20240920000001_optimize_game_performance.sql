-- Optimize database performance for game operations
BEGIN;

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kingdoms_user_id ON kingdoms(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_kingdom_id ON resources(kingdom_id);
CREATE INDEX IF NOT EXISTS idx_buildings_kingdom_id ON buildings(kingdom_id);
CREATE INDEX IF NOT EXISTS idx_troops_kingdom_id ON troops(kingdom_id);
CREATE INDEX IF NOT EXISTS idx_attacks_source_kingdom_id ON attacks(source_kingdom_id);
CREATE INDEX IF NOT EXISTS idx_attacks_target_kingdom_id ON attacks(target_kingdom_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_sender_id ON user_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_user_messages_receiver_id ON user_messages(receiver_id);

-- Add specialty field to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS specialty VARCHAR;

-- Add kingdom_description, kingdom_motto, and kingdom_capital to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kingdom_description TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kingdom_motto VARCHAR;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kingdom_capital VARCHAR;

-- Add setup_completed field to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables if they don't already have it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_profiles_updated_at') THEN
        CREATE TRIGGER set_user_profiles_updated_at
        BEFORE UPDATE ON user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_kingdoms_updated_at') THEN
        CREATE TRIGGER set_kingdoms_updated_at
        BEFORE UPDATE ON kingdoms
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_resources_updated_at') THEN
        CREATE TRIGGER set_resources_updated_at
        BEFORE UPDATE ON resources
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_buildings_updated_at') THEN
        CREATE TRIGGER set_buildings_updated_at
        BEFORE UPDATE ON buildings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_troops_updated_at') THEN
        CREATE TRIGGER set_troops_updated_at
        BEFORE UPDATE ON troops
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_user_presence_updated_at') THEN
        CREATE TRIGGER set_user_presence_updated_at
        BEFORE UPDATE ON user_presence
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- Ensure all tables are in the realtime publication
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'user_profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'kingdoms'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE kingdoms;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'resources'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE resources;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'buildings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE buildings;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'troops'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE troops;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'attacks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE attacks;
    END IF;
END
$$;

COMMIT;
