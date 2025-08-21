-- Create a function to get distinct teams efficiently
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION get_distinct_teams()
RETURNS TEXT[]
LANGUAGE SQL
STABLE
AS $$
  SELECT ARRAY(
    SELECT DISTINCT team 
    FROM games 
    WHERE team IS NOT NULL 
    ORDER BY team
  );
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION get_distinct_teams() TO anon;
GRANT EXECUTE ON FUNCTION get_distinct_teams() TO authenticated;
