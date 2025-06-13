
-- Check if donations table exists and has the required columns
-- If status column doesn't exist or needs updating, add it
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'status') THEN
        ALTER TABLE public.donations ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    
    -- Add pickup_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'pickup_date') THEN
        ALTER TABLE public.donations ADD COLUMN pickup_date DATE;
    END IF;
    
    -- Ensure we have all required columns for donation management
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'full_name') THEN
        ALTER TABLE public.donations ADD COLUMN full_name TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'email') THEN
        ALTER TABLE public.donations ADD COLUMN email TEXT NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'phone_number') THEN
        ALTER TABLE public.donations ADD COLUMN phone_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'address') THEN
        ALTER TABLE public.donations ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'donations' AND column_name = 'item_description') THEN
        ALTER TABLE public.donations ADD COLUMN item_description TEXT;
    END IF;
END $$;

-- Enable RLS on donations table if not already enabled
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donations table
DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;

-- Policy for viewing donations (public for now, can be restricted later)
CREATE POLICY "Anyone can view donations" 
ON public.donations 
FOR SELECT 
USING (true);

-- Policy for inserting donations
CREATE POLICY "Authenticated users can insert donations" 
ON public.donations 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy for updating donations (admins only)
CREATE POLICY "Admins can update donations" 
ON public.donations 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
