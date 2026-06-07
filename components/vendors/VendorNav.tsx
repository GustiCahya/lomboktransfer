"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { name: "Direktori Vendor", href: "/vendors" },
  { name: "Hotel & Travel Partner", href: "/vendors/partners" },
  { name: "Purchase Order (PO)", href: "/vendors/purchase-orders" },
];

export default function VendorNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-2 border-b border-border pb-px overflow-x-auto">
      {items.map((item) => {
        // Special match for exactly /vendors
        let isActive = false;
        if (item.href === "/vendors") {
          isActive = pathname === "/vendors" || (pathname.startsWith("/vendors/") && !pathname.includes("/partners") && !pathname.includes("/purchase-orders"));
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
