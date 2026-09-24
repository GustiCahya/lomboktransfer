-- Add fee_type, fixed_fee, and daily_fee fields to drivers table
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS fee_type text NOT NULL DEFAULT 'percentage', -- 'percentage' | 'fixed' | 'daily'
  ADD COLUMN IF NOT EXISTS fixed_fee numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_fee numeric(12,2) DEFAULT 0;

-- Add comments for clarity
COMMENT ON COLUMN public.drivers.fee_type IS 'How the driver is paid per trip: percentage (of gross_price), fixed (flat amount), or daily (per trip date)';
COMMENT ON COLUMN public.drivers.fixed_fee IS 'Fixed fee amount per trip in IDR (used when fee_type = fixed)';
COMMENT ON COLUMN public.drivers.daily_fee IS 'Daily fee amount per trip date in IDR (used when fee_type = daily)';
