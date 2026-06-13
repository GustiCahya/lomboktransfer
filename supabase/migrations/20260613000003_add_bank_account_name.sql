-- Add bank_account_name to drivers
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS bank_account_name text;
