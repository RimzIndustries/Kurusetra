-- Create a table to store user registration data
CREATE TABLE IF NOT EXISTS user_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  registration_ip TEXT,
  registration_source TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_registrations table
DROP POLICY IF EXISTS "Users can view their own registration data" ON user_registrations;
CREATE POLICY "Users can view their own registration data"
ON user_registrations FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only authenticated users can insert their own registration data" ON user_registrations;
CREATE POLICY "Only authenticated users can insert their own registration data"
ON user_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own registration data" ON user_registrations;
CREATE POLICY "Users can update their own registration data"
ON user_registrations FOR UPDATE
USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table user_registrations;