-- Update the auto_feature_desirable_listings function to properly include clicks in engagement scoring

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
    0 as views_count, -- We can add view tracking later
    COALESCE(f.favorites_count, 0) as favorites_count,
    COALESCE(m.messages_count, 0) as messages_count,
    COALESCE(existing_le.clicks_count, 0) as clicks_count, -- Preserve existing click data
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
    clicks_count = GREATEST(listing_engagement.clicks_count, EXCLUDED.clicks_count), -- Keep the higher value
    engagement_score = EXCLUDED.engagement_score,
    last_updated = now();
  
  -- Feature top items using enhanced scoring that includes clicks:
  -- 1. Engagement score (favorites*3 + messages*5 + clicks*2) (40%)
  -- 2. Recency boost for items < 7 days old (30%)
  -- 3. Price competitiveness within category (20%)
  -- 4. Random factor for diversity (10%)
  WITH desirability_scores AS (
    SELECT 
      l.id,
      l.category,
      -- Enhanced engagement component (40%) - now includes actual clicks
      (COALESCE(le.engagement_score, 0) * 0.4) +
      -- Recency boost (30%) - boost items created in last 7 days
      (CASE 
        WHEN l.created_at > (now() - INTERVAL '7 days') 
        THEN 30 * (1 - EXTRACT(days FROM (now() - l.created_at)) / 7.0)
        ELSE 0 
      END * 0.3) +
      -- Price competitiveness (20%) - favor reasonably priced items
      (CASE 
        WHEN l.price IS NOT NULL AND l.price > 0 THEN
          GREATEST(0, 20 - (l.price / 50.0)) * 0.2
        ELSE 10 * 0.2
      END) +
      -- Random factor for diversity (10%)
      (random() * 10 * 0.1) as desirability_score,
      le.clicks_count,
      le.favorites_count,
      le.messages_count,
      ROW_NUMBER() OVER (PARTITION BY l.category ORDER BY 
        (COALESCE(le.engagement_score, 0) * 0.4) +
        (CASE 
          WHEN l.created_at > (now() - INTERVAL '7 days') 
          THEN 30 * (1 - EXTRACT(days FROM (now() - l.created_at)) / 7.0)
          ELSE 0 
        END * 0.3) +
        (CASE 
          WHEN l.price IS NOT NULL AND l.price > 0 THEN
            GREATEST(0, 20 - (l.price / 50.0)) * 0.2
          ELSE 10 * 0.2
        END) +
        (random() * 10 * 0.1) DESC
      ) as category_rank
    FROM public.listings l
    LEFT JOIN public.listing_engagement le ON l.id = le.listing_id
    WHERE l.status = 'active' 
      AND l.listing_type = 'offer'
      AND l.created_at > (now() - INTERVAL '30 days') -- Only consider recent listings
  )
  UPDATE public.listings 
  SET featured = true
  FROM desirability_scores ds
  WHERE listings.id = ds.id
    AND (
      -- Top 2 from each major category
      (ds.category IN ('marketplace', 'housing', 'services') AND ds.category_rank <= 2)
      OR 
      -- Top 6 overall by desirability score (heavily influenced by clicks now)
      ds.id IN (
        SELECT id FROM desirability_scores 
        ORDER BY desirability_score DESC 
        LIMIT 6
      )
    );
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$function$;