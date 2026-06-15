/**
 * Seeder to update prices and pax count
 */
const SUPABASE_URL = "https://injscuwpllomtdaixkuo.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanNjdXdwbGxvbXRkYWl4a3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyMDczOSwiZXhwIjoyMDk2Mzk2NzM5fQ.JtO0Fa817ogyXB_RTtyCggr01kkXLLQTI6aw0Fc6z1Y";

const HEADERS = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

async function updateDb() {
  // Fetch all existing routes
  const res = await fetch(`${SUPABASE_URL}/rest/v1/routes`, { headers: HEADERS });
  const routes = await res.json();
  
  for (const route of routes) {
    let newPrice = route.base_price;
    let newNotes = route.notes;
    
    // Adjust prices based on user requests
    const nameLower = route.name.toLowerCase();
    
    if (nameLower.includes("kuta lombok") && nameLower.includes("bangsal")) newPrice = 550000;
    if (nameLower.includes("kuta lombok") && nameLower.includes("selong belanak")) newPrice = 250000;
    if (nameLower.includes("lombok airport") && nameLower.includes("kuta lombok")) newPrice = 250000;
    if (nameLower.includes("lombok airport") && nameLower.includes("sembalun")) newPrice = 700000;
    
    // Replace pax
    if (newNotes && newNotes.includes("1–7 pax")) {
        newNotes = newNotes.replace("1–7 pax", "1–4 pax");
    }
    if (newNotes && newNotes.includes("1-7 pax")) {
        newNotes = newNotes.replace("1-7 pax", "1-4 pax");
    }
    
    // Update if changed
    if (newPrice !== route.base_price || newNotes !== route.notes) {
        await fetch(`${SUPABASE_URL}/rest/v1/routes?id=eq.${route.id}`, {
            method: "PATCH",
            headers: HEADERS,
            body: JSON.stringify({ base_price: newPrice, notes: newNotes })
        });
        console.log(`Updated [${route.id}] ${route.name}: ${newPrice}, ${newNotes}`);
    }
  }
  
  // Check if boat exists
  const boatName = "Boat Lombok → Gili T/Meno/Air";
  const hasBoat = routes.find(r => r.name === boatName || (r.name.toLowerCase().includes('boat') && r.name.toLowerCase().includes('gili')));
  if (!hasBoat) {
      const newRoute = {
          name: boatName,
          origin: "Lombok (Bangsal/Teluk Nare)",
          destination: "Gili Trawangan / Meno / Air",
          base_price: 450000,
          estimated_duration_min: 30,
          notes: "Private Boat (1–4 pax)",
          is_active: true
      };
      await fetch(`${SUPABASE_URL}/rest/v1/routes`, {
          method: "POST",
          headers: HEADERS,
          body: JSON.stringify([newRoute])
      });
      console.log(`Inserted new route: ${boatName}`);
  } else {
      console.log(`Boat route already exists: ${hasBoat.name}`);
  }
  console.log("Done");
}

updateDb().catch(console.error);
