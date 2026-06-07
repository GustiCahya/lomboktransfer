-- Migration: Create Operational Tables (Routes, Guests, Bookings, Reviews)

-- 1. ROUTES
CREATE TABLE public.routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  base_price numeric(12,2) NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  estimated_duration_min int,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- 2. GUESTS
CREATE TABLE public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone_wa text,
  nationality text,
  language text, -- en | id | zh | other
  source_first text,
  total_bookings int DEFAULT 0,
  total_spend numeric(12,2) DEFAULT 0,
  tag text, -- vip | regular | one_time | repeat
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- 3. BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code text UNIQUE NOT NULL, -- LT-2026-0001
  guest_id uuid REFERENCES public.guests(id) ON DELETE RESTRICT,
  route_id uuid REFERENCES public.routes(id) ON DELETE RESTRICT,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  pickup_datetime timestamptz NOT NULL,
  pickup_address text,
  dropoff_address text,
  pax_count int DEFAULT 1,
  luggage_count int DEFAULT 0,
  gross_price numeric(12,2) NOT NULL DEFAULT 0,
  ota_commission numeric(12,2) DEFAULT 0,
  net_price numeric(12,2) NOT NULL DEFAULT 0,
  source text, -- direct | klook | viator | traveloka | getyourguide | trip_com | whatsapp | manual
  status text DEFAULT 'pending', -- pending | confirmed | driver_assigned | in_progress | completed | cancelled
  payment_method text, -- cash | transfer | ota_settlement
  payment_status text DEFAULT 'unpaid', -- unpaid | paid | refunded
  notes text,
  flight_number text,
  language_pref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES public.guests(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  platform text, -- google | klook | viator | tripadvisor | internal
  rating int CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  review_date date,
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
