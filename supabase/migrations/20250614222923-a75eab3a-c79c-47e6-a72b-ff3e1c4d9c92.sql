
-- Create a table to store listing reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_reporter FOREIGN KEY (reporter_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security for the reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to create new reports
CREATE POLICY "Users can create reports"
ON public.reports
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow admins to view all reports
CREATE POLICY "Admins can view all reports"
ON public.reports
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update the status of reports
CREATE POLICY "Admins can update reports"
ON public.reports
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete reports
CREATE POLICY "Admins can delete reports"
ON public.reports
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
