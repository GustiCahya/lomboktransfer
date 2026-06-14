import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RoutesTableClient from "./RoutesTableClient";

import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 3600; // revalidate every hour

export default async function RoutesPage() {
  const supabase = createAdminClient();
  const { data: dbRoutes } = await supabase
    .from("routes")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const routesList = dbRoutes || [];
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Routes & Prices
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Price is per vehicle, not per person.
          </p>
        </div>

        <RoutesTableClient routes={routesList} />

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">Don&apos;t see your destination? We cover the whole island!</p>
          <Link href="https://wa.me/62817777480" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full gap-2")}>
            Chat with us on WhatsApp <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
