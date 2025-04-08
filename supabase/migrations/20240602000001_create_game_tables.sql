-- Create kingdoms table
CREATE TABLE IF NOT EXISTS kingdoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  race VARCHAR(50) NOT NULL,
  strength INTEGER NOT NULL DEFAULT 50,
  location JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS kingdoms_user_id_idx ON kingdoms(user_id);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kingdom_id UUID NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 1000,
  production_rate INTEGER NOT NULL DEFAULT 10,
  last_updated BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create composite index on kingdom_id and type
CREATE UNIQUE INDEX IF NOT EXISTS resources_kingdom_type_idx ON resources(kingdom_id, type);

-- Create buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kingdom_id UUID NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  construction_status VARCHAR(20) NOT NULL DEFAULT 'idle',
  completion_time BIGINT,
  health INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on kingdom_id for faster lookups
CREATE INDEX IF NOT EXISTS buildings_kingdom_id_idx ON buildings(kingdom_id);
-- Create index on completion_time for scheduled tasks
CREATE INDEX IF NOT EXISTS buildings_completion_time_idx ON buildings(completion_time) WHERE completion_time IS NOT NULL;

-- Create troops table
CREATE TABLE IF NOT EXISTS troops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kingdom_id UUID NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  power INTEGER NOT NULL DEFAULT 1,
  speed INTEGER NOT NULL DEFAULT 1,
  training_status VARCHAR(20) NOT NULL DEFAULT 'idle',
  completion_time BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on kingdom_id for faster lookups
CREATE INDEX IF NOT EXISTS troops_kingdom_id_idx ON troops(kingdom_id);
-- Create index on completion_time for scheduled tasks
CREATE INDEX IF NOT EXISTS troops_completion_time_idx ON troops(completion_time) WHERE completion_time IS NOT NULL;

-- Create attacks table
CREATE TABLE IF NOT EXISTS attacks (
  id VARCHAR(255) PRIMARY KEY,
  source_kingdom_id UUID NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  target_kingdom_id UUID NOT NULL REFERENCES kingdoms(id) ON DELETE CASCADE,
  troops JSONB NOT NULL DEFAULT '{}',
  spies JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  start_time BIGINT NOT NULL,
  completion_time BIGINT NOT NULL,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS attacks_source_kingdom_id_idx ON attacks(source_kingdom_id);
CREATE INDEX IF NOT EXISTS attacks_target_kingdom_id_idx ON attacks(target_kingdom_id);
-- Create index on completion_time for scheduled tasks
CREATE INDEX IF NOT EXISTS attacks_completion_time_idx ON attacks(completion_time);
-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS attacks_status_idx ON attacks(status);

-- Enable realtime for all tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'kingdoms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE kingdoms;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'resources'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE resources;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'buildings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE buildings;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'troops'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE troops;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'attacks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE attacks;
  END IF;
END
$$;