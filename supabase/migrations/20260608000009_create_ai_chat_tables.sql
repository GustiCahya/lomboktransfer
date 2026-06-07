-- Migrasi untuk Modul AI Chatbot (Step 16)

-- 1. Chat Sessions (menyimpan histori & context percakapan AI per tamu)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_phone VARCHAR(50) NOT NULL,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  messages_json JSONB DEFAULT '[]'::jsonb, -- Array of {role, content} messages
  status VARCHAR(50) DEFAULT 'bot' CHECK (status IN ('bot', 'human_required', 'human_active', 'closed')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Audit Logs (trail aktivitas kritis seluruh sistem)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  user_email VARCHAR(255),
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all read on chat_sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow all insert on chat_sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on chat_sessions" ON public.chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow all read on audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow all insert on audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Index for fast lookup by phone
CREATE INDEX IF NOT EXISTS idx_chat_sessions_phone ON public.chat_sessions(guest_phone);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON public.audit_logs(table_name, created_at DESC);
