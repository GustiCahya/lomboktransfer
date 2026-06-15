"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Map, Clock, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import SearchableCurrencyDropdown from "@/components/shared/SearchableCurrencyDropdown";

// Definisi tipe data sesuai struktur tabel database Supabase
interface TourItem {
  id: string;
  title: string;
  duration: string;
  base_price: number;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface ToursPageClientProps {
  tours: TourItem[];
}

export default function ToursPageClient({ tours }: ToursPageClientProps) {
  const {
    currency,
    setCurrency,
    formatPrice,
    availableCurrencies,
    isLoading: isCurrencyLoading,
  } = useCurrencyConverter();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header + Currency Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Discover Lombok
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Experience the best of the island with our private, fully
              customizable day tours guided by passionate locals.
            </p>
          </div>

          <div className="shrink-0">
            <SearchableCurrencyDropdown
              currency={currency}
              setCurrency={setCurrency}
              availableCurrencies={availableCurrencies}
              disabled={isCurrencyLoading}
            />
          </div>
        </div>

        {/* Tour Cards */}
        {tours.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tours available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                  {tour.image_url ? (
                    <Image
                      src={tour.image_url}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Map className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-foreground">
                    from {formatPrice(tour.base_price)}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2 flex items-start gap-2">
                    <Map className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    {tour.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> {tour.duration}
                  </p>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    {tour.description || "No description available."}
                  </p>
                  <Link
                    href={`https://wa.me/62817777480?text=Hi! I'm interested in booking the ${encodeURIComponent(tour.title)} tour.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ size: "default" }),
                      "w-full rounded-full group-hover:bg-primary transition-colors gap-2"
                    )}
                  >
                    Book Tour <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Currency Footnote */}
        {currency !== "IDR" && (
          <p className="text-xs text-muted-foreground mt-8 text-center italic">
            * Prices in {currency} are estimates based on current exchange rates
            and may vary depending on your bank&apos;s fees.
          </p>
        )}

        {/* Custom Tours CTA */}
        <div className="mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10">
          <Star className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Custom Tours Available</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have a specific itinerary in mind? We can create a custom tour just
            for you. Contact us to plan your perfect day in Lombok.
          </p>
          <Link
            href="https://wa.me/62817777480"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
          >
            Plan Custom Tour
          </Link>
        </div>
      </div>
    </div>
  );
}