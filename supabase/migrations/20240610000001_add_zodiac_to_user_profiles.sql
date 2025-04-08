-- Add zodiac column to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS zodiac VARCHAR;

-- Add zodiac column to kingdoms table
ALTER TABLE kingdoms ADD COLUMN IF NOT EXISTS zodiac VARCHAR;

-- Update the realtime publication to include the new column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'user_profiles'
  ) THEN
    alter publication supabase_realtime add table user_profiles;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'kingdoms'
  ) THEN
    alter publication supabase_realtime add table kingdoms;
  END IF;
END
$$;