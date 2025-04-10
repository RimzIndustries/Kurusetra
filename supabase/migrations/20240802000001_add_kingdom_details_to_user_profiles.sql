-- Add kingdom details columns to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kingdom_description TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kingdom_motto TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS kingdom_capital TEXT;