-- Migration: Create Storage Buckets and Policies

-- Note: This requires the "storage" schema to be available, which is standard in Supabase

INSERT INTO storage.buckets (id, name, public) VALUES 
  ('driver-documents', 'driver-documents', false),
  ('vehicle-documents', 'vehicle-documents', false),
  ('vehicle-photos', 'vehicle-photos', true),
  ('company-documents', 'company-documents', false),
  ('receipts', 'receipts', false),
  ('contracts', 'contracts', false),
  ('driver-photos', 'driver-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up basic access policies
-- Note: Replace with more granular RLS depending on your requirements

-- 1. driver-documents (Private)
CREATE POLICY "Admin full access to driver-documents" ON storage.objects
  FOR ALL USING (bucket_id = 'driver-documents' AND public.get_user_role() IN ('owner', 'admin'));

-- 2. vehicle-documents (Private)
CREATE POLICY "Admin full access to vehicle-documents" ON storage.objects
  FOR ALL USING (bucket_id = 'vehicle-documents' AND public.get_user_role() IN ('owner', 'admin'));

-- 3. vehicle-photos (Public Read)
CREATE POLICY "Public read for vehicle-photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-photos');
CREATE POLICY "Admin write for vehicle-photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehicle-photos' AND public.get_user_role() IN ('owner', 'admin'));

-- 4. driver-photos (Public Read)
CREATE POLICY "Public read for driver-photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'driver-photos');
CREATE POLICY "Driver write own photo" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'driver-photos' AND (auth.uid() = owner OR public.get_user_role() IN ('owner', 'admin')));
