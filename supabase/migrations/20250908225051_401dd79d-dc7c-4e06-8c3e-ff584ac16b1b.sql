-- Fix the calculate_engagement_score function with correct parameter types
CREATE OR REPLACE FUNCTION public.calculate_engagement_score(
  p_views INTEGER DEFAULT 0,
  p_favorites BIGINT DEFAULT 0,
  p_messages BIGINT DEFAULT 0,
  p_clicks INTEGER DEFAULT 0
)
RETURNS NUMERIC
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Weighted scoring: views(1) + favorites(3) + messages(5) + clicks(1)
  RETURN (COALESCE(p_views, 0) * 1.0) + 
         (COALESCE(p_favorites, 0) * 3.0) + 
         (COALESCE(p_messages, 0) * 5.0) + 
         (COALESCE(p_clicks, 0) * 1.0);
END;
$$;