-- ============================================================
-- Migration: Add booking_trips table + receipt columns to bookings
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/injscuwpllomtdaixkuo/sql/new
-- ============================================================

-- 1. Add new columns to bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS receipt_number       text UNIQUE,
  ADD COLUMN IF NOT EXISTS deposit_amount        numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_paid_at       date,
  ADD COLUMN IF NOT EXISTS deposit_method        text,  -- wise | bank_transfer | cash | ota
  ADD COLUMN IF NOT EXISTS balance_due           numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_passengers      int DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_luggage         int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS receipt_status        text DEFAULT 'pending',
  -- receipt_status: pending | deposit_received | fully_paid | cancelled
  ADD COLUMN IF NOT EXISTS inclusions            text[],
  ADD COLUMN IF NOT EXISTS terms_notes           text;

-- 2. Create booking_trips table
CREATE TABLE IF NOT EXISTS public.booking_trips (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  trip_order          int NOT NULL DEFAULT 1,  -- 1st trip, 2nd trip, etc.
  trip_date           date NOT NULL,
  pickup_time         time,
  service_name        text NOT NULL,           -- "Airport Transfer - LOP to El Tropico Hotel"
  service_description text,                   -- flight info, pickup notes, etc.
  pickup_address      text,
  dropoff_address     text,
  route_id            uuid REFERENCES public.routes(id) ON DELETE SET NULL,
  driver_id           uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  vehicle_id          uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  price               numeric(12,2) NOT NULL DEFAULT 0,
  status              text DEFAULT 'confirmed', -- confirmed | in_progress | completed | cancelled
  notes               text,
  created_at          timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_trips ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_booking_trips_booking_id ON public.booking_trips(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_trips_trip_date  ON public.booking_trips(trip_date);

-- RLS Policies: Authenticated users can read/write
CREATE POLICY "Allow authenticated read on booking_trips"
  ON public.booking_trips FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on booking_trips"
  ON public.booking_trips FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on booking_trips"
  ON public.booking_trips FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on booking_trips"
  ON public.booking_trips FOR DELETE
  USING (auth.role() = 'authenticated');

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'bookings'
  AND column_name IN ('receipt_number','deposit_amount','deposit_method','receipt_status');

SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'booking_trips';
