
-- Offers table for price negotiations
CREATE TABLE public.listing_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'countered', 'expired')),
  counter_amount numeric CHECK (counter_amount > 0 OR counter_amount IS NULL),
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '48 hours')
);

ALTER TABLE public.listing_offers ENABLE ROW LEVEL SECURITY;

-- Buyers and sellers can view their own offers
CREATE POLICY "Users can view their offers" ON public.listing_offers
  FOR SELECT TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Buyers can create offers
CREATE POLICY "Buyers can create offers" ON public.listing_offers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id AND auth.uid() != seller_id);

-- Sellers can update offers (accept/decline/counter), buyers can update (cancel)
CREATE POLICY "Participants can update offers" ON public.listing_offers
  FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Saved searches table
CREATE TABLE public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  search_query text,
  category text,
  min_price numeric,
  max_price numeric,
  listing_type text DEFAULT 'offer',
  notify_enabled boolean NOT NULL DEFAULT true,
  last_notified_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved searches" ON public.saved_searches
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_listing_offers_listing ON public.listing_offers(listing_id);
CREATE INDEX idx_listing_offers_buyer ON public.listing_offers(buyer_id);
CREATE INDEX idx_listing_offers_seller ON public.listing_offers(seller_id);
CREATE INDEX idx_saved_searches_user ON public.saved_searches(user_id);
