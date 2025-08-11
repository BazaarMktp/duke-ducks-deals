-- Tighten profiles access without breaking UX
-- 1) Drop overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 2) Recreate scoped policies for clarity
DROP POLICY IF EXISTS "Users can view profiles from their own college" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles from their college"
ON public.profiles
FOR SELECT
TO authenticated
USING ((college_id = public.get_current_user_college_id()) OR (id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- 3) Allow admins to view all profiles explicitly (redundant with above OR but explicit and future-proof)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4) Allow anonymous users to read minimal (non-sensitive) profile info via RLS, but control columns via privileges
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- 5) Column-level privacy: prevent anon from selecting sensitive columns
REVOKE SELECT (email, phone_number, full_name) ON public.profiles FROM anon;
-- Ensure authenticated users can select those columns (RLS limits rows to same college)
GRANT SELECT (email, phone_number, full_name) ON public.profiles TO authenticated;

-- Note: other columns remain readable by anon for basic UI (profile_name, avatar_url, created_at)
