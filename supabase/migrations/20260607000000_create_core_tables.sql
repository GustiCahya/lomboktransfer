-- Migration: Create Core Tables (Users, Drivers, Vehicles)

-- 1. ENUMS (if any)
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'dispatcher', 'driver', 'accountant', 'viewer');

-- 2. USERS
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role user_role DEFAULT 'viewer'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. DRIVERS
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  nik text UNIQUE NOT NULL,
  phone_wa text NOT NULL,
  date_of_birth date,
  address text,
  bank_account text,
  bank_name text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status text DEFAULT 'active', -- active | inactive | leave
  join_date date,
  driver_type text DEFAULT 'employee', -- employee | freelance
  commission_pct numeric(5,2) DEFAULT 60.00,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- 4. DRIVER_DOCUMENTS
CREATE TABLE public.driver_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES public.drivers(id) ON DELETE CASCADE,
  doc_type text NOT NULL, -- ktp | sim_a | sim_b1 | skck | health_cert
  file_url text,
  issue_date date,
  expiry_date date,
  status text DEFAULT 'active', -- active | expired | renewal_process
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;

-- 5. VEHICLES
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code text UNIQUE NOT NULL, -- LT-01, LT-02
  brand text NOT NULL,
  model text NOT NULL,
  year int,
  color text,
  plate_number text UNIQUE NOT NULL,
  vin text,
  engine_number text,
  passenger_cap int DEFAULT 1,
  status text DEFAULT 'active', -- active | maintenance | inactive | sold
  current_km int DEFAULT 0,
  last_service_km int DEFAULT 0,
  photo_urls text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- 6. VEHICLE_DOCUMENTS
CREATE TABLE public.vehicle_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE,
  doc_type text NOT NULL, -- stnk | kir | insurance_vehicle | insurance_passenger
  file_url text,
  issue_date date,
  expiry_date date,
  insurer_name text,
  policy_number text,
  status text DEFAULT 'active', -- active | expired | renewal_process
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
