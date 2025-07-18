
-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add AI-related columns to listings table
ALTER TABLE public.listings 
ADD COLUMN embedding vector(1536),
ADD COLUMN ai_features jsonb,
ADD COLUMN similarity_score numeric DEFAULT 0;

-- Create index for vector similarity search
CREATE INDEX ON public.listings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for AI features JSON queries
CREATE INDEX ON public.listings USING gin (ai_features);

-- Create table for storing recommendation history and analytics
CREATE TABLE public.listing_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid REFERENCES public.listings(id) NOT NULL,
  recommended_listing_id uuid REFERENCES public.listings(id) NOT NULL,
  similarity_score numeric NOT NULL,
  recommendation_reason jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  clicked boolean DEFAULT false,
  clicked_at timestamp with time zone
);

-- Add RLS policies for recommendations table
ALTER TABLE public.listing_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recommendations for their listings" 
  ON public.listing_recommendations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE listings.id = listing_recommendations.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert recommendations" 
  ON public.listing_recommendations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update click tracking" 
  ON public.listing_recommendations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE listings.id = listing_recommendations.listing_id 
      AND listings.user_id = auth.uid()
    )
  );
