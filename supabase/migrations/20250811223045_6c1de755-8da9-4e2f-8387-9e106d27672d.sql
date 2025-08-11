-- Remove overly permissive public profile access
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;

-- Ensure existing policies remain (no-op if already present)
-- Keeping admin and self-access intact for usability and support workflows
