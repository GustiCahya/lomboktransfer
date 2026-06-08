"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Routes & Prices", href: "/routes" },
  { label: "Tours", href: "/tours" },
  { label: "About Us", href: "/about" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center">
            <Image
              src="/logo_without_text.png"
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
          <Button variant="ghost" size="sm" className="gap-2 text-foreground/80">
            <Globe className="h-4 w-4" />
            <span>EN</span>
          </Button>
          <Link href="/book" className={cn(buttonVariants({ size: "default" }), "rounded-full px-6 shadow-md hover:shadow-lg transition-all")}>
            Book Now
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
            <Button variant="outline" className="justify-center gap-2 w-full">
              <Globe className="h-4 w-4" />
              Language: English
            </Button>
            <Link href="/book" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full")}>
              Book Your Transfer
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
