-- Migration: Add Missing Policies for Routes Table
-- Jika RLS aktif tapi tidak ada policy UPDATE, data tidak akan tersimpan secara diam-diam.

-- 1. Berikan akses BACA (SELECT) untuk anonim (publik) agar bisa tampil di halaman depan
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Allow public read access on routes'
  ) THEN
    CREATE POLICY "Allow public read access on routes" ON public.routes FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Berikan akses BACA (SELECT) untuk semua authenticated
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Allow auth read access on routes'
  ) THEN
    CREATE POLICY "Allow auth read access on routes" ON public.routes FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- 3. Berikan akses TAMBAH (INSERT) untuk admin/authenticated
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Allow auth insert access on routes'
  ) THEN
    CREATE POLICY "Allow auth insert access on routes" ON public.routes FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- 4. Berikan akses UBAH (UPDATE) untuk admin/authenticated
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Allow auth update access on routes'
  ) THEN
    CREATE POLICY "Allow auth update access on routes" ON public.routes FOR UPDATE TO authenticated USING (true);
  END IF;
END $$;

-- 5. Berikan akses HAPUS (DELETE) untuk admin/authenticated
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'routes' AND policyname = 'Allow auth delete access on routes'
  ) THEN
    CREATE POLICY "Allow auth delete access on routes" ON public.routes FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
