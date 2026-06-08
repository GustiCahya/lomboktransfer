import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
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
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              Lombok's premier private airport transfer and tour service.
              Connecting you to the island's beauty with comfort and reliability.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Instagram
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Facebook
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Twitter
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="routes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Routes & Pricing</Link></li>
              <li><Link href="tours" className="text-sm text-muted-foreground hover:text-primary transition-colors">Day Tours</Link></li>
              <li><Link href="blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Travel Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">
                <span className="block font-medium text-foreground mb-1">WhatsApp (24/7)</span>
                <a href="https://wa.me/6281234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  +62 812-3456-7890
                </a>
              </li>
              <li className="text-sm text-muted-foreground mt-4">
                <span className="block font-medium text-foreground mb-1">Email</span>
                <a href="mailto:hello@lomboktransfer.com" className="hover:text-primary transition-colors">
                  hello@lomboktransfer.com
                </a>
              </li>
              <li className="text-sm text-muted-foreground mt-4">
                <span className="block font-medium text-foreground mb-1">Office</span>
                Jl. Pariwisata Senggigi, Lombok Barat, NTB, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} PT Lombok Transfer Pariwisata. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Powered by Local Drivers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
