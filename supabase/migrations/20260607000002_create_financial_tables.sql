-- Migration: Create Financial Tables (Payroll, Expenses, Service_Records)

-- 1. PAYROLL
CREATE TABLE public.payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES public.drivers(id) ON DELETE CASCADE,
  period_month int NOT NULL,
  period_year int NOT NULL,
  total_trips int DEFAULT 0,
  gross_revenue numeric(12,2) DEFAULT 0,
  commission_pct numeric(5,2) DEFAULT 60.00,
  commission_amt numeric(12,2) DEFAULT 0,
  bonus numeric(12,2) DEFAULT 0,
  deduction numeric(12,2) DEFAULT 0,
  net_payable numeric(12,2) DEFAULT 0,
  status text DEFAULT 'draft', -- draft | approved | paid
  payment_date date,
  transfer_proof text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- 2. VENDORS (Needed for Expenses and Service_Records)
CREATE TABLE public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text, -- workshop | fuel | insurance | technology | hotel | travel_agent | other
  pic_name text,
  phone_wa text,
  email text,
  address text,
  website text,
  bank_account text,
  bank_name text,
  rating int CHECK (rating >= 1 AND rating <= 5),
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- 3. EXPENSES
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date date NOT NULL,
  category text NOT NULL, -- fuel | maintenance | insurance | commission | platform_fee | marketing | office | legal | other
  description text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL,
  receipt_url text,
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 4. SERVICE_RECORDS
CREATE TABLE public.service_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_date date NOT NULL,
  service_type text NOT NULL, -- oil_change | routine | tire | battery | brake | other
  km_at_service int NOT NULL,
  next_service_km int,
  workshop_id uuid REFERENCES public.vendors(id) ON DELETE SET NULL,
  cost numeric(12,2) DEFAULT 0,
  notes text,
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
