-- Migration: Create tours table
-- Tabel untuk menyimpan paket wisata yang ditawarkan kepada tamu.

CREATE TABLE IF NOT EXISTS public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  base_price INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Policies: allow full CRUD for all (consistent with other tables in this project)
CREATE POLICY "Allow all read access on tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on tours" ON public.tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on tours" ON public.tours FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on tours" ON public.tours FOR DELETE USING (true);
