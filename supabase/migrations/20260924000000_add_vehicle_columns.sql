-- Migration: Add missing vehicle columns (capacity, next_service_km, default_driver_id, notes)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS capacity int DEFAULT 7;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS next_service_km int;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS default_driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS notes text;

-- Sync existing passenger_cap into capacity if capacity is not set
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'vehicles' 
      AND column_name = 'passenger_cap'
  ) THEN
    UPDATE public.vehicles 
    SET capacity = passenger_cap 
    WHERE capacity IS NULL;
  END IF;
END $$;
