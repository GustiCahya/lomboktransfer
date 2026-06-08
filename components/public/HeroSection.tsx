import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Star, ShieldCheck, Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Image / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/20 z-0" />
      <div
        className="absolute inset-0 z-[-1] opacity-30 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559628233-eb1b1a45564b?q=80&w=2000&auto=format&fit=crop')" }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span>Rated 4.9/5 by 1,000+ Travelers</span>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-tight mb-6">
          Lombok, <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
            Beautifully Delivered
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Premium 24/7 airport transfers and day tours with professional local drivers.
          Instant confirmation, comfortable vehicles, and zero hidden fees.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-lg hover:shadow-primary/25 transition-all gap-2")}>
            Book Your Transfer <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/routes" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-md border-border/50")}>
            View Routes & Prices
          </Link>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full max-w-4xl border-t border-border/50 pt-10">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">Professional Drivers</h3>
            <p className="text-sm text-muted-foreground">Licensed, English-speaking locals who know the island best.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">24/7 Availability</h3>
            <p className="text-sm text-muted-foreground">Early morning flights? Late arrivals? We're always ready.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">Instant Confirmation</h3>
            <p className="text-sm text-muted-foreground">Book online or via WhatsApp and get confirmed immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
