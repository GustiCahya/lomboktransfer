-- ============================================================
-- company_settings Migration Script
-- 
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/injscuwpllomtdaixkuo/sql/new
-- ============================================================

-- Step 1: Create table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Lombok Transfer Pariwisata',
  brand_name text NOT NULL DEFAULT 'Lombok Transfer',
  npwp text,
  nib text,
  email text NOT NULL DEFAULT 'info@lomboktransfer.com',
  phone_wa text NOT NULL DEFAULT '+62 81-7777-480',
  address text,
  logo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Step 3: Public read policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies
    WHERE tablename = 'company_settings'
      AND policyname = 'Allow public read access on company_settings'
  ) THEN
    CREATE POLICY "Allow public read access on company_settings"
      ON public.company_settings FOR SELECT USING (true);
  END IF;
END $$;

-- Step 4: Authenticated update policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies
    WHERE tablename = 'company_settings'
      AND policyname = 'Allow authenticated users to update company_settings'
  ) THEN
    CREATE POLICY "Allow authenticated users to update company_settings"
      ON public.company_settings FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Step 5: Authenticated insert policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies
    WHERE tablename = 'company_settings'
      AND policyname = 'Allow authenticated users to insert company_settings'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert company_settings"
      ON public.company_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Step 6: Seed / upsert initial company data
INSERT INTO public.company_settings (id, company_name, brand_name, npwp, nib, email, phone_wa, address, logo_url)
VALUES (
  1,
  'Lombok Transfer Pariwisata',
  'Lombok Transfer',
  NULL,
  NULL,
  'info@lomboktransfer.com',
  '+62 81-7777-480',
  'Jl. Langko 70, Mataram, Lombok, NTB, Indonesia',
  '/logo_without_text.png'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone_wa     = EXCLUDED.phone_wa,
  address      = EXCLUDED.address,
  email        = EXCLUDED.email,
  logo_url     = EXCLUDED.logo_url,
  updated_at   = now();

-- Done!
SELECT * FROM public.company_settings;
