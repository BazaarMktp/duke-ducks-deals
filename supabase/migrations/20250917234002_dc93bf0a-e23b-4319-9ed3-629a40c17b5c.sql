-- Campus Life Optimizer Tables
CREATE TABLE public.campus_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_type text NOT NULL,
  location text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  source_url text,
  tags text[] DEFAULT '{}',
  relevance_score float DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

CREATE TABLE public.scraped_sources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  source_type text NOT NULL, -- 'rss', 'web', 'email', 'calendar'
  last_scraped timestamp with time zone,
  is_active boolean DEFAULT true,
  scrape_frequency interval DEFAULT '1 hour',
  selector_config jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_interests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  interest_type text NOT NULL, -- 'food', 'academic', 'social', 'deadline', 'career'
  interest_value text NOT NULL,
  priority integer DEFAULT 5, -- 1-10 scale
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_event_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  interaction_type text NOT NULL, -- 'view', 'click', 'favorite', 'dismiss'
  created_at timestamp with time zone DEFAULT now()
);

-- Enhanced User Profiles for Roommate Matching
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lifestyle_preferences jsonb DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS housing_preferences jsonb DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS compatibility_score_cache jsonb DEFAULT '{}';

-- Roommate matching tables
CREATE TABLE public.roommate_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  budget_min integer,
  budget_max integer,
  cleanliness_level integer DEFAULT 5, -- 1-10 scale
  noise_tolerance integer DEFAULT 5,
  sleep_schedule text, -- 'early_bird', 'night_owl', 'flexible'
  social_level integer DEFAULT 5, -- 1-10 introvert to extrovert
  study_habits text, -- 'quiet', 'collaborative', 'flexible'
  pet_friendly boolean DEFAULT false,
  smoking_ok boolean DEFAULT false,
  guests_ok boolean DEFAULT true,
  preferred_location text,
  move_in_date date,
  lease_length text, -- 'semester', 'year', 'summer', 'flexible'
  additional_preferences text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.roommate_matches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id uuid NOT NULL,
  user2_id uuid NOT NULL,
  compatibility_score float NOT NULL,
  match_explanation jsonb DEFAULT '{}',
  status text DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days')
);

-- Enable RLS on all new tables
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraped_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_event_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Campus Events
CREATE POLICY "Anyone can view active campus events" ON public.campus_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage campus events" ON public.campus_events
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for Scraped Sources
CREATE POLICY "Admins can manage scraped sources" ON public.scraped_sources
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for User Interests
CREATE POLICY "Users can manage their own interests" ON public.user_interests
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for User Event Interactions
CREATE POLICY "Users can create their own interactions" ON public.user_event_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interactions" ON public.user_event_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for Roommate Preferences
CREATE POLICY "Users can manage their own roommate preferences" ON public.roommate_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Others can view roommate preferences for matching" ON public.roommate_preferences
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for Roommate Matches
CREATE POLICY "Users can view their own matches" ON public.roommate_matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update match status" ON public.roommate_matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_campus_events_updated_at
  BEFORE UPDATE ON public.campus_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roommate_preferences_updated_at
  BEFORE UPDATE ON public.roommate_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_campus_events_type_time ON public.campus_events(event_type, start_time);
CREATE INDEX idx_campus_events_tags ON public.campus_events USING GIN(tags);
CREATE INDEX idx_user_interests_user_type ON public.user_interests(user_id, interest_type);
CREATE INDEX idx_roommate_preferences_user ON public.roommate_preferences(user_id);
CREATE INDEX idx_roommate_matches_users ON public.roommate_matches(user1_id, user2_id);
CREATE INDEX idx_roommate_matches_score ON public.roommate_matches(compatibility_score DESC);