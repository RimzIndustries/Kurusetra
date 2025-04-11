-- Add additional navigation tracking fields to user_registrations table
ALTER TABLE user_registrations
ADD COLUMN IF NOT EXISTS navigation_count_kingdom INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_building INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_resources INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_military INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_alliance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_combat INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_map INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS navigation_count_profile INTEGER DEFAULT 0;

-- Check if the table is already in the publication before adding it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'user_registrations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_registrations;
  END IF;
END
$$;