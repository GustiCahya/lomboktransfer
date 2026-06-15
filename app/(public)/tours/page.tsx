import type { Metadata } from "next";
import ToursPageClient from "./ToursPageClient";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Revalidasi data otomatis setiap jam

export const metadata: Metadata = {
  title: "Day Tours in Lombok",
  description:
    "Discover Lombok with private, fully customizable day tours. Waterfalls, Rinjani trekking transfers, Sasak village, Gili Islands snorkeling & more - guided by passionate locals.",
  openGraph: {
    title: "Day Tours in Lombok | Lombok Transfer",
    description:
      "Private, customizable day tours in Lombok: waterfalls, Gili Islands, Sasak villages & more.",
    url: "https://lomboktransfer.com/tours",
  },
  alternates: { canonical: "https://lomboktransfer.com/tours" },
};

export default async function ToursPage() {
  const supabase = createAdminClient();
  
  // Mengambil data dari tabel "tours"
  const { data: dbTours } = await supabase
    .from("tours")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const toursList = dbTours || [];

  return <ToursPageClient tours={toursList} />;
}