-- Add new columns to user_profiles table for additional kingdom details
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS kingdom_description TEXT,
ADD COLUMN IF NOT EXISTS kingdom_motto TEXT,
ADD COLUMN IF NOT EXISTS kingdom_capital TEXT;

-- Enable realtime for the updated table
alter publication supabase_realtime add table user_profiles;