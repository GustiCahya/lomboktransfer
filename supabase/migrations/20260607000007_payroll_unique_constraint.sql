-- Migration: Add unique constraint to payroll for upsert
ALTER TABLE public.payroll ADD CONSTRAINT payroll_driver_period_key UNIQUE (driver_id, period_month, period_year);
