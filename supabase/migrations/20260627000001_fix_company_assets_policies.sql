-- Fix for company-assets bucket policies

-- Admin write access
DROP POLICY IF EXISTS "Admin write for company-assets" ON storage.objects;
CREATE POLICY "Admin write for company-assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));

-- Admin update access
DROP POLICY IF EXISTS "Admin update for company-assets" ON storage.objects;
CREATE POLICY "Admin update for company-assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'company-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));

-- Admin delete access
DROP POLICY IF EXISTS "Admin delete for company-assets" ON storage.objects;
CREATE POLICY "Admin delete for company-assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'company-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));
