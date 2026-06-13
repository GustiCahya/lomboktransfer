"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/public/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Banknote, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { createClient } from "@/lib/supabase/client";

// Destination images mapped by keyword in destination name
const DEST_IMAGES: Record<string, string> = {
  "gili":      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
  "bangsal":   "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop",
  "senggigi":  "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=600&auto=format&fit=crop",
  "kuta":      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600&auto=format&fit=crop",
  "mataram":   "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=600&auto=format&fit=crop",
  "mandalika": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
  "tetebatu":  "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=600&auto=format&fit=crop",
  "sembalun":  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
  "rinjani":   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
  "selong":    "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=600&auto=format&fit=crop",
  "sire":      "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=600&auto=format&fit=crop",
  "tour":      "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?q=80&w=600&auto=format&fit=crop",
};

function getDestImage(route: { name: string; destination: string }): string {
  const text = (route.name + " " + route.destination).toLowerCase();
  for (const [key, url] of Object.entries(DEST_IMAGES)) {
    if (text.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?q=80&w=600&auto=format&fit=crop";
}

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDuration(min: number | null) {
  if (!min) return null;
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

type Route = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  base_price: number;
  estimated_duration_min: number | null;
  is_active: boolean;
};

// Show only airport transfers on landing (most popular category)
const FEATURED_KEYWORDS = ["airport", "bil", "lombok airport"];

export default function PublicHomePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const supabase = createClient();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data } = await supabase
        .from("routes")
        .select("id, name, origin, destination, base_price, estimated_duration_min, is_active")
        .eq("is_active", true)
        .order("base_price", { ascending: true });
      if (data) {
        // Prefer routes from the airport, then inter-city, then tours
        const airport = data.filter((r) =>
          FEATURED_KEYWORDS.some((kw) => r.origin.toLowerCase().includes(kw))
        );
        // Take up to 6 airport routes for the homepage showcase
        setRoutes(airport.slice(0, 6));
      }
      setLoadingRoutes(false);
    };
    fetchRoutes();
  }, [supabase]);

  return (
    <>
      <HeroSection />

      {/* Popular Routes Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t["home.destinations.title"]}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t["home.destinations.subtitle"]}
              </p>
            </div>
            <Link href="/routes" className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-full shrink-0")}>
              {t["home.destinations.viewAll"]} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingRoutes ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <MapPin className="mx-auto mb-3 h-10 w-10 opacity-20" />
              <p>Routes coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                    <Image
                      src={getDestImage(route)}
                      alt={route.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Price badge */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-foreground shadow-sm">
                      <Banknote className="h-3 w-3 text-primary" />
                      {formatIDR(route.base_price)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    {/* Route Name — the star of the show */}
                    <h3 className="text-base font-bold text-foreground mb-1 leading-snug">
                      {route.name}
                    </h3>

                    {/* Origin → Destination detail */}
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {route.origin}
                    </p>
                    <p className="text-xs text-primary font-medium mb-4 flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {route.destination}
                    </p>

                    {/* Duration */}
                    {route.estimated_duration_min && (
                      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(route.estimated_duration_min)} transfer
                      </p>
                    )}

                    <Link
                      href={`/book?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}&route=${route.id}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "w-full rounded-full"
                      )}
                    >
                      {t["home.destinations.book"]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16">
            {t["home.how.title"]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border z-0" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">{t["home.how.step1.title"]}</h3>
              <p className="text-muted-foreground">{t["home.how.step1.desc"]}</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">{t["home.how.step2.title"]}</h3>
              <p className="text-muted-foreground">{t["home.how.step2.desc"]}</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">{t["home.how.step3.title"]}</h3>
              <p className="text-muted-foreground">{t["home.how.step3.desc"]}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
