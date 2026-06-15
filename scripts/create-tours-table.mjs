/**
 * Migration: Create tours table in Supabase
 */
const SUPABASE_URL = "https://injscuwpllomtdaixkuo.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanNjdXdwbGxvbXRkYWl4a3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyMDczOSwiZXhwIjoyMDk2Mzk2NzM5fQ.JtO0Fa817ogyXB_RTtyCggr01kkXLLQTI6aw0Fc6z1Y";

const HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

const sql = `
CREATE TABLE IF NOT EXISTS public.tours (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  duration text NOT NULL,
  base_price integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tours' AND policyname = 'Allow service role full access'
  ) THEN
    CREATE POLICY "Allow service role full access" ON public.tours FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

async function run() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ sql }),
  });
  const text = await res.text();
  
  if (res.status === 404 || text.includes("Could not find")) {
    // exec_sql not available — try via pg directly using management API
    console.log("exec_sql RPC not found. Trying management API...");
    // Use the Supabase Management API to run SQL
    const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/injscuwpllomtdaixkuo/database/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    const mgmtText = await mgmtRes.text();
    console.log("Management API response:", mgmtRes.status, mgmtText.slice(0, 300));
    return;
  }
  
  console.log("Status:", res.status, text.slice(0, 300));
}

run().catch(console.error);
