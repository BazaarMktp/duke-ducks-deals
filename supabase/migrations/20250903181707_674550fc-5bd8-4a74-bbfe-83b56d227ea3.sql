-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.validate_donation_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow if the user_id matches the authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied: Cannot create donation for another user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;