/**
 * run_migration.js
 * Direct PostgreSQL migration via pg driver connecting to Supabase cloud DB
 * 
 * Supabase projects expose postgres at:
 *   Host: db.<project-ref>.supabase.co  Port: 5432
 *   User: postgres
 *   Password: <your-db-password>  (from Supabase dashboard → Settings → Database)
 * 
 * Run: node run_migration.js <db-password>
 *   OR set DB_PASSWORD env variable
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

const projectRef = 'injscuwpllomtdaixkuo';
const dbPassword = process.argv[2] || process.env.DB_PASSWORD;

if (!dbPassword) {
  console.error('❌ Please provide the database password:');
  console.error('   node run_migration.js <your-db-password>');
  console.error('   OR set DB_PASSWORD in your .env file');
  console.error('');
  console.error('   Find it at: https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
  process.exit(1);
}

const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: dbPassword,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

const SQL = `
-- Create table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Lombok Transfer Pariwisata',
  brand_name text NOT NULL DEFAULT 'Lombok Transfer',
  npwp text,
  nib text,
  email text NOT NULL DEFAULT 'hello@lomboktransfer.com',
  phone_wa text NOT NULL DEFAULT '+62 81-7777-480',
  address text,
  logo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Policies (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow public read access on company_settings') THEN
    CREATE POLICY "Allow public read access on company_settings" ON public.company_settings FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow authenticated users to update company_settings') THEN
    CREATE POLICY "Allow authenticated users to update company_settings" ON public.company_settings FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'company_settings' AND policyname = 'Allow authenticated users to insert company_settings') THEN
    CREATE POLICY "Allow authenticated users to insert company_settings" ON public.company_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;

-- Seed / upsert data
INSERT INTO public.company_settings (id, company_name, brand_name, npwp, nib, email, phone_wa, address, logo_url)
VALUES (
  1,
  'Lombok Transfer Pariwisata',
  'Lombok Transfer',
  NULL,
  NULL,
  'hello@lomboktransfer.com',
  '+62 81-7777-480',
  'Jl. Langko 70, Mataram, Lombok, NTB, Indonesia',
  '/logo_without_text.png'
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone_wa     = EXCLUDED.phone_wa,
  address      = EXCLUDED.address,
  email        = EXCLUDED.email,
  logo_url     = EXCLUDED.logo_url,
  updated_at   = now();
`;

async function main() {
  console.log(`\n🔌 Connecting to db.${projectRef}.supabase.co:5432 ...`);
  try {
    await client.connect();
    console.log('✅ Connected!\n');
    
    console.log('🚀 Running migration...');
    await client.query(SQL);
    
    const result = await client.query('SELECT id, company_name, phone_wa, address FROM public.company_settings');
    console.log('\n🎉 Migration complete! Current company_settings:');
    console.table(result.rows);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      console.error('\n   Could not connect to the database. Please run the SQL manually:');
      console.error('   https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    }
  } finally {
    await client.end();
  }
}

main();
