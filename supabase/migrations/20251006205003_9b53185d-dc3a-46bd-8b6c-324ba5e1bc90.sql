-- Update business_ads RLS policies to require admin approval before ads go live

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view approved active ads" ON public.business_ads;
DROP POLICY IF EXISTS "Business users can view their own ads" ON public.business_ads;

-- Create new policy: Anyone can view approved, active ads
CREATE POLICY "Anyone can view approved active ads"
ON public.business_ads
FOR SELECT
USING (
  approval_status = 'approved' 
  AND is_active = true 
  AND (ends_at IS NULL OR ends_at > now())
);

-- Create policy: Business users and unauthenticated users can view their own ads
CREATE POLICY "Users can view their own ads"
ON public.business_ads
FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.business_profiles 
    WHERE user_id = auth.uid()
  )
  OR auth.uid() IS NULL  -- Allow unauthenticated users to view ads they're creating
);

-- Update policy: Allow unauthenticated users to create ads (pending approval)
DROP POLICY IF EXISTS "Business users can create their own ads" ON public.business_ads;

CREATE POLICY "Anyone can create ads for approval"
ON public.business_ads
FOR INSERT
WITH CHECK (true);  -- Anyone can submit, but ads start as pending

-- Add trigger to ensure new ads start as pending and inactive
CREATE OR REPLACE FUNCTION public.set_new_business_ad_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Force new ads to be pending approval and inactive
  NEW.approval_status := 'pending';
  NEW.is_active := false;
  NEW.approved_at := NULL;
  NEW.approved_by := NULL;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_business_ad_pending
BEFORE INSERT ON public.business_ads
FOR EACH ROW
EXECUTE FUNCTION public.set_new_business_ad_defaults();