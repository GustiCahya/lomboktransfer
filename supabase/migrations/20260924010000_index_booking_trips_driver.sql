-- ============================================================
-- Migration: Add index for booking_trips.driver_id
-- (Kolom driver_id sudah ada sejak migration 20260901000000_add_booking_trips.sql)
-- Pastikan index ada agar join ke drivers cepat
-- ============================================================

-- Index untuk query driver per trip yang lebih cepat
CREATE INDEX IF NOT EXISTS idx_booking_trips_driver_id
  ON public.booking_trips(driver_id);

-- Verifikasi struktur kolom
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'booking_trips'
  AND column_name  = 'driver_id';
