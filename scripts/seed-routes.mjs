/**
 * Seed Script: Lombok Transfer Routes
 * Run: node scripts/seed-routes.mjs
 *
 * Seeds comprehensive route data into the Supabase `routes` table.
 * Uses UPSERT so it's safe to run multiple times.
 */

const SUPABASE_URL = "https://injscuwpllomtdaixkuo.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanNjdXdwbGxvbXRkYWl4a3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyMDczOSwiZXhwIjoyMDk2Mzk2NzM5fQ.JtO0Fa817ogyXB_RTtyCggr01kkXLLQTI6aw0Fc6z1Y";

const routes = [
  // ── FROM BANDARA INTERNASIONAL LOMBOK (BIL) ────────────────────────────────
  {
    name: "BIL → Mataram",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Mataram",
    base_price: 315000,
    estimated_duration_min: 30,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Senggigi",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Senggigi",
    base_price: 375000,
    estimated_duration_min: 50,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Kuta Lombok",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Kuta Lombok",
    base_price: 315000,
    estimated_duration_min: 30,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Mandalika",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Mandalika (Sirkuit)",
    base_price: 315000,
    estimated_duration_min: 30,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Bangsal (Gili area)",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Bangsal (area Gili Trawangan)",
    base_price: 465000,
    estimated_duration_min: 90,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Tetebatu",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Tetebatu",
    base_price: 450000,
    estimated_duration_min: 75,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Sembalun",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Sembalun (Rinjani)",
    base_price: 550000,
    estimated_duration_min: 120,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Selong Belanak",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Selong Belanak",
    base_price: 375000,
    estimated_duration_min: 60,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "BIL → Sire / Gili Meno Pier",
    origin: "Bandara Internasional Lombok (BIL)",
    destination: "Sire / Gili Meno Pier",
    base_price: 450000,
    estimated_duration_min: 80,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  // ── INTER-CITY ROUTES ──────────────────────────────────────────────────────
  {
    name: "Senggigi → Bangsal (Gili area)",
    origin: "Senggigi",
    destination: "Bangsal (area Gili Trawangan)",
    base_price: 200000,
    estimated_duration_min: 45,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "Mataram → Kuta Lombok",
    origin: "Mataram",
    destination: "Kuta Lombok",
    base_price: 250000,
    estimated_duration_min: 45,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "Mataram → Senggigi",
    origin: "Mataram",
    destination: "Senggigi",
    base_price: 175000,
    estimated_duration_min: 30,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "Kuta Lombok → Selong Belanak",
    origin: "Kuta Lombok",
    destination: "Selong Belanak",
    base_price: 200000,
    estimated_duration_min: 40,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  {
    name: "Kuta Lombok → Bangsal (Gili area)",
    origin: "Kuta Lombok",
    destination: "Bangsal (area Gili Trawangan)",
    base_price: 400000,
    estimated_duration_min: 90,
    notes: "Sedan/MPV (1–7 pax)",
    is_active: true,
  },
  // ── DAY TOURS ─────────────────────────────────────────────────────────────
  {
    name: "Day Tour Paket Full Day",
    origin: "Custom (Hotel/Penginapan Tamu)",
    destination: "Custom",
    base_price: 1000000,
    estimated_duration_min: 480,
    notes: "Max 8 jam • 1 destinasi bebas pilih",
    is_active: true,
  },
  {
    name: "Day Tour Rinjani Trekking Transfer",
    origin: "Custom (Hotel/Penginapan Tamu)",
    destination: "Sembalun / Senaru (Rinjani Gate)",
    base_price: 550000,
    estimated_duration_min: 120,
    notes: "Drop off ke gerbang Rinjani",
    is_active: true,
  },
];

async function seed() {
  console.log(`🌱  Seeding ${routes.length} routes into Supabase...\n`);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      // Upsert on name – jika nama sudah ada, skip (do nothing)
      Prefer: "resolution=ignore-duplicates,return=representation",
    },
    body: JSON.stringify(routes),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("❌  Supabase error:", JSON.stringify(err, null, 2));
    process.exit(1);
  }

  const inserted = await res.json();
  console.log(`✅  Done! ${inserted.length} routes inserted/skipped.`);
  inserted.forEach((r) =>
    console.log(`   • [${r.id}] ${r.name} – IDR ${Number(r.base_price).toLocaleString("id-ID")}`)
  );
}

seed();
