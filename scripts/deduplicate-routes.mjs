/**
 * Script: Deduplicate Routes
 * Removes duplicate routes from the Supabase `routes` table.
 *
 * Duplicate detection strategy (in priority order):
 *   1. Same `name`  (case-insensitive, trimmed)
 *   2. Same `origin` + `destination` pair (case-insensitive, trimmed)
 *
 * Keep policy: for each group of duplicates, keep the row with the
 *   LOWEST `created_at` (oldest / original record). All newer
 *   copies will be deleted.
 *
 * Run:
 *   node scripts/deduplicate-routes.mjs
 *   node scripts/deduplicate-routes.mjs --dry-run   (preview only, no delete)
 */

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://injscuwpllomtdaixkuo.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanNjdXdwbGxvbXRkYWl4a3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyMDczOSwiZXhwIjoyMDk2Mzk2NzM5fQ.JtO0Fa817ogyXB_RTtyCggr01kkXLLQTI6aw0Fc6z1Y";

const DRY_RUN = process.argv.includes("--dry-run");
// ─────────────────────────────────────────────────────────────────────────────

const HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

/**
 * Fetch all routes from DB
 */
async function fetchAllRoutes() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/routes?select=id,name,origin,destination,base_price,created_at&order=created_at.asc`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  return res.json();
}

/**
 * Delete a list of route IDs from DB
 */
async function deleteRoutes(ids) {
  if (ids.length === 0) return [];
  const filter = ids.map((id) => `"${id}"`).join(",");
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/routes?id=in.(${filter})`,
    {
      method: "DELETE",
      headers: { ...HEADERS, Prefer: "return=representation" },
    }
  );
  if (!res.ok) throw new Error(`Delete failed: ${await res.text()}`);
  return res.json();
}

/**
 * Normalize a string for comparison
 */
function norm(str) {
  return (str ?? "").trim().toLowerCase();
}

/**
 * Find duplicates from a list of routes.
 * Returns an array of IDs to delete (keeping the oldest of each group).
 */
function findDuplicates(routes) {
  const visited = new Map(); // key -> kept route id
  const toDelete = [];

  for (const route of routes) {
    const keyName = `name::${norm(route.name)}`;
    const keyOD = `od::${norm(route.origin)}|||${norm(route.destination)}`;

    let isDup = false;

    if (visited.has(keyName)) {
      const keepId = visited.get(keyName);
      console.log(
        `  🔁 Duplicate NAME  → keep [${keepId}], delete [${route.id}]  "${route.name}"`
      );
      isDup = true;
    } else if (visited.has(keyOD)) {
      const keepId = visited.get(keyOD);
      console.log(
        `  🔁 Duplicate O→D   → keep [${keepId}], delete [${route.id}]  ${route.origin} → ${route.destination}`
      );
      isDup = true;
    }

    if (isDup) {
      toDelete.push(route.id);
    } else {
      // Register this route as the canonical one for both keys
      visited.set(keyName, route.id);
      visited.set(keyOD, route.id);
    }
  }

  return toDelete;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("┌─────────────────────────────────────────────────────┐");
  console.log("│       Lombok Transfer – Route Deduplication         │");
  if (DRY_RUN) {
  console.log("│              ⚠️  DRY RUN MODE (no deletes)          │");
  }
  console.log("└─────────────────────────────────────────────────────┘\n");

  // 1. Fetch
  console.log("📡  Fetching routes from Supabase...");
  const routes = await fetchAllRoutes();
  console.log(`✅  ${routes.length} routes fetched.\n`);

  // 2. Print current state
  console.log("📋  Current routes (sorted by created_at ASC):\n");
  routes.forEach((r, i) =>
    console.log(
      `   ${String(i + 1).padStart(2, " ")}. [${r.id}]  ${r.name.padEnd(40, " ")} | ${r.origin} → ${r.destination}`
    )
  );

  // 3. Detect duplicates
  console.log("\n🔍  Scanning for duplicates...\n");
  const toDelete = findDuplicates(routes);

  if (toDelete.length === 0) {
    console.log("\n✅  No duplicates found. Your route database is clean!\n");
    return;
  }

  console.log(`\n🗑️  ${toDelete.length} duplicate(s) scheduled for deletion:\n`);
  toDelete.forEach((id) => console.log(`   • ${id}`));

  // 4. Delete (or skip if dry-run)
  if (DRY_RUN) {
    console.log("\n🚫  DRY RUN – no records were deleted.\n");
    console.log(
      "   Re-run without --dry-run flag to apply the changes:\n   node scripts/deduplicate-routes.mjs\n"
    );
    return;
  }

  console.log("\n⏳  Deleting duplicates...");
  const deleted = await deleteRoutes(toDelete);
  console.log(`\n✅  Done! ${deleted.length} duplicate route(s) removed.\n`);

  // 5. Print remaining routes
  const remaining = await fetchAllRoutes();
  console.log(`📋  Remaining routes (${remaining.length}):\n`);
  remaining.forEach((r, i) =>
    console.log(
      `   ${String(i + 1).padStart(2, " ")}. ${r.name.padEnd(40, " ")} | ${r.origin} → ${r.destination}`
    )
  );
  console.log("\n🎉  Deduplication complete!\n");
}

main().catch((err) => {
  console.error("\n❌  Error:", err.message);
  process.exit(1);
});
