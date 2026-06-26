-- Migration: Add company-assets storage bucket for logo & branding files

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
DROP POLICY IF EXISTS "Public read for company-assets" ON storage.objects;
CREATE POLICY "Public read for company-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'company-assets');

-- Admin write access
DROP POLICY IF EXISTS "Admin write for company-assets" ON storage.objects;
CREATE POLICY "Admin write for company-assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND public.get_user_role() IN ('owner', 'admin'));

-- Admin update access
DROP POLICY IF EXISTS "Admin update for company-assets" ON storage.objects;
CREATE POLICY "Admin update for company-assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'company-assets' AND public.get_user_role() IN ('owner', 'admin'));

-- Admin delete access
DROP POLICY IF EXISTS "Admin delete for company-assets" ON storage.objects;
CREATE POLICY "Admin delete for company-assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'company-assets' AND public.get_user_role() IN ('owner', 'admin'));
