-- Add admin permissions for listing management
-- Admins should be able to view all listings regardless of college
CREATE POLICY "Admins can view all listings" 
ON public.listings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins should be able to update any listing (for status changes, etc.)
CREATE POLICY "Admins can update any listing" 
ON public.listings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins should be able to delete any listing
CREATE POLICY "Admins can delete any listing" 
ON public.listings 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));