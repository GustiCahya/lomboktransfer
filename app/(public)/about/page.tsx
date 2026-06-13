import React from "react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 max-w-6xl mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Connecting You to <br />
              <span className="text-primary">Lombok&apos;s Wonders</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Lombok Transfer was born from a simple idea: that every journey on our beautiful island should begin and end with comfort, reliability, and local warmth.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We are a team of passionate local drivers who know every corner, hidden beach, and scenic route in Lombok. More than just a transport service, we consider ourselves your first local friend on the island.
            </p>
            <div className="flex gap-4">
              <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
                Book a Ride
              </Link>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop"
              alt="Lombok Island"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
