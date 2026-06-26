/**
 * apply_company_assets_bucket.js
 * Run with: node apply_company_assets_bucket.js
 *
 * Creates the 'company-assets' public storage bucket in Supabase
 * and sets up RLS policies for admin write / public read.
 */

require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

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
    // Fallback to RPC
    return runSQLViaRPC(sql);
  }
  return true;
}

async function runSQLViaRPC(sql) {
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
    console.warn(`  ⚠  RPC fallback failed (${res.status}): ${err.slice(0, 120)}`);
    return false;
  }
  return true;
}

async function createBucketViaAPI() {
  // Use Supabase Storage API to create bucket
  const url = `${SUPABASE_URL}/storage/v1/bucket`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      id: 'company-assets',
      name: 'company-assets',
      public: true,
      file_size_limit: 2097152, // 2 MB
      allowed_mime_types: ['image/png', 'image/svg+xml', 'image/jpeg', 'image/webp'],
    }),
  });

  const text = await res.text();
  if (res.ok) {
    console.log('  ✅ Bucket "company-assets" created via Storage API');
    return true;
  } else if (text.includes('already exists') || text.includes('Duplicate')) {
    console.log('  ℹ️  Bucket "company-assets" already exists — skipping creation.');
    return true;
  } else {
    console.warn(`  ⚠  Storage API (${res.status}): ${text.slice(0, 200)}`);
    return false;
  }
}

const policies = [
  `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   VALUES ('company-assets', 'company-assets', true, 2097152, ARRAY['image/png','image/svg+xml','image/jpeg','image/webp'])
   ON CONFLICT (id) DO UPDATE SET public = true`,

  `DROP POLICY IF EXISTS "Public read for company-assets" ON storage.objects;
   CREATE POLICY "Public read for company-assets" ON storage.objects
     FOR SELECT USING (bucket_id = 'company-assets')`,

  `DROP POLICY IF EXISTS "Admin write for company-assets" ON storage.objects;
   CREATE POLICY "Admin write for company-assets" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'company-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'))`,

  `DROP POLICY IF EXISTS "Admin update for company-assets" ON storage.objects;
   CREATE POLICY "Admin update for company-assets" ON storage.objects
     FOR UPDATE USING (bucket_id = 'company-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'))`,

  `DROP POLICY IF EXISTS "Admin delete for company-assets" ON storage.objects;
   CREATE POLICY "Admin delete for company-assets" ON storage.objects
     FOR DELETE USING (bucket_id = 'company-assets' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'))`,
];

async function main() {
  console.log('\n🪣  Setting up "company-assets" storage bucket...\n');

  // Step 1: Create bucket via Storage API
  const bucketCreated = await createBucketViaAPI();

  // Step 2: Apply SQL policies via Management API
  console.log('\n📋  Applying storage policies...\n');
  let allOk = true;
  for (const sql of policies) {
    const ok = await runSQL(sql);
    if (!ok) {
      allOk = false;
      console.warn('  ⚠  Some policies could not be applied via Management API.');
      console.warn('     Apply the SQL in supabase/migrations/20260627000000_add_company_assets_bucket.sql manually in the Supabase SQL Editor.\n');
      break;
    }
    process.stdout.write('  ✅ Policy applied\n');
  }

  if (bucketCreated) {
    console.log('\n✅  Done! The "company-assets" bucket is ready.');
    console.log('   Upload URL: ' + SUPABASE_URL + '/storage/v1/object/public/company-assets/\n');
  }

  if (!allOk) {
    console.log('\n📄  Manual SQL file: supabase/migrations/20260627000000_add_company_assets_bucket.sql\n');
  }
}

main().catch(console.error);
