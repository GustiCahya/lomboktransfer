"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, Language } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV_LINKS = [
    { label: t["header.home"], href: "/" },
    { label: t["header.routes"], href: "/routes" },
    { label: t["header.tours"], href: "/tours" },
    { label: t["header.about"], href: "/about" },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-background/60 backdrop-blur-md border-b border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Lombok Transfer"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Lombok Transfer
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 text-foreground/80 cursor-pointer outline-none")}>
              <Globe className="h-4 w-4" />
              <span className="uppercase">{language}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                English (EN)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("id")}>
                Bahasa Indonesia (ID)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>
                中文 (ZH)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/book" className={cn(buttonVariants({ size: "default" }), "rounded-full px-6 shadow-md hover:shadow-lg transition-all")}>
            {t["header.book"]}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-background z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-6 text-lg font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "py-2 border-b border-border/50 transition-colors",
                  pathname === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex gap-2 justify-center pb-4 border-b">
              <button onClick={() => handleLanguageChange('en')} className={cn(buttonVariants({ variant: language === 'en' ? 'default' : 'outline', size: 'sm' }))}>EN</button>
              <button onClick={() => handleLanguageChange('id')} className={cn(buttonVariants({ variant: language === 'id' ? 'default' : 'outline', size: 'sm' }))}>ID</button>
              <button onClick={() => handleLanguageChange('zh')} className={cn(buttonVariants({ variant: language === 'zh' ? 'default' : 'outline', size: 'sm' }))}>ZH 中文</button>
            </div>
            <Link href="/book" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full")}>
              {t["header.book"]}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
