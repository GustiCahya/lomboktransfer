"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "Database Tamu", href: "/crm" },
  { name: "Review Tracker", href: "/crm/reviews" },
  { name: "Re-engagement", href: "/crm/re-engagement" },
  { name: "💬 Live Chat AI", href: "/crm/live-chat" },
];

export default function CRMNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 border-b border-border pb-px overflow-x-auto">
      {items.map((item) => {
        // Special match for exactly /crm
        let isActive = false;
        if (item.href === "/crm") {
          isActive = pathname === "/crm" || (pathname.startsWith("/crm/") && !pathname.includes("/reviews") && !pathname.includes("/re-engagement") && !pathname.includes("/live-chat"));
        } else {
          isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        }
        
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
