-- ============================================================
-- Fix Missing Tables: company_settings + notifications
-- Paste this entire script into Supabase SQL Editor and run it.
-- https://supabase.com/dashboard/project/injscuwpllomtdaixkuo/sql/new
-- ============================================================


-- ============================================================
-- 1. TABLE: public.company_settings
-- ============================================================
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

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

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

INSERT INTO public.company_settings (id, company_name, brand_name, npwp, nib, email, phone_wa, address, logo_url)
VALUES (
  1,
  'Lombok Transfer Pariwisata',
  'Lombok Transfer',
  NULL,
  NULL,
  'hello@lomboktransfer.com',
  '+62 819-0739-7667',
  'Jl. Langko 70, Mataram, Lombok, NTB, Indonesia',
  '/logo.svg'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone_wa     = EXCLUDED.phone_wa,
  address      = EXCLUDED.address,
  email        = EXCLUDED.email,
  logo_url     = EXCLUDED.logo_url,
  updated_at   = now();


-- ============================================================
-- 2. TABLE: public.notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies
    WHERE tablename = 'notifications'
      AND policyname = 'Allow authenticated read on notifications'
  ) THEN
    CREATE POLICY "Allow authenticated read on notifications"
      ON public.notifications FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies
    WHERE tablename = 'notifications'
      AND policyname = 'Allow authenticated update on notifications'
  ) THEN
    CREATE POLICY "Allow authenticated update on notifications"
      ON public.notifications FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Enable realtime for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================
-- Verify both tables exist
-- ============================================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('company_settings', 'notifications');
