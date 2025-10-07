-- Add item_tag column to store AI-validated item tags for accurate filtering
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS item_tag text;

-- Create index for faster tag-based filtering
CREATE INDEX IF NOT EXISTS idx_listings_item_tag ON public.listings(item_tag);

-- Create function to auto-categorize new listings
CREATE OR REPLACE FUNCTION public.trigger_categorize_listing()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only trigger for marketplace items with images
  IF NEW.category = 'marketplace' AND NEW.images IS NOT NULL AND array_length(NEW.images, 1) > 0 THEN
    -- Call the edge function asynchronously via pg_net (if available)
    -- For now, we'll set item_tag to null and let the frontend trigger categorization
    NEW.item_tag := NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new listings
DROP TRIGGER IF EXISTS on_listing_created_categorize ON public.listings;
CREATE TRIGGER on_listing_created_categorize
  BEFORE INSERT ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_categorize_listing();