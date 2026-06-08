/**
 * Cleanup Script: Remove old/duplicate routes from the initial migration seed
 * Run: node scripts/cleanup-old-routes.mjs
 */

const SUPABASE_URL = "https://injscuwpllomtdaixkuo.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanNjdXdwbGxvbXRkYWl4a3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyMDczOSwiZXhwIjoyMDk2Mzk2NzM5fQ.JtO0Fa817ogyXB_RTtyCggr01kkXLLQTI6aw0Fc6z1Y";

// Old route names from the initial migration seed that are now replaced
const OLD_NAMES = [
  "BIL → Mataram",            // duplicated by new seed (keep new one - skip)
  "BIL → Senggigi",
  "BIL → Kuta Lombok",
  "BIL → Bangsal (Gili area)",
  "BIL → Mandalika",
  "BIL → Tetebatu",
  "Senggigi → Gili (via Bangsal)",  // old format - replaced by new name
  "Day Tour Paket (Full Day)",      // old format - replaced
];

async function cleanup() {
  // 1. Fetch all routes to see current state
  const listRes = await fetch(`${SUPABASE_URL}/rest/v1/routes?select=id,name,origin,destination,base_price`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  const allRoutes = await listRes.json();

  console.log(`\n📋  All routes in DB (${allRoutes.length} total):\n`);
  allRoutes.forEach((r) =>
    console.log(`   [${r.id}] ${r.name} | ${r.origin} → ${r.destination} | IDR ${Number(r.base_price).toLocaleString("id-ID")}`)
  );

  // 2. Find duplicates – routes with same name but older (lower UUID sort) 
  // Group by name
  const byName = {};
  for (const r of allRoutes) {
    if (!byName[r.name]) byName[r.name] = [];
    byName[r.name].push(r);
  }

  const toDelete = [];
  for (const [name, rows] of Object.entries(byName)) {
    if (rows.length > 1) {
      // Keep last inserted (highest index), delete the rest
      const sorted = rows.slice().reverse(); // newest first
      toDelete.push(...sorted.slice(1).map((r) => r.id));
      console.log(`\n⚠️  Duplicate "${name}" – keeping ${sorted[0].id}, removing ${sorted.slice(1).map(r => r.id).join(", ")}`);
    }
  }

  if (toDelete.length === 0) {
    console.log("\n✅  No duplicates found. Database is clean!");
    return;
  }

  // 3. Delete duplicates
  const delRes = await fetch(
    `${SUPABASE_URL}/rest/v1/routes?id=in.(${toDelete.map((id) => `"${id}"`).join(",")})`,
    {
      method: "DELETE",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
    }
  );

  if (!delRes.ok) {
    const err = await delRes.json();
    console.error("\n❌  Error deleting:", err);
    return;
  }

  const deleted = await delRes.json();
  console.log(`\n✅  Removed ${deleted.length} duplicate route(s).`);
}

cleanup();
