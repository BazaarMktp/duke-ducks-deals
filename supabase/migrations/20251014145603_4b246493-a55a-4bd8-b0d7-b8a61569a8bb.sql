-- Update auto_feature_desirable_listings to feature only 3 listings with more randomization
CREATE OR REPLACE FUNCTION public.auto_feature_desirable_listings()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  updated_count INTEGER := 0;
BEGIN
  -- First, unfeature all currently featured items
  UPDATE public.listings SET featured = false WHERE featured = true;
  
  -- Update engagement metrics for all active listings including clicks
  INSERT INTO public.listing_engagement (listing_id, views_count, favorites_count, messages_count, clicks_count, engagement_score, last_updated)
  SELECT 
    l.id,
    0 as views_count,
    COALESCE(f.favorites_count, 0) as favorites_count,
    COALESCE(m.messages_count, 0) as messages_count,
    COALESCE(existing_le.clicks_count, 0) as clicks_count,
    calculate_engagement_score(0, COALESCE(f.favorites_count, 0), COALESCE(m.messages_count, 0), COALESCE(existing_le.clicks_count, 0)) as engagement_score,
    now()
  FROM public.listings l
  LEFT JOIN (
    SELECT listing_id, COUNT(*) as favorites_count
    FROM public.favorites
    GROUP BY listing_id
  ) f ON l.id = f.listing_id
  LEFT JOIN (
    SELECT c.listing_id, COUNT(DISTINCT m.id) as messages_count
    FROM public.conversations c
    JOIN public.messages m ON c.id = m.conversation_id
    GROUP BY c.listing_id
  ) m ON l.id = m.listing_id
  LEFT JOIN public.listing_engagement existing_le ON l.id = existing_le.listing_id
  WHERE l.status = 'active'
  ON CONFLICT (listing_id) 
  DO UPDATE SET
    views_count = EXCLUDED.views_count,
    favorites_count = EXCLUDED.favorites_count,
    messages_count = EXCLUDED.messages_count,
    clicks_count = GREATEST(listing_engagement.clicks_count, EXCLUDED.clicks_count),
    engagement_score = EXCLUDED.engagement_score,
    last_updated = now();
  
  -- Feature top 3 items using enhanced scoring with increased randomization:
  -- 1. Engagement score (favorites*3 + messages*5 + clicks*2) (30%)
  -- 2. Recency boost for items < 7 days old (25%)
  -- 3. Price competitiveness within category (15%)
  -- 4. Random factor for diversity (30% - increased for more rotation)
  WITH desirability_scores AS (
    SELECT 
      l.id,
      l.category,
      -- Enhanced engagement component (30%)
      (COALESCE(le.engagement_score, 0) * 0.3) +
      -- Recency boost (25%)
      (CASE 
        WHEN l.created_at > (now() - INTERVAL '7 days') 
        THEN 25 * (1 - EXTRACT(days FROM (now() - l.created_at)) / 7.0)
        ELSE 0 
      END * 0.25) +
      -- Price competitiveness (15%)
      (CASE 
        WHEN l.price IS NOT NULL AND l.price > 0 THEN
          GREATEST(0, 15 - (l.price / 50.0)) * 0.15
        ELSE 10 * 0.15
      END) +
      -- Random factor for diversity (30% - increased for better rotation)
      (random() * 30 * 0.3) as desirability_score
    FROM public.listings l
    LEFT JOIN public.listing_engagement le ON l.id = le.listing_id
    WHERE l.status = 'active' 
      AND l.listing_type = 'offer'
      AND l.created_at > (now() - INTERVAL '60 days') -- Consider listings from last 60 days
  )
  UPDATE public.listings 
  SET featured = true
  FROM desirability_scores ds
  WHERE listings.id = ds.id
    AND ds.id IN (
      SELECT id FROM desirability_scores 
      ORDER BY desirability_score DESC 
      LIMIT 3  -- Only feature top 3 listings
    );
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$function$;

-- Create a wrapper function that runs every 2 weeks
CREATE OR REPLACE FUNCTION public.auto_feature_biweekly()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  week_number INTEGER;
BEGIN
  -- Calculate week number of the year
  week_number := EXTRACT(week FROM CURRENT_DATE)::INTEGER;
  
  -- Only run on even week numbers (every 2 weeks)
  IF week_number % 2 = 0 THEN
    PERFORM public.auto_feature_desirable_listings();
  END IF;
END;
$function$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the wrapper function to run every Monday at 3 AM
SELECT cron.schedule(
  'auto-feature-listings-biweekly',
  '0 3 * * 1',
  'SELECT public.auto_feature_biweekly();'
);