/**
 * apply_db.js
 * Run with: node apply_db.js
 *
 * Applies the company_settings table migration directly to the Supabase
 * cloud database using the Management API or SQL-over-REST fallback.
 */

require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Extract the project ref from the URL (e.g. "injscuwpllomtdaixkuo")
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

async function runSQL(sql) {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const err = await res.text();
    // Try fallback: some Supabase setups expose a /rest/v1/rpc/exec_sql function
    console.warn(`  ⚠  Management API failed (${res.status}): ${err.slice(0, 120)}`);
    return false;
  }

  return true;
}

// Fallback: use the postgres.js compatible rpc approach via PostgREST
async function runSQLViaRPC(sql) {
  // Many Supabase projects have a pg_query function enabled for service role
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.warn(`  ⚠  RPC fallback also failed (${res.status}): ${err.slice(0, 120)}`);
    return false;
  }

  return true;
}

// Execute SQL using Supabase's undocumented but working approach:
// POST to /pg endpoint with service_role key
async function runSQLViaPG(sql) {
  const res = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.warn(`  ⚠  /pg fallback also failed (${res.status}): ${err.slice(0, 120)}`);
    return false;
  }

  return true;
}

async function main() {
  console.log(`\n🚀  Applying company_settings migration to: ${SUPABASE_URL}\n`);

  const statements = [
    // 1. Create table
    `CREATE TABLE IF NOT EXISTS public.company_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Lombok Transfer Pariwisata',
  brand_name text NOT NULL DEFAULT 'Lombok Transfer',
  npwp text,
  nib text,
  email text NOT NULL DEFAULT 'info@lomboktransfer.com',
  phone_wa text NOT NULL DEFAULT '+62 81-7777-480',
  address text,
  logo_url text,
  updated_at timestamptz DEFAULT now()
)`,

    // 2. Enable RLS
    `ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY`,

    // 3. Policies
    `DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow public read access on company_settings'
  ) THEN
    CREATE POLICY "Allow public read access on company_settings" ON public.company_settings FOR SELECT USING (true);
  END IF;
END $$`,

    `DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow authenticated users to update company_settings'
  ) THEN
    CREATE POLICY "Allow authenticated users to update company_settings" ON public.company_settings FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$`,

    `DO $$ BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow authenticated users to insert company_settings'
  ) THEN
    CREATE POLICY "Allow authenticated users to insert company_settings" ON public.company_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$`,

    // 4. Seed initial data
    `INSERT INTO public.company_settings (id, company_name, brand_name, npwp, nib, email, phone_wa, address, logo_url)
VALUES (
  1,
  'Lombok Transfer Pariwisata',
  'Lombok Transfer',
  NULL,
  NULL,
  'info@lomboktransfer.com',
  '+62 81-7777-480',
  'Jl. Langko 70, Mataram, Lombok, NTB, Indonesia',
  '/logo_without_text.png'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone_wa = EXCLUDED.phone_wa,
  address = EXCLUDED.address,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url`,
  ];

  // Try Management API first, then fallbacks
  let useManagementAPI = await runSQL('SELECT 1');

  if (!useManagementAPI) {
    console.log('  → Trying upsert-only approach via PostgREST...\n');
  }

  let allOk = true;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    const preview = stmt.split('\n')[0].slice(0, 60);
    process.stdout.write(`  [${i + 1}/${statements.length}] ${preview}... `);

    let ok = false;

    if (useManagementAPI) {
      ok = await runSQL(stmt);
    }

    if (!ok) {
      ok = await runSQLViaPG(stmt);
    }

    if (!ok) {
      // Final fallback: report failure
      console.log('❌ FAILED');
      allOk = false;
    } else {
      console.log('✅');
    }
  }

  if (allOk) {
    console.log('\n🎉  Migration completed successfully!\n');
  } else {
    console.log('\n⚠️  Some statements failed. See above for details.');
    console.log('    If Management API access is not available, please run the SQL manually');
    console.log('    in the Supabase SQL Editor at: https://supabase.com/dashboard/project/' + projectRef + '/sql\n');
    // Output the combined SQL for manual copy-paste
    console.log('--- COPY AND PASTE THIS SQL INTO THE SUPABASE SQL EDITOR ---\n');
    console.log(statements.join(';\n\n') + ';');
    console.log('\n--- END OF SQL ---\n');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
