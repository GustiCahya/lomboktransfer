"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, ArrowRightLeft, ShieldAlert, Map } from "lucide-react";

const TABS = [
  { label: "Kalender Dispatch", href: "/admin/dispatch", icon: Calendar },
  { label: "Manajemen Rute", href: "/admin/dispatch/routes", icon: ArrowRightLeft },
  { label: "Manajemen Paket Tour", href: "/admin/dispatch/tours", icon: Map },
  { label: "Conflict Resolution", href: "/admin/dispatch/conflicts", icon: ShieldAlert },
];

export default function DispatchLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-5">
      {/* Sub navigation tabs */}
      <div className="flex gap-1 border-b border-border/60 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/admin/dispatch"
              ? pathname === "/admin/dispatch"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
