-- Fix specialty column in user_profiles table if it doesn't exist

DO $$
BEGIN
    -- Check if specialty column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_profiles' AND column_name = 'specialty') THEN
        -- Add specialty column if it doesn't exist
        ALTER TABLE public.user_profiles ADD COLUMN specialty TEXT;
    END IF;

    -- Ensure the column has the correct type
    ALTER TABLE public.user_profiles ALTER COLUMN specialty TYPE TEXT;
    
    -- Add comment to the column
    COMMENT ON COLUMN public.user_profiles.specialty IS 'User''s chosen specialty or focus area in the game';
END;
$$;
