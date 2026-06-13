-- Migrasi untuk Modul Legal & Compliance (Step 12)

-- 1. Company Documents
CREATE TABLE IF NOT EXISTS public.company_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  document_number VARCHAR(100),
  publisher VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'renewing')),
  pic_name VARCHAR(100),
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_name VARCHAR(255) NOT NULL,
  party_type VARCHAR(50) NOT NULL CHECK (party_type IN ('driver', 'hotel', 'travel_agent', 'ota', 'other')),
  contract_type VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'negotiating', 'terminated')),
  summary TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Data Access Log
CREATE TABLE IF NOT EXISTS public.data_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Bisa direferensikan ke auth.users jika diaktifkan
  data_type VARCHAR(100) NOT NULL,
  data_id UUID,
  action VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Data Deletion Requests
CREATE TABLE IF NOT EXISTS public.data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  processed_by VARCHAR(100),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all read access on company_documents" ON public.company_documents FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on company_documents" ON public.company_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on company_documents" ON public.company_documents FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on company_documents" ON public.company_documents FOR DELETE USING (true);

CREATE POLICY "Allow all read access on contracts" ON public.contracts FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on contracts" ON public.contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on contracts" ON public.contracts FOR UPDATE USING (true);
CREATE POLICY "Allow all delete access on contracts" ON public.contracts FOR DELETE USING (true);

CREATE POLICY "Allow all read access on data_access_log" ON public.data_access_log FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on data_access_log" ON public.data_access_log FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all read access on data_deletion_requests" ON public.data_deletion_requests FOR SELECT USING (true);
CREATE POLICY "Allow all insert access on data_deletion_requests" ON public.data_deletion_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update access on data_deletion_requests" ON public.data_deletion_requests FOR UPDATE USING (true);
