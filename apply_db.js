const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `
-- Create company settings table for SSOT
CREATE TABLE IF NOT EXISTS public.company_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'PT Lombok Transfer Pariwisata',
  brand_name text NOT NULL DEFAULT 'Lombok Transfer',
  npwp text,
  nib text,
  email text NOT NULL DEFAULT 'info@lomboktransfer.com',
  phone_wa text NOT NULL DEFAULT '+62 812-3456-7890',
  address text,
  logo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access on company_settings" ON public.company_settings;
CREATE POLICY "Allow public read access on company_settings" ON public.company_settings FOR SELECT USING (true);

-- Allow authenticated users to update
DROP POLICY IF EXISTS "Allow authenticated users to update company_settings" ON public.company_settings;
CREATE POLICY "Allow authenticated users to update company_settings" ON public.company_settings FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to insert company_settings" ON public.company_settings;
CREATE POLICY "Allow authenticated users to insert company_settings" ON public.company_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert initial dummy data
INSERT INTO public.company_settings (id, company_name, brand_name, npwp, nib, email, phone_wa, address, logo_url)
VALUES (
  1,
  'PT Lombok Transfer Pariwisata',
  'Lombok Transfer',
  '12.345.678.9-000.000',
  '1234567890123',
  'info@lomboktransfer.com',
  '+62 812-3456-7890',
  'Jl. Pariwisata No. 123, Senggigi, Batu Layar, Kabupaten Lombok Barat, Nusa Tenggara Barat 83355',
  '/logo.png'
)
ON CONFLICT (id) DO NOTHING;
  `;
  
  // To execute raw SQL, we can try using RPC if one exists, but supabase-js doesn't support raw SQL natively unless there is a function.
  // Wait, if it's postgres, maybe I can use `pg` module instead to connect directly since I don't have the DB password. 
  // Actually, I can use supabase cli.
}

run();
