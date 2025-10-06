-- Create business_profiles table for business-specific information
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name text NOT NULL,
  business_description text,
  business_website text,
  business_email text,
  business_phone text,
  business_logo_url text,
  business_address text,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on business_profiles
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Business users can view their own profile
CREATE POLICY "Business users can view their own profile"
ON public.business_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Business users can update their own profile
CREATE POLICY "Business users can update their own profile"
ON public.business_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Business users can insert their own profile
CREATE POLICY "Business users can insert their own profile"
ON public.business_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all business profiles
CREATE POLICY "Admins can view all business profiles"
ON public.business_profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all business profiles
CREATE POLICY "Admins can update all business profiles"
ON public.business_profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create business_ads table for promotional materials
CREATE TABLE IF NOT EXISTS public.business_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.business_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  ad_type text DEFAULT 'banner',
  image_url text,
  video_url text,
  link_url text,
  display_priority integer DEFAULT 0,
  is_active boolean DEFAULT false,
  approval_status text DEFAULT 'pending',
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone,
  starts_at timestamp with time zone DEFAULT now(),
  ends_at timestamp with time zone,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on business_ads
ALTER TABLE public.business_ads ENABLE ROW LEVEL SECURITY;

-- Business users can view their own ads
CREATE POLICY "Business users can view their own ads"
ON public.business_ads
FOR SELECT
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id = auth.uid()));

-- Business users can create their own ads
CREATE POLICY "Business users can create their own ads"
ON public.business_ads
FOR INSERT
WITH CHECK (business_id IN (SELECT id FROM public.business_profiles WHERE user_id = auth.uid()));

-- Business users can update their own ads
CREATE POLICY "Business users can update their own ads"
ON public.business_ads
FOR UPDATE
USING (business_id IN (SELECT id FROM public.business_profiles WHERE user_id = auth.uid()));

-- Admins can manage all ads
CREATE POLICY "Admins can manage all business ads"
ON public.business_ads
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view approved and active ads
CREATE POLICY "Anyone can view approved active ads"
ON public.business_ads
FOR SELECT
USING (approval_status = 'approved' AND is_active = true AND (ends_at IS NULL OR ends_at > now()));

-- Business users can create deals
CREATE POLICY "Business users can create deals"
ON public.deals
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'business'::app_role) AND auth.uid() = created_by);

-- Business users can view their own deals
CREATE POLICY "Business users can view their own deals"
ON public.deals
FOR SELECT
USING (has_role(auth.uid(), 'business'::app_role) AND auth.uid() = created_by);

-- Business users can update their own deals
CREATE POLICY "Business users can update their own deals"
ON public.deals
FOR UPDATE
USING (has_role(auth.uid(), 'business'::app_role) AND auth.uid() = created_by);

-- Add trigger for business_profiles updated_at
CREATE TRIGGER update_business_profiles_updated_at
BEFORE UPDATE ON public.business_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for business_ads updated_at
CREATE TRIGGER update_business_ads_updated_at
BEFORE UPDATE ON public.business_ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();