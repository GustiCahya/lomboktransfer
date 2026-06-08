"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "Database Tamu", href: "/admin/crm" },
  { name: "Review Tracker", href: "/admin/crm/reviews" },
  { name: "Re-engagement", href: "/admin/crm/re-engagement" },
  { name: "💬 Live Chat AI", href: "/admin/crm/live-chat" },
];

export default function CRMNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 border-b border-border pb-px overflow-x-auto">
      {items.map((item) => {
        // Special match for exactly /admin/crm
        let isActive = false;
        if (item.href === "/admin/crm") {
          isActive = pathname === "/admin/crm" || (pathname.startsWith("/admin/crm/") && !pathname.includes("/admin/crm/reviews") && !pathname.includes("/admin/crm/re-engagement") && !pathname.includes("/admin/crm/live-chat"));
        } else {
          isActive = pathname === item.href || pathname.startsWith("/admin/" + item.href + "/");
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
