-- Add navigation timestamp fields to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS last_kingdom_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_building_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_resources_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_military_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_alliance_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_combat_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_map_visit TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_profile_visit TIMESTAMP WITH TIME ZONE;

-- Enable realtime for the table
alter publication supabase_realtime add table user_profiles;
