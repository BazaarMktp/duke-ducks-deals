
-- Update the college logos for the North Carolina universities
UPDATE public.colleges 
SET image_url = '/lovable-uploads/4c027a93-1e79-4a3b-888c-15a6dcdce10b.png'
WHERE domain = 'unc.edu';

UPDATE public.colleges 
SET image_url = '/lovable-uploads/e80c0e4b-6d91-49b5-b39a-beaac2ba0b90.png'
WHERE domain = 'ncsu.edu';

UPDATE public.colleges 
SET image_url = '/lovable-uploads/42b969bb-b2bb-4b95-9cb3-07b632bc69b9.png'
WHERE domain = 'wfu.edu';
