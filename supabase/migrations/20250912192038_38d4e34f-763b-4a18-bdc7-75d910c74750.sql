-- Create enhanced gamification tables

-- User levels and XP system
CREATE TABLE public.user_levels (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level integer NOT NULL DEFAULT 1,
  current_xp integer NOT NULL DEFAULT 0,
  total_xp integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;

-- Policies for user_levels
CREATE POLICY "Users can view their own level" 
ON public.user_levels FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own level" 
ON public.user_levels FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own level" 
ON public.user_levels FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Others can view levels for leaderboards" 
ON public.user_levels FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Achievements system (expanded from badges)
CREATE TYPE public.achievement_category AS ENUM ('social', 'trading', 'community', 'milestone', 'special');
CREATE TYPE public.achievement_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');

CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category achievement_category NOT NULL,
  rarity achievement_rarity NOT NULL DEFAULT 'common',
  xp_reward integer NOT NULL DEFAULT 0,
  points_reward integer NOT NULL DEFAULT 0,
  icon_name text,
  requirements jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User achievements (junction table)
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  progress jsonb DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for achievements
CREATE POLICY "Anyone can view achievements" 
ON public.achievements FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Others can view achievements for profiles" 
ON public.user_achievements FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Challenges system
CREATE TYPE public.challenge_type AS ENUM ('daily', 'weekly', 'monthly', 'special');
CREATE TYPE public.challenge_status AS ENUM ('active', 'completed', 'expired');

CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  challenge_type challenge_type NOT NULL,
  requirements jsonb NOT NULL DEFAULT '{}',
  xp_reward integer NOT NULL DEFAULT 0,
  points_reward integer NOT NULL DEFAULT 0,
  starts_at timestamp with time zone NOT NULL DEFAULT now(),
  ends_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User challenge progress
CREATE TABLE public.user_challenge_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  progress jsonb NOT NULL DEFAULT '{}',
  status challenge_status NOT NULL DEFAULT 'active',
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Policies for challenges
CREATE POLICY "Anyone can view active challenges" 
ON public.challenges FOR SELECT 
USING (is_active = true AND (ends_at IS NULL OR ends_at > now()));

CREATE POLICY "Users can view their own challenge progress" 
ON public.user_challenge_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge progress" 
ON public.user_challenge_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- Email preferences
CREATE TYPE public.email_frequency AS ENUM ('instant', 'daily', 'weekly', 'never');

CREATE TABLE public.email_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_notifications boolean NOT NULL DEFAULT true,
  deal_notifications boolean NOT NULL DEFAULT true,
  achievement_notifications boolean NOT NULL DEFAULT true,
  weekly_digest boolean NOT NULL DEFAULT true,
  marketing_emails boolean NOT NULL DEFAULT false,
  frequency email_frequency NOT NULL DEFAULT 'instant',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for email preferences
CREATE POLICY "Users can manage their own email preferences" 
ON public.email_preferences FOR ALL 
USING (auth.uid() = user_id);

-- Enhanced engagement tracking
CREATE TABLE public.user_engagement_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  xp_earned integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_engagement_events ENABLE ROW LEVEL SECURITY;

-- Policies for engagement events
CREATE POLICY "Users can insert their own engagement events" 
ON public.user_engagement_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all engagement events" 
ON public.user_engagement_events FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Leaderboard tracking
CREATE TABLE public.leaderboard_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leaderboard_type text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  rank integer,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, leaderboard_type, period_start)
);

-- Enable RLS
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Policies for leaderboard
CREATE POLICY "Anyone can view leaderboard entries" 
ON public.leaderboard_entries FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Insert initial achievements
INSERT INTO public.achievements (name, description, category, rarity, xp_reward, points_reward, icon_name, requirements) VALUES
('First Steps', 'Complete your profile', 'milestone', 'common', 50, 10, 'user-check', '{"profile_completion": 100}'),
('Marketplace Maven', 'List your first item', 'trading', 'common', 25, 5, 'store', '{"listings_created": 1}'),
('Deal Hunter', 'Add your first item to favorites', 'social', 'common', 15, 3, 'heart', '{"items_favorited": 1}'),
('Chatterbox', 'Send your first message', 'social', 'common', 20, 4, 'message-circle', '{"messages_sent": 1}'),
('Sales Star', 'Complete your first sale', 'trading', 'uncommon', 100, 20, 'dollar-sign', '{"sales_completed": 1}'),
('Community Champion', 'Help 5 people find what they need', 'community', 'rare', 200, 50, 'helping-hand', '{"requests_fulfilled": 5}'),
('Power Seller', 'Complete 10 successful transactions', 'trading', 'rare', 300, 75, 'award', '{"transactions_completed": 10}'),
('Campus Celebrity', 'Reach 1000 total XP', 'milestone', 'epic', 500, 100, 'star', '{"total_xp": 1000}'),
('Eco Hero', 'Give away 10 items for free', 'community', 'epic', 400, 80, 'recycle', '{"free_items_given": 10}'),
('Legend', 'Reach level 20', 'milestone', 'legendary', 1000, 200, 'crown', '{"level": 20}');

-- Insert initial challenges
INSERT INTO public.challenges (title, description, challenge_type, requirements, xp_reward, points_reward, ends_at) VALUES
('Daily Engagement', 'Check your messages and browse 5 listings', 'daily', '{"messages_checked": 1, "listings_viewed": 5}', 25, 5, now() + interval '1 day'),
('Weekly Seller', 'List 3 new items this week', 'weekly', '{"listings_created": 3}', 100, 20, now() + interval '7 days'),
('Monthly Networker', 'Start conversations with 10 different users', 'monthly', '{"unique_conversations": 10}', 300, 60, now() + interval '30 days');

-- Functions for XP and level management
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  -- Each level requires 100 * level XP (so level 2 needs 200 total XP, level 3 needs 300, etc.)
  SELECT GREATEST(1, FLOOR(xp / 100) + 1)::integer;
$$;

CREATE OR REPLACE FUNCTION public.add_user_xp(user_id_param uuid, xp_amount integer, points_amount integer DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_total_xp integer;
  new_total_xp integer;
  old_level integer;
  new_level integer;
BEGIN
  -- Get or create user level record
  INSERT INTO public.user_levels (user_id, current_xp, total_xp)
  VALUES (user_id_param, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current totals
  SELECT total_xp INTO current_total_xp 
  FROM public.user_levels 
  WHERE user_id = user_id_param;
  
  new_total_xp := current_total_xp + xp_amount;
  old_level := calculate_level_from_xp(current_total_xp);
  new_level := calculate_level_from_xp(new_total_xp);
  
  -- Update user levels
  UPDATE public.user_levels 
  SET 
    current_xp = current_xp + xp_amount,
    total_xp = new_total_xp,
    current_level = new_level,
    updated_at = now()
  WHERE user_id = user_id_param;
  
  -- Update profile points if points_amount > 0
  IF points_amount > 0 THEN
    UPDATE public.profiles 
    SET points = points + points_amount
    WHERE id = user_id_param;
  END IF;
  
  -- Log engagement event
  INSERT INTO public.user_engagement_events (user_id, event_type, event_data, xp_earned, points_earned)
  VALUES (user_id_param, 'xp_earned', jsonb_build_object('amount', xp_amount, 'old_level', old_level, 'new_level', new_level), xp_amount, points_amount);
  
  -- Check for level up achievement
  IF new_level > old_level THEN
    -- Award level milestone achievements
    INSERT INTO public.user_achievements (user_id, achievement_id)
    SELECT user_id_param, id
    FROM public.achievements
    WHERE requirements->>'level' IS NOT NULL 
    AND (requirements->>'level')::integer <= new_level
    AND id NOT IN (
      SELECT achievement_id 
      FROM public.user_achievements 
      WHERE user_id = user_id_param
    );
  END IF;
END;
$$;

-- Trigger for automatic level updates
CREATE OR REPLACE FUNCTION public.update_user_levels_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_levels_updated_at
BEFORE UPDATE ON public.user_levels
FOR EACH ROW
EXECUTE FUNCTION public.update_user_levels_timestamp();

CREATE TRIGGER update_email_preferences_updated_at
BEFORE UPDATE ON public.email_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_user_levels_timestamp();

CREATE TRIGGER update_user_challenge_progress_updated_at
BEFORE UPDATE ON public.user_challenge_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_user_levels_timestamp();