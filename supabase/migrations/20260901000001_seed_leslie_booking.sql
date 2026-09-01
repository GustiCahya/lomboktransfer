-- ============================================================
-- Seed Data: Leslie LENORMAND - Booking LT-2026-0038
-- Run AFTER migration 20260901000000_add_booking_trips.sql
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/injscuwpllomtdaixkuo/sql/new
-- ============================================================

DO $$
DECLARE
  v_guest_id   uuid;
  v_booking_id uuid;
BEGIN

  -- 1. UPSERT GUEST: Leslie LENORMAND
  SELECT id INTO v_guest_id FROM public.guests WHERE email = 'lenormand.leslie@laposte.net' LIMIT 1;

  IF v_guest_id IS NULL THEN
    INSERT INTO public.guests (
      full_name, email, phone_wa,
      nationality, language,
      source_first,
      total_bookings, total_spend,
      tag, notes
    )
    VALUES (
      'Leslie LENORMAND',
      'lenormand.leslie@laposte.net',
      '+33658363643',
      'French',
      'fr',
      'whatsapp',
      1,
      2400000,
      'regular',
      '1 passenger · 1 large suitcase. Contact via WhatsApp or email.'
    )
    RETURNING id INTO v_guest_id;
  ELSE
    UPDATE public.guests SET
      phone_wa        = '+33658363643',
      total_bookings  = public.guests.total_bookings + 1,
      total_spend     = public.guests.total_spend + 2400000
    WHERE id = v_guest_id;
  END IF;

  -- 2. INSERT BOOKING: LT-2026-0038
  INSERT INTO public.bookings (
    booking_code,
    guest_id,
    pickup_datetime,
    pickup_address,
    dropoff_address,
    pax_count,
    luggage_count,
    gross_price,
    net_price,
    source,
    status,
    payment_method,
    payment_status,
    -- New columns
    receipt_number,
    deposit_amount,
    deposit_paid_at,
    deposit_method,
    balance_due,
    total_passengers,
    total_luggage,
    receipt_status,
    inclusions,
    terms_notes,
    notes,
    language_pref
  )
  VALUES (
    'LT-2026-0038',
    v_guest_id,
    '2026-09-16 10:00:00+08',  -- first trip datetime
    'LOP Airport (Lombok International)',
    'El Tropico Hotel, Kuta Lombok',
    1,
    1,
    2400000,
    2400000,
    'whatsapp',
    'confirmed',
    'transfer',
    'partial',
    'REC-2026-0038',
    1200000,
    '2026-09-01',
    'wise',
    1200000,
    1,
    1,
    'deposit_received',
    ARRAY[
      'Private car (AC) for all land transfers',
      'Private speedboat (Teluk Nare - Gili Air)',
      'Driver with name sign at LOP arrivals',
      'Fuel & parking - fully included',
      'Luggage assistance (1 large suitcase)',
      'Harbour - PinkCoco coordination (both ways)',
      'WhatsApp contact throughout the trip',
      'No additional or hidden fees'
    ],
    'This receipt confirms the deposit payment and booking of private transfer services as detailed above. The remaining balance of IDR 1.200.000 is to be paid in cash (IDR) upon first pickup on 16 September 2026. All services are all-inclusive with no additional fees. Free cancellation up to 48 hours before the first trip date.',
    'Booking paket 3 trip untuk Leslie LENORMAND. Deposit IDR 1.200.000 diterima via Wise pada 1 September 2026.',
    'fr'
  )
  ON CONFLICT (booking_code) DO UPDATE SET
    receipt_status  = EXCLUDED.receipt_status,
    deposit_amount  = EXCLUDED.deposit_amount,
    deposit_paid_at = EXCLUDED.deposit_paid_at,
    deposit_method  = EXCLUDED.deposit_method,
    balance_due     = EXCLUDED.balance_due,
    inclusions      = EXCLUDED.inclusions,
    updated_at      = now()
  RETURNING id INTO v_booking_id;

  -- Fallback jika booking sudah ada
  IF v_booking_id IS NULL THEN
    SELECT id INTO v_booking_id FROM public.bookings WHERE booking_code = 'LT-2026-0038';
  END IF;

  -- 3. UPSERT BOOKING TRIPS
  -- Delete existing trips for this booking first (idempotent)
  DELETE FROM public.booking_trips WHERE booking_id = v_booking_id;

  -- Trip 1: 16 Sep - LOP → El Tropico Hotel, Kuta Lombok
  INSERT INTO public.booking_trips (
    booking_id, trip_order, trip_date, pickup_time,
    service_name, service_description,
    pickup_address, dropoff_address, price, status
  ) VALUES (
    v_booking_id, 1, '2026-09-16', '10:00:00',
    'Airport Transfer — LOP → El Tropico Hotel, Kuta Lombok',
    'Flight: Super Air Jet IU762 · Arrival 10:00 AM' || chr(10) || 'Driver with name sign · Private car · All-inclusive',
    'LOP Airport (Lombok International)',
    'El Tropico Hotel, Kuta Lombok',
    450000,
    'confirmed'
  );

  -- Trip 2: 22 Sep - El Tropico Hotel → Gili Air
  INSERT INTO public.booking_trips (
    booking_id, trip_order, trip_date, pickup_time,
    service_name, service_description,
    pickup_address, dropoff_address, price, status
  ) VALUES (
    v_booking_id, 2, '2026-09-22', '09:30:00',
    'Private Transfer — El Tropico Hotel → Gili Air',
    'Pickup: 09:30 AM · Private car to Teluk Nare + private speedboat → Gili Air' || chr(10) || 'Arrival at main harbour',
    'El Tropico Hotel, Kuta Lombok',
    'Gili Air (main harbour)',
    1050000,
    'confirmed'
  );

  -- Trip 3: 27 Sep - Gili Air → LOP Airport
  INSERT INTO public.booking_trips (
    booking_id, trip_order, trip_date, pickup_time,
    service_name, service_description,
    pickup_address, dropoff_address, price, status
  ) VALUES (
    v_booking_id, 3, '2026-09-27', '13:30:00',
    'Private Transfer — Gili Air → LOP Airport',
    'Depart PinkCoco: 13:30 · Speedboat → Teluk Nare + private car to LOP' || chr(10) || 'Est. airport arrival 16:00–16:15 · Flight departs 18:00',
    'Gili Air (PinkCoco)',
    'LOP Airport (Lombok International)',
    900000,
    'confirmed'
  );

  RAISE NOTICE 'Seed completed. Guest ID: %, Booking ID: %', v_guest_id, v_booking_id;

END $$;

-- Verify seeding
SELECT
  b.booking_code,
  b.receipt_number,
  b.receipt_status,
  b.gross_price,
  b.deposit_amount,
  b.balance_due,
  g.full_name AS guest_name,
  g.email,
  (SELECT count(*) FROM public.booking_trips bt WHERE bt.booking_id = b.id) AS trip_count
FROM public.bookings b
JOIN public.guests g ON b.guest_id = g.id
WHERE b.booking_code = 'LT-2026-0038';

SELECT trip_order, trip_date, pickup_time, service_name, price
FROM public.booking_trips bt
JOIN public.bookings b ON bt.booking_id = b.id
WHERE b.booking_code = 'LT-2026-0038'
ORDER BY trip_order;
