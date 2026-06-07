-- Migrasi untuk Modul Vendor & Procurement (Step 13)

-- 1. Vendors
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  pic_name VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(100),
  address TEXT,
  website VARCHAR(255),
  bank_account VARCHAR(100),
  bank_name VARCHAR(100),
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Hotel & Travel Partners
-- Extends vendor table specifically for partners
CREATE TABLE IF NOT EXISTS public.hotel_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  commission_rate NUMERIC(10,2), -- Percentage
  commission_fixed NUMERIC(15,2), -- Fixed amount
  partnership_status VARCHAR(50) DEFAULT 'active' CHECK (partnership_status IN ('active', 'inactive', 'negotiating')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Purchase Orders
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(100) UNIQUE NOT NULL,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
  description TEXT,
  items_json JSONB, -- Simpan rincian barang/jasa
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'completed')),
  created_by UUID, -- References auth.users
  approved_by UUID, -- References auth.users
  approved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all read access on vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on vendors" ON public.vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on vendors" ON public.vendors FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on vendors" ON public.vendors FOR DELETE USING (true);

CREATE POLICY "Allow all read access on hotel_partners" ON public.hotel_partners FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on hotel_partners" ON public.hotel_partners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on hotel_partners" ON public.hotel_partners FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on hotel_partners" ON public.hotel_partners FOR DELETE USING (true);

CREATE POLICY "Allow all read access on purchase_orders" ON public.purchase_orders FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on purchase_orders" ON public.purchase_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on purchase_orders" ON public.purchase_orders FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on purchase_orders" ON public.purchase_orders FOR DELETE USING (true);
