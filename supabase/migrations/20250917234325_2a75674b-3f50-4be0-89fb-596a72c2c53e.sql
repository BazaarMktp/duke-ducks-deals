-- Drop triggers first, then recreate function with proper security definer
DROP TRIGGER IF EXISTS update_campus_events_updated_at ON public.campus_events;
DROP TRIGGER IF EXISTS update_roommate_preferences_updated_at ON public.roommate_preferences;

-- Now we can safely recreate the function
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the triggers
CREATE TRIGGER update_campus_events_updated_at
  BEFORE UPDATE ON public.campus_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roommate_preferences_updated_at
  BEFORE UPDATE ON public.roommate_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();