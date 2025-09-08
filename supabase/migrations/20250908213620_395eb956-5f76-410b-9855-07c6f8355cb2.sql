-- Fix security issues by adding proper search_path to functions
CREATE OR REPLACE FUNCTION public.calculate_engagement_score(
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  messages INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0
) RETURNS NUMERIC 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Weighted scoring: favorites and messages are more valuable than views
  RETURN (views * 1.0) + (favorites * 3.0) + (messages * 5.0) + (clicks * 2.0);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_listing_engagement(listing_id_param UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  views_count INTEGER;
  favorites_count INTEGER;
  messages_count INTEGER;
  engagement_score NUMERIC;
BEGIN
  -- Count favorites for this listing
  SELECT COUNT(*) INTO favorites_count
  FROM public.favorites
  WHERE listing_id = listing_id_param;
  
  -- Count messages about this listing (conversations)
  SELECT COUNT(DISTINCT m.id) INTO messages_count
  FROM public.messages m
  JOIN public.conversations c ON m.conversation_id = c.id
  WHERE c.listing_id = listing_id_param;
  
  -- For now, set views to 0 (we can add view tracking later)
  views_count := 0;
  
  -- Calculate engagement score
  engagement_score := calculate_engagement_score(views_count, favorites_count, messages_count, 0);
  
  -- Insert or update engagement record
  INSERT INTO public.listing_engagement (listing_id, views_count, favorites_count, messages_count, engagement_score, last_updated)
  VALUES (listing_id_param, views_count, favorites_count, messages_count, engagement_score, now())
  ON CONFLICT (listing_id) 
  DO UPDATE SET
    views_count = EXCLUDED.views_count,
    favorites_count = EXCLUDED.favorites_count,
    messages_count = EXCLUDED.messages_count,
    engagement_score = EXCLUDED.engagement_score,
    last_updated = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_feature_desirable_listings()
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER := 0;
BEGIN
  -- First, unfeature all currently featured items
  UPDATE public.listings SET featured = false WHERE featured = true;
  
  -- Update engagement metrics for all active listings
  INSERT INTO public.listing_engagement (listing_id, views_count, favorites_count, messages_count, engagement_score, last_updated)
  SELECT 
    l.id,
    0 as views_count,
    COALESCE(f.favorites_count, 0) as favorites_count,
    COALESCE(m.messages_count, 0) as messages_count,
    calculate_engagement_score(0, COALESCE(f.favorites_count, 0), COALESCE(m.messages_count, 0), 0) as engagement_score,
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
  WHERE l.status = 'active'
  ON CONFLICT (listing_id) 
  DO UPDATE SET
    views_count = EXCLUDED.views_count,
    favorites_count = EXCLUDED.favorites_count,
    messages_count = EXCLUDED.messages_count,
    engagement_score = EXCLUDED.engagement_score,
    last_updated = now();
  
  -- Feature top items using a combined score of:
  -- 1. Engagement score (40%)
  -- 2. Recency boost for items < 7 days old (30%)
  -- 3. Price competitiveness within category (20%)
  -- 4. Random factor for diversity (10%)
  WITH desirability_scores AS (
    SELECT 
      l.id,
      l.category,
      -- Engagement component (40%)
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
      -- Top 6 overall by desirability score
      ds.id IN (
        SELECT id FROM desirability_scores 
        ORDER BY desirability_score DESC 
        LIMIT 6
      )
    );
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;