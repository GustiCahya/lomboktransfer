/**
 * run_migration.js
 * Jalankan satu file migration SQL ke Supabase.
 * Usage: node run_migration.js <path-to-migration.sql>
 *
 * Menggunakan pola yang sama dengan apply_db.js.
 */

require('dotenv').config({ path: '.env' });
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

// ── SQL runners (same pattern as apply_db.js) ──────────────────────────────

async function runSQLManagementAPI(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.warn(`  ⚠  Management API failed (${res.status}): ${err.slice(0, 120)}`);
    return false;
  }
  return true;
}

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
    console.warn(`  ⚠  /pg fallback failed (${res.status}): ${err.slice(0, 120)}`);
    return false;
  }
  return true;
}

// ── Split SQL into individual statements ───────────────────────────────────

function splitStatements(sql) {
  // Split on semicolons but preserve DO $$ ... $$ blocks
  const statements = [];
  let current = '';
  let inBlock = false;

  for (const line of sql.split('\n')) {
    if (line.trim().startsWith('DO $$') || line.trim().startsWith('DO $')) inBlock = true;
    current += line + '\n';
    if (inBlock && (line.trim() === '$$' || line.trim() === '$$ ;' || line.trim().endsWith('$$;'))) {
      inBlock = false;
      statements.push(current.trim());
      current = '';
      continue;
    }
    if (!inBlock && line.trim().endsWith(';')) {
      const stmt = current.trim().replace(/;$/, '').trim();
      if (stmt && !stmt.startsWith('--')) statements.push(stmt);
      current = '';
    }
  }
  if (current.trim() && !current.trim().startsWith('--')) {
    statements.push(current.trim());
  }
  return statements.filter(Boolean);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error('Usage: node run_migration.js <path-to-migration.sql>');
    process.exit(1);
  }

  const fullPath = path.resolve(sqlFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(fullPath, 'utf-8');
  const statements = splitStatements(sql);

  console.log(`\n🚀  Running migration: ${path.basename(fullPath)}`);
  console.log(`    Project: ${projectRef}`);
  console.log(`    Statements: ${statements.length}\n`);

  // Test Management API availability
  const mgmtAvailable = await runSQLManagementAPI('SELECT 1');

  let allOk = true;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 70);
    process.stdout.write(`  [${i + 1}/${statements.length}] ${preview}... `);

    let ok = false;
    if (mgmtAvailable) ok = await runSQLManagementAPI(stmt);
    if (!ok) ok = await runSQLViaPG(stmt);

    if (ok) {
      console.log('✅');
    } else {
      console.log('❌ FAILED');
      allOk = false;
    }
  }

  if (allOk) {
    console.log('\n🎉  Migration completed successfully!\n');
  } else {
    console.log('\n⚠️  Some statements failed. Run the SQL manually in Supabase SQL Editor:');
    console.log(`    https://supabase.com/dashboard/project/${projectRef}/sql\n`);
    console.log('--- SQL ---\n');
    console.log(sql);
    console.log('\n--- END ---\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
