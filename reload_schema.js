require('dotenv').config({ path: '.env' });
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function reload() {
  console.log("Reloading schema cache...");
  const res = await fetch(`${SUPABASE_URL}/pg`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: "NOTIFY pgrst, 'reload schema';" }),
  });
  
  if (res.ok) {
    console.log("Schema cache reloaded successfully!");
  } else {
    console.error("Failed:", res.status, await res.text());
  }
}

reload();
