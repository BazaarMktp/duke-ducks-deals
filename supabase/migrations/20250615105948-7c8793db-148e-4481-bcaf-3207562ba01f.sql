
-- Add image_url column to colleges table
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS image_url text;

-- Add some sample college data with images
UPDATE public.colleges 
SET image_url = '/lovable-uploads/ab5a5857-7332-4da1-b76a-f8de90b92080.png'
WHERE domain = 'duke.edu';

UPDATE public.colleges 
SET image_url = '/lovable-uploads/eb622135-668a-413b-9581-b468c675cad1.png'
WHERE domain = 'thebazaarapp.com';

-- Add more colleges for demonstration
INSERT INTO public.colleges (name, domain, image_url) VALUES 
('University of North Carolina', 'unc.edu', '/lovable-uploads/ab5a5857-7332-4da1-b76a-f8de90b92080.png'),
('North Carolina State University', 'ncsu.edu', '/lovable-uploads/eb622135-668a-413b-9581-b468c675cad1.png'),
('Wake Forest University', 'wfu.edu', '/lovable-uploads/ab5a5857-7332-4da1-b76a-f8de90b92080.png')
ON CONFLICT (domain) DO NOTHING;
