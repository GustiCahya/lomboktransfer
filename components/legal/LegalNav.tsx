"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "Dokumen Perusahaan", href: "/legal/company-docs" },
  { name: "Expiry Tracker", href: "/legal/expiry-tracker" },
  { name: "Kontrak Mitra", href: "/legal/contracts" },
  { name: "Kepatuhan Data", href: "/legal/data-compliance" },
];

export default function LegalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 border-b border-border pb-px overflow-x-auto">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap",
              isActive
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
