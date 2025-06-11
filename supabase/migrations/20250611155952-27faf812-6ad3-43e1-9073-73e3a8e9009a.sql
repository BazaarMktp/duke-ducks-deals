
-- Update the handle_new_user function to use the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile for users with duke.edu email OR info@thebazaarapp.com
  IF NEW.email LIKE '%@duke.edu' OR NEW.email = 'info@thebazaarapp.com' THEN
    INSERT INTO public.profiles (id, full_name, profile_name, email, is_verified)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'profile_name', ''),
      NEW.email,
      TRUE
    );
    
    -- If it's the admin email, assign admin role
    IF NEW.email = 'info@thebazaarapp.com' THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'admin');
    ELSE
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, 'user');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
