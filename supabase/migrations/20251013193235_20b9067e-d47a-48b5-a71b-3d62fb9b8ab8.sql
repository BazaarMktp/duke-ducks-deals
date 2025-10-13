-- Create storage policies for the listing-images bucket
-- Allow public access for uploads and reads

-- Allow anyone to upload to listing-images bucket
CREATE POLICY "Public upload access for listing-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'listing-images');

-- Allow anyone to read from listing-images bucket  
CREATE POLICY "Public read access for listing-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listing-images');

-- Allow anyone to update files in listing-images bucket
CREATE POLICY "Public update access for listing-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'listing-images')
WITH CHECK (bucket_id = 'listing-images');

-- Allow anyone to delete from listing-images bucket
CREATE POLICY "Public delete access for listing-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'listing-images');