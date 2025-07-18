
-- Add content moderation and AI features columns to listings table
ALTER TABLE public.listings 
ADD COLUMN moderation_status text DEFAULT 'pending',
ADD COLUMN moderation_flags jsonb DEFAULT '[]'::jsonb,
ADD COLUMN ai_suggested_category text,
ADD COLUMN ai_generated_description text,
ADD COLUMN ai_confidence_score numeric DEFAULT 0;

-- Add AI analytics table for tracking suggestions and user interactions
CREATE TABLE public.ai_interactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  listing_id uuid REFERENCES public.listings(id),
  interaction_type text NOT NULL, -- 'description_generated', 'category_suggested', 'content_moderated'
  ai_suggestion jsonb,
  user_action text, -- 'accepted', 'rejected', 'modified'
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add RLS policies for AI interactions table
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI interactions" 
  ON public.ai_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI interactions" 
  ON public.ai_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add user preferences table for AI features
CREATE TABLE public.user_ai_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  auto_moderate boolean DEFAULT true,
  auto_categorize boolean DEFAULT true,
  auto_generate_descriptions boolean DEFAULT true,
  enhanced_search boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_ai_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI preferences" 
  ON public.user_ai_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);
