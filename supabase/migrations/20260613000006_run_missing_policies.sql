-- ============================================================
-- Fix Missing RLS Policies for Operational Tables
-- (Routes, Guests, Reviews, etc.)
--
-- Paste this entire script into Supabase SQL Editor and run it.
-- https://supabase.com/dashboard/project/injscuwpllomtdaixkuo/sql/new
-- ============================================================

-- 1. Policies for ROUTES
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow public read access on routes') THEN
    CREATE POLICY "Allow public read access on routes" ON public.routes FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow admin full access on routes') THEN
    CREATE POLICY "Allow admin full access on routes" ON public.routes FOR ALL USING (
      public.get_user_role() IN ('owner', 'admin', 'dispatcher')
    );
  END IF;
END $$;

-- 2. Policies for GUESTS
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow admin full access on guests') THEN
    CREATE POLICY "Allow admin full access on guests" ON public.guests FOR ALL USING (
      public.get_user_role() IN ('owner', 'admin', 'dispatcher', 'driver')
    );
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow public insert on guests') THEN
    CREATE POLICY "Allow public insert on guests" ON public.guests FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 3. Additional Policies for BOOKINGS (Public Insert)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow public insert on bookings') THEN
    CREATE POLICY "Allow public insert on bookings" ON public.bookings FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 4. Policies for REVIEWS
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow public read access on reviews') THEN
    CREATE POLICY "Allow public read access on reviews" ON public.reviews FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow public insert on reviews') THEN
    CREATE POLICY "Allow public insert on reviews" ON public.reviews FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Allow admin full access on reviews') THEN
    CREATE POLICY "Allow admin full access on reviews" ON public.reviews FOR ALL USING (
      public.get_user_role() IN ('owner', 'admin', 'dispatcher')
    );
  END IF;
END $$;

-- Verify policies were added
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('routes', 'guests', 'bookings', 'reviews');
