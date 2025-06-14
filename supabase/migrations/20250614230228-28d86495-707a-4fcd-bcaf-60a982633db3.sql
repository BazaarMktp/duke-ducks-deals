
-- 1. Create colleges table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.colleges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    domain text NOT NULL UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Seed colleges table with initial data for Duke and a default for the app admins
INSERT INTO public.colleges (name, domain) VALUES ('Duke University', 'duke.edu') ON CONFLICT (domain) DO NOTHING;
INSERT INTO public.colleges (name, domain) VALUES ('The Bazaar App', 'thebazaarapp.com') ON CONFLICT (domain) DO NOTHING;

-- 3. Add college_id to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_id uuid REFERENCES public.colleges(id);

-- 4. Backfill college_id for existing users
UPDATE public.profiles
SET college_id = (SELECT id FROM public.colleges WHERE domain = 'duke.edu')
WHERE email LIKE '%@duke.edu' AND college_id IS NULL;

UPDATE public.profiles
SET college_id = (SELECT id FROM public.colleges WHERE domain = 'thebazaarapp.com')
WHERE email LIKE '%@thebazaarapp.com' AND college_id IS NULL;

-- Backfill any remaining profiles with Duke as a default college
UPDATE public.profiles
SET college_id = (SELECT id FROM public.colleges WHERE domain = 'duke.edu')
WHERE college_id IS NULL;

-- 5. Make college_id on profiles table required
ALTER TABLE public.profiles ALTER COLUMN college_id SET NOT NULL;

-- 6. Add college_id to listings table if it doesn't exist
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS college_id uuid REFERENCES public.colleges(id);

-- 7. Backfill college_id for existing listings
UPDATE public.listings
SET college_id = (
  SELECT p.college_id
  FROM public.profiles p
  WHERE p.id = public.listings.user_id
) WHERE college_id IS NULL;

-- 8. Make college_id on listings table required
ALTER TABLE public.listings ALTER COLUMN college_id SET NOT NULL;

-- 9. Update the user creation function to handle multi-college logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  college_id_val uuid;
  user_email_domain text;
BEGIN
  -- Extract domain from email
  user_email_domain := substring(NEW.email from '@(.*)$');

  -- Find college_id for the domain. Special handling for admin email.
  IF NEW.email = 'info@thebazaarapp.com' THEN
    SELECT id INTO college_id_val FROM public.colleges WHERE domain = 'thebazaarapp.com';
  ELSE
    SELECT id INTO college_id_val FROM public.colleges WHERE domain = user_email_domain;
  END IF;
  
  IF college_id_val IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, profile_name, email, is_verified, college_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'profile_name', ''),
      NEW.email,
      TRUE,
      college_id_val
    ) ON CONFLICT (id) DO NOTHING;
    
    IF NEW.email = 'info@thebazaarapp.com' THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
    ELSE
      INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Re-create the trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Create a helper function to get the current user's college_id for security policies
CREATE OR REPLACE FUNCTION public.get_current_user_college_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  SELECT college_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 11. Add/Update RLS for colleges table
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can view colleges" ON public.colleges;
CREATE POLICY "All users can view colleges" ON public.colleges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage colleges" ON public.colleges;
CREATE POLICY "Admins can manage colleges" ON public.colleges FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 12. Add/Update RLS for listings table
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view listings from their own college" ON public.listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;
CREATE POLICY "Users can view listings from their own college" ON public.listings FOR SELECT USING (college_id = public.get_current_user_college_id());
CREATE POLICY "Users can insert their own listings" ON public.listings FOR INSERT WITH CHECK (user_id = auth.uid() AND college_id = public.get_current_user_college_id());
CREATE POLICY "Users can update their own listings" ON public.listings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own listings" ON public.listings FOR DELETE USING (user_id = auth.uid());

-- 13. Add/Update RLS for conversations table
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" ON public.conversations FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- 14. Add/Update RLS for favorites table
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- 15. Add/Update RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view profiles from their own college" ON public.profiles;
CREATE POLICY "Users can view profiles from their own college" ON public.profiles FOR SELECT USING (college_id = public.get_current_user_college_id() OR auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
