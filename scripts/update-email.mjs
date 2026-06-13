import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://injscuwpllomtdaixkuo.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanNjdXdwbGxvbXRkYWl4a3VvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDgyMDczOSwiZXhwIjoyMDk2Mzk2NzM5fQ.JtO0Fa817ogyXB_RTtyCggr01kkXLLQTI6aw0Fc6z1Y";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log("Updating email in company_settings to hello@lomboktransfer.com...");
  
  // We expect only 1 row in company_settings, so we can just update all of them or the one with id=1
  const { data, error } = await supabase
    .from('company_settings')
    .update({ email: 'hello@lomboktransfer.com' })
    .eq('id', 1); // Assuming id is 1

  if (error) {
    // If id=1 is not correct, let's just update all rows (since it's a singleton pattern table)
    const { data: d2, error: e2 } = await supabase
        .from('company_settings')
        .update({ email: 'hello@lomboktransfer.com' })
        .neq('id', 0); // Updates everything
    
    if (e2) {
        console.error("Error updating email:", e2);
    } else {
        console.log("Successfully updated email in all rows!");
    }
  } else {
    console.log("Successfully updated email!");
  }
}

main();
