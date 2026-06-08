import React from "react";
import HeroSection from "@/components/public/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DESTINATIONS = [
  { name: "Gili Trawangan", time: "2h from BIL", price: "from IDR 500k", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600&auto=format&fit=crop" },
  { name: "Kuta Lombok", time: "30m from BIL", price: "from IDR 300k", image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600&auto=format&fit=crop" },
  { name: "Senggigi", time: "1.5h from BIL", price: "from IDR 250k", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=600&auto=format&fit=crop" },
];

export default function PublicHomePage() {
  return (
    <>
      <HeroSection />

      {/* Popular Destinations Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Popular Destinations</h2>
              <p className="text-muted-foreground text-lg">
                Direct transfers from Lombok International Airport (BIL) to the island's most beautiful spots.
              </p>
            </div>
            <Link href="/routes" className={cn(buttonVariants({ variant: "outline" }), "gap-2 rounded-full")}>
              View All Routes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DESTINATIONS.map((dest, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-foreground">
                    {dest.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> {dest.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success/50" /> {dest.time}
                  </p>
                  <Link href={`/book?destination=${encodeURIComponent(dest.name)}`} className={cn(buttonVariants({ size: "default" }), "w-full rounded-full group-hover:bg-primary transition-colors")}>
                    Book Transfer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border z-0" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Book Online</h3>
              <p className="text-muted-foreground">Select your route, date, and vehicle. Pay online or choose cash on arrival.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Get Confirmed</h3>
              <p className="text-muted-foreground">Receive instant confirmation and your driver's details via WhatsApp and email.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Enjoy the Ride</h3>
              <p className="text-muted-foreground">Your driver will be waiting at the airport arrivals with your name sign.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
