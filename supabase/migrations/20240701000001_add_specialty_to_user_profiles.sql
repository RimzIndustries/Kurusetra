-- Add specialty column to user_profiles table
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Enable realtime for this table
alter publication supabase_realtime add table user_profiles;