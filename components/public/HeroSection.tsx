"use client";

import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Star, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { IMAGES } from "@/lib/constants/images";

export default function HeroSection() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="relative min-h-[90vh] flex items-center pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Image / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/20 z-0" />
      <div
        className="absolute inset-0 z-[-1] opacity-30 bg-cover bg-center"
        style={{ backgroundImage: `url('${IMAGES.HERO_BACKGROUND}')` }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span>{t["hero.trust"]}</span>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-tight mb-6">
          {t["hero.title"]} <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
            {t["hero.title2"]}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          {t["hero.subtitle"]}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-lg hover:shadow-primary/25 transition-all gap-2")}>
            {t["hero.book"]} <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/routes" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-md border-border/50")}>
            {t["hero.routes"]}
          </Link>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full max-w-4xl border-t border-border/50 pt-10">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">{t["hero.feature1.title"]}</h3>
            <p className="text-sm text-muted-foreground">{t["hero.feature1.desc"]}</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">{t["hero.feature2.title"]}</h3>
            <p className="text-sm text-muted-foreground">{t["hero.feature2.desc"]}</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground">{t["hero.feature3.title"]}</h3>
            <p className="text-sm text-muted-foreground">{t["hero.feature3.desc"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
