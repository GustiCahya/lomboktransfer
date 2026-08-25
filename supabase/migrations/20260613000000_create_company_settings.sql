-- Create company settings table for SSOT
CREATE TABLE IF NOT EXISTS public.company_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Lombok Transfer Pariwisata',
  brand_name text NOT NULL DEFAULT 'Lombok Transfer',
  npwp text,
  nib text,
  email text NOT NULL DEFAULT 'hello@lomboktransfer.com',
  phone_wa text NOT NULL DEFAULT '+62 819-0739-7667',
  address text,
  logo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on company_settings" ON public.company_settings FOR SELECT USING (true);

-- Allow authenticated users to update (you might want to restrict to admin role if applicable)
CREATE POLICY "Allow authenticated users to update company_settings" ON public.company_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert company_settings" ON public.company_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert initial dummy data
INSERT INTO public.company_settings (id, company_name, brand_name, npwp, nib, email, phone_wa, address, logo_url)
VALUES (
  1,
  'Lombok Transfer Pariwisata',
  'Lombok Transfer',
  '12.345.678.9-000.000',
  '1234567890123',
  'hello@lomboktransfer.com',
  '+62 819-0739-7667',
  'Jl. Langko 70, Mataram, Lombok, NTB, Indonesia',
  '/logo.svg'
)
ON CONFLICT (id) DO NOTHING;
