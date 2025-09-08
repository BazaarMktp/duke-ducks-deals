-- Add unique constraint to listing_engagement table for listing_id
ALTER TABLE public.listing_engagement 
ADD CONSTRAINT listing_engagement_listing_id_unique UNIQUE (listing_id);