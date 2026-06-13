/**
 * Script: Translate & Normalize Route Names to English
 *
 * Updates all routes in the DB:
 *   - name   → English, formatted as "Origin → Destination"
 *   - origin → English full name
 *   - destination → English full name
 *
 * Run:
 *   node scripts/translate-routes.mjs
 *   node scripts/translate-routes.mjs --dry-run   (preview only)
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

// ── Translation map ───────────────────────────────────────────────────────────
// Key: old route name (case-insensitive match via norm())
// Value: { name, origin, destination, notes? }
//
// "name" is the canonical English display name shown to customers.
// Format: "<Origin Short> → <Destination>"
// ─────────────────────────────────────────────────────────────────────────────
const ROUTE_UPDATES = [
  // ── FROM LOMBOK INTERNATIONAL AIRPORT ──────────────────────────────────────
  {
    matchName: "BIL → Mataram",
    name: "Lombok Airport → Mataram",
    origin: "Lombok International Airport (BIL)",
    destination: "Mataram City",
    notes: "Sedan / MPV (1–7 pax) · ~30 min",
  },
  {
    matchName: "BIL → Senggigi",
    name: "Lombok Airport → Senggigi",
    origin: "Lombok International Airport (BIL)",
    destination: "Senggigi",
    notes: "Sedan / MPV (1–7 pax) · ~50 min",
  },
  {
    matchName: "BIL → Kuta Lombok",
    name: "Lombok Airport → Kuta Lombok",
    origin: "Lombok International Airport (BIL)",
    destination: "Kuta Lombok",
    notes: "Sedan / MPV (1–7 pax) · ~30 min",
  },
  {
    matchName: "BIL → Mandalika",
    name: "Lombok Airport → Mandalika Circuit",
    origin: "Lombok International Airport (BIL)",
    destination: "Mandalika International Circuit",
    notes: "Sedan / MPV (1–7 pax) · ~30 min",
  },
  {
    matchName: "BIL → Bangsal (Gili area)",
    name: "Lombok Airport → Bangsal (Gili Islands)",
    origin: "Lombok International Airport (BIL)",
    destination: "Bangsal Pier (Gili Islands)",
    notes: "Sedan / MPV (1–7 pax) · ~90 min",
  },
  {
    matchName: "BIL → Tetebatu",
    name: "Lombok Airport → Tetebatu",
    origin: "Lombok International Airport (BIL)",
    destination: "Tetebatu Village",
    notes: "Sedan / MPV (1–7 pax) · ~75 min",
  },
  {
    matchName: "BIL → Sembalun",
    name: "Lombok Airport → Sembalun (Rinjani Gate)",
    origin: "Lombok International Airport (BIL)",
    destination: "Sembalun (Rinjani National Park Gate)",
    notes: "Sedan / MPV (1–7 pax) · ~120 min",
  },
  {
    matchName: "BIL → Selong Belanak",
    name: "Lombok Airport → Selong Belanak",
    origin: "Lombok International Airport (BIL)",
    destination: "Selong Belanak Beach",
    notes: "Sedan / MPV (1–7 pax) · ~60 min",
  },
  {
    matchName: "BIL → Sire / Gili Meno Pier",
    name: "Lombok Airport → Sire / Gili Meno Pier",
    origin: "Lombok International Airport (BIL)",
    destination: "Sire / Gili Meno Pier",
    notes: "Sedan / MPV (1–7 pax) · ~80 min",
  },

  // ── INTER-CITY ──────────────────────────────────────────────────────────────
  {
    matchName: "Senggigi → Bangsal (Gili area)",
    name: "Senggigi → Bangsal (Gili Islands)",
    origin: "Senggigi",
    destination: "Bangsal Pier (Gili Islands)",
    notes: "Sedan / MPV (1–7 pax) · ~45 min",
  },
  {
    matchName: "Senggigi → Gili (via Bangsal)",
    name: "Senggigi → Gili Islands (via Bangsal)",
    origin: "Senggigi",
    destination: "Gili Islands (via Bangsal Pier)",
    notes: "Sedan / MPV (1–7 pax) · ~45 min",
  },
  {
    matchName: "Mataram → Kuta Lombok",
    name: "Mataram → Kuta Lombok",
    origin: "Mataram City",
    destination: "Kuta Lombok",
    notes: "Sedan / MPV (1–7 pax) · ~45 min",
  },
  {
    matchName: "Mataram → Senggigi",
    name: "Mataram → Senggigi",
    origin: "Mataram City",
    destination: "Senggigi",
    notes: "Sedan / MPV (1–7 pax) · ~30 min",
  },
  {
    matchName: "Kuta Lombok → Selong Belanak",
    name: "Kuta Lombok → Selong Belanak",
    origin: "Kuta Lombok",
    destination: "Selong Belanak Beach",
    notes: "Sedan / MPV (1–7 pax) · ~40 min",
  },
  {
    matchName: "Kuta Lombok → Bangsal (Gili area)",
    name: "Kuta Lombok → Bangsal (Gili Islands)",
    origin: "Kuta Lombok",
    destination: "Bangsal Pier (Gili Islands)",
    notes: "Sedan / MPV (1–7 pax) · ~90 min",
  },

  // ── DAY TOURS ──────────────────────────────────────────────────────────────
  {
    matchName: "Day Tour Paket Full Day",
    name: "Private Full-Day Tour",
    origin: "Guest Accommodation (Hotel / Villa)",
    destination: "Custom Destinations",
    notes: "Up to 8 hours · 1 destination of your choice",
  },
  {
    matchName: "Day Tour Paket (Full Day)",
    name: "Full-Day Tour Package",
    origin: "On Request",
    destination: "Custom Destinations",
    notes: "Up to 8 hours · flexible itinerary",
  },
  {
    matchName: "Day Tour Rinjani Trekking Transfer",
    name: "Rinjani Trekking Transfer",
    origin: "Guest Accommodation (Hotel / Villa)",
    destination: "Sembalun / Senaru (Rinjani Gate)",
    notes: "Drop-off at Rinjani National Park gate",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

function norm(str) {
  return (str ?? "").trim().toLowerCase();
}

async function fetchAllRoutes() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/routes?select=id,name,origin,destination,notes&order=created_at.asc`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  return res.json();
}

async function updateRoute(id, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/routes?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Update failed for ${id}: ${await res.text()}`);
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("┌──────────────────────────────────────────────────────────┐");
  console.log("│   Lombok Transfer – Translate & Normalize Route Names    │");
  if (DRY_RUN)
  console.log("│              ⚠️  DRY RUN MODE (no changes applied)      │");
  console.log("└──────────────────────────────────────────────────────────┘\n");

  console.log("📡  Fetching current routes...");
  const routes = await fetchAllRoutes();
  console.log(`✅  ${routes.length} routes found.\n`);

  let updated = 0;
  let skipped = 0;
  let unmatched = [];

  for (const route of routes) {
    const mapping = ROUTE_UPDATES.find(
      (m) => norm(m.matchName) === norm(route.name)
    );

    if (!mapping) {
      console.log(`⚠️   No mapping for: "${route.name}" — skipping`);
      unmatched.push(route.name);
      skipped++;
      continue;
    }

    const payload = {
      name: mapping.name,
      origin: mapping.origin,
      destination: mapping.destination,
      ...(mapping.notes !== undefined && { notes: mapping.notes }),
    };

    console.log(`🔄  [${route.id}]`);
    console.log(`    OLD: "${route.name}"  |  ${route.origin} → ${route.destination}`);
    console.log(`    NEW: "${payload.name}"  |  ${payload.origin} → ${payload.destination}`);

    if (!DRY_RUN) {
      await updateRoute(route.id, payload);
      console.log(`    ✅  Updated.\n`);
    } else {
      console.log(`    🚫  DRY RUN – not applied.\n`);
    }
    updated++;
  }

  console.log("─────────────────────────────────────────────────────────────");
  console.log(`📊  Summary:`);
  console.log(`    • Updated : ${updated}`);
  console.log(`    • Skipped : ${skipped} (no mapping found)`);
  if (unmatched.length > 0) {
    console.log(`\n⚠️   Unmatched routes (add to ROUTE_UPDATES if needed):`);
    unmatched.forEach((n) => console.log(`    • "${n}"`));
  }
  if (DRY_RUN) {
    console.log(`\n🚫  DRY RUN – no changes applied.`);
    console.log(`    Re-run without --dry-run to apply:\n    node scripts/translate-routes.mjs\n`);
  } else {
    console.log(`\n🎉  Translation complete!\n`);
  }
}

main().catch((err) => {
  console.error("\n❌  Error:", err.message);
  process.exit(1);
});
