
-- Seller ratings table
CREATE TABLE public.seller_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, listing_id)
);

ALTER TABLE public.seller_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view ratings
CREATE POLICY "Anyone can view ratings" ON public.seller_ratings
  FOR SELECT TO authenticated USING (true);

-- Users can create ratings (not for themselves)
CREATE POLICY "Users can rate sellers" ON public.seller_ratings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reviewer_id AND auth.uid() != seller_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" ON public.seller_ratings
  FOR UPDATE TO authenticated
  USING (auth.uid() = reviewer_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON public.seller_ratings
  FOR DELETE TO authenticated
  USING (auth.uid() = reviewer_id);

-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Index for fast notification lookups
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_seller_ratings_seller ON public.seller_ratings(seller_id);
