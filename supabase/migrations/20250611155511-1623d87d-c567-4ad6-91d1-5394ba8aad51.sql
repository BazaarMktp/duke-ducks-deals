
-- Fix the search path security issue for get_platform_stats function
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_listings', (SELECT COUNT(*) FROM public.listings),
    'active_listings', (SELECT COUNT(*) FROM public.listings WHERE status = 'active'),
    'total_conversations', (SELECT COUNT(*) FROM public.conversations),
    'total_messages', (SELECT COUNT(*) FROM public.messages),
    'banned_users', (SELECT COUNT(*) FROM public.banned_users WHERE is_active = true),
    'open_support_tickets', (SELECT COUNT(*) FROM public.support_tickets WHERE status = 'open')
  );
$$;
