-- Fix the RLS policy for the attacks table

-- Drop the incorrect policy if it exists
DROP POLICY IF EXISTS "Users can only access attacks they're involved in" ON attacks;

-- Create the corrected policy with the right column names
CREATE POLICY "Users can only access attacks they're involved in"
ON attacks
FOR ALL
USING (
  source_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid())
  OR
  target_kingdom_id IN (SELECT id FROM kingdoms WHERE user_id = auth.uid())
);