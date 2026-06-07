-- Migration: Create Supporting Tables (Company_Documents, Partner_Contracts, Hotel_Partners)

-- 1. COMPANY_DOCUMENTS
CREATE TABLE public.company_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_name text NOT NULL,
  doc_number text,
  issuer text,
  issue_date date,
  expiry_date date,
  status text DEFAULT 'active', -- active | expired | renewal_process
  file_url text,
  pic_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;

-- 2. PARTNER_CONTRACTS
CREATE TABLE public.partner_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_name text NOT NULL,
  party_type text, -- driver | hotel | travel_agent | other
  contract_type text,
  start_date date,
  end_date date,
  key_terms text,
  file_url text,
  status text DEFAULT 'active', -- active | expired | negotiating
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.partner_contracts ENABLE ROW LEVEL SECURITY;

-- 3. HOTEL_PARTNERS
CREATE TABLE public.hotel_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
  commission_pct numeric(5,2),
  referral_fee numeric(12,2),
  total_bookings int DEFAULT 0,
  total_value numeric(12,2) DEFAULT 0,
  status text DEFAULT 'active', -- active | inactive | negotiating
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.hotel_partners ENABLE ROW LEVEL SECURITY;
