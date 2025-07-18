-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION find_similar_listings_by_embedding(
  query_embedding vector(1536),
  listing_id_to_exclude uuid,
  similarity_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price numeric,
  category listing_category,
  images text[],
  user_id uuid,
  created_at timestamptz,
  ai_features jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    l.id,
    l.title,
    l.description,
    l.price,
    l.category,
    l.images,
    l.user_id,
    l.created_at,
    l.ai_features,
    1 - (l.embedding <=> query_embedding) as similarity
  FROM listings l
  WHERE 
    l.status = 'active'
    AND l.embedding IS NOT NULL
    AND l.id != listing_id_to_exclude
    AND 1 - (l.embedding <=> query_embedding) > similarity_threshold
  ORDER BY l.embedding <=> query_embedding
  LIMIT match_count;
$$;