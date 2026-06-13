-- Supabase SQL Views untuk Analytics (Step 15)

-- 1. View: Revenue vs Expense monthly trend (12 bulan)
CREATE OR REPLACE VIEW public.v_revenue_expense_trend AS
SELECT
  DATE_TRUNC('month', month_date) AS month,
  COALESCE(SUM(revenue), 0) AS total_revenue,
  COALESCE(SUM(expenses), 0) AS total_expenses,
  COALESCE(SUM(revenue), 0) - COALESCE(SUM(expenses), 0) AS net_profit
FROM (
  SELECT
    DATE_TRUNC('month', pickup_datetime) AS month_date,
    net_price AS revenue,
    0 AS expenses
  FROM public.bookings
  WHERE status = 'completed'
  UNION ALL
  SELECT
    DATE_TRUNC('month', expense_date) AS month_date,
    0 AS revenue,
    amount AS expenses
  FROM public.expenses
) sub
GROUP BY DATE_TRUNC('month', month_date)
ORDER BY month;

-- 2. View: Booking sources distribution
CREATE OR REPLACE VIEW public.v_booking_sources AS
SELECT
  source,
  COUNT(*) AS total_bookings,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentage
FROM public.bookings
GROUP BY source
ORDER BY total_bookings DESC;

-- 3. View: Top routes by booking volume
CREATE OR REPLACE VIEW public.v_route_popularity AS
SELECT
  r.name AS route_name,
  COUNT(b.id) AS total_bookings,
  COALESCE(SUM(b.net_price), 0) AS total_revenue,
  ROUND(AVG(b.net_price), 0) AS avg_price
FROM public.bookings b
LEFT JOIN public.routes r ON b.route_id = r.id
WHERE b.status = 'completed'
GROUP BY r.name
ORDER BY total_bookings DESC
LIMIT 10;

-- 4. View: Driver performance summary
CREATE OR REPLACE VIEW public.v_driver_performance AS
SELECT
  d.full_name AS driver_name,
  COUNT(b.id) AS total_trips,
  COALESCE(SUM(b.net_price), 0) AS total_revenue,
  COALESCE(AVG(rev.rating), 0) AS avg_rating
FROM public.drivers d
LEFT JOIN public.bookings b ON b.driver_id = d.id AND b.status = 'completed'
LEFT JOIN public.reviews rev ON rev.driver_id = d.id
GROUP BY d.id, d.full_name
ORDER BY total_trips DESC;

-- 5. View: Guest nationality demographics
CREATE OR REPLACE VIEW public.v_guest_demographics AS
SELECT
  COALESCE(nationality, 'Unknown') AS nationality,
  COUNT(*) AS total_guests,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentage
FROM public.guests
GROUP BY nationality
ORDER BY total_guests DESC
LIMIT 10;
