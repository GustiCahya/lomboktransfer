"use client";

import React from "react";
import Link from "next/link";
import { MapPin, CheckCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import SearchableCurrencyDropdown from "@/components/shared/SearchableCurrencyDropdown";

type RouteItem = {
  id: string;
  origin: string;
  destination: string;
  notes: string | null;
  estimated_duration_min: number | null;
  base_price: number;
};

export default function RoutesTableClient({ routes }: { routes: RouteItem[] }) {
  const { currency, setCurrency, formatPrice, availableCurrencies, isLoading } = useCurrencyConverter();

  const formatDuration = (mins: number | null) => {
    if (!mins) return "Flexible";
    if (mins < 60) return `${mins} mins`;
    const hours = mins / 60;
    if (mins % 60 === 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${Math.floor(hours)}h ${mins % 60}m`;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-foreground">Available Routes</h2>
        <SearchableCurrencyDropdown 
          currency={currency} 
          setCurrency={setCurrency} 
          availableCurrencies={availableCurrencies} 
          disabled={isLoading} 
        />
      </div>

      {/* Pricing Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-3">All Transfers Include:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" /> Private air-conditioned vehicle</li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" /> Professional English-speaking driver</li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" /> Fuel, parking, and toll fees</li>
            <li className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" /> Airport Meet & Greet with name sign</li>
          </ul>
        </div>
        <div className="p-4 bg-background rounded-xl border border-border shadow-sm text-sm text-muted-foreground w-full md:w-auto shrink-0">
          * 20% surcharge applies for pickups between 23:00 - 05:00
        </div>
      </div>

      {/* Mobile Pricing Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {routes.map((route) => (
          <div key={route.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-foreground leading-tight">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <span>{route.origin} &rarr; {route.destination}</span>
            </div>
            
            <div className="flex flex-col gap-1 text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium text-foreground">{route.notes || "Standard (1-4 pax)"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Est. Time:</span>
                <span className="font-medium text-foreground">{formatDuration(route.estimated_duration_min)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-1">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">Price starting from</span>
                <span className="text-xl font-bold text-foreground leading-none">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(route.base_price)}
                </span>
                {currency !== "IDR" && (
                  <span className="font-semibold text-primary/90 mt-1">
                    {formatPrice(route.base_price)}
                  </span>
                )}
              </div>
              <Link
                href={`/book?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`}
                className={cn(buttonVariants({ size: "default" }), "rounded-full px-6")}
              >
                Book
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Pricing Table */}
      <div className="hidden md:block bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-semibold text-foreground">Route</th>
                <th className="p-4 font-semibold text-foreground">Vehicle</th>
                <th className="p-4 font-semibold text-foreground">Est. Time</th>
                <th className="p-4 font-semibold text-foreground text-right">Price (IDR)</th>
                {currency !== "IDR" && <th className="p-4 font-semibold text-foreground text-right">Price ({currency})</th>}
                <th className="p-4 font-semibold text-foreground text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {routes.map((route) => {
                return (
                  <tr key={route.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span>{route.origin} &rarr; {route.destination}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">{route.notes || "Standard (1-4 pax)"}</td>
                    <td className="p-4 text-muted-foreground text-sm">{formatDuration(route.estimated_duration_min)}</td>
                    <td className="p-4 text-right font-bold text-foreground">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(route.base_price)}
                    </td>
                    {currency !== "IDR" && (
                      <td className="p-4 text-right font-bold text-primary/90">
                        {formatPrice(route.base_price)}
                      </td>
                    )}
                    <td className="p-4 text-center">
                      <Link
                        href={`/book?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`}
                        className={cn(buttonVariants({ size: "sm" }), "rounded-full")}
                      >
                        Book
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {currency !== "IDR" && (
        <p className="text-xs text-muted-foreground mt-3 text-right italic">
          * Prices in {currency} are estimates based on current exchange rates and may vary slightly depending on your bank&apos;s conversion fees.
        </p>
      )}
    </>
  );
}
