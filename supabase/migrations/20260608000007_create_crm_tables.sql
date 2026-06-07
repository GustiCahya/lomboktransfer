-- Migrasi untuk Modul CRM & Tamu (Step 14)

-- 1. Guest Tags (Menyimpan jenis segmentasi tamu)
CREATE TABLE IF NOT EXISTS public.guest_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  tag_name VARCHAR(50) NOT NULL CHECK (tag_name IN ('VIP', 'Regular', 'One-time', 'Repeat', 'Blacklist')),
  assigned_by UUID, -- References auth.users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(guest_id, tag_name)
);

-- 2. Guest Notes (Catatan manual per tamu)
CREATE TABLE IF NOT EXISTS public.guest_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID, -- References auth.users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Reviews (Sistem manajemen review & sentimen)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('Internal', 'Google', 'Klook', 'Viator', 'TripAdvisor', 'Other')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  reply_content TEXT,
  status VARCHAR(50) DEFAULT 'unreplied' CHECK (status IN ('unreplied', 'replied')),
  replied_by UUID, -- References auth.users
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.guest_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all read access on guest_tags" ON public.guest_tags FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on guest_tags" ON public.guest_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all delete access on guest_tags" ON public.guest_tags FOR DELETE USING (true);

CREATE POLICY "Allow all read access on guest_notes" ON public.guest_notes FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on guest_notes" ON public.guest_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on guest_notes" ON public.guest_notes FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on guest_notes" ON public.guest_notes FOR DELETE USING (true);

CREATE POLICY "Allow all read access on reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on reviews" ON public.reviews FOR DELETE USING (true);
