-- Add navigation history columns to user_registrations table
ALTER TABLE user_registrations
ADD COLUMN IF NOT EXISTS last_kingdom_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_building_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_resources_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_military_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_alliance_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_combat_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_map_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_profile_visit TIMESTAMP WITH TIME ZONE;

-- Update RLS policies to allow authenticated users to update their own navigation data
DROP POLICY IF EXISTS "Users can update their own navigation data" ON user_registrations;
CREATE POLICY "Users can update their own navigation data"
ON user_registrations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Check if table is already in the publication before adding
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'user_registrations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_registrations;
  END IF;
END
$$;