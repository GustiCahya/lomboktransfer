"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Pendapatan", href: "/accounting/revenue" },
  { name: "Pengeluaran", href: "/accounting/expenses" },
  { name: "Invoice", href: "/accounting/invoices" },
  { name: "Payroll", href: "/accounting/payroll" },
  { name: "Rekonsiliasi OTA", href: "/accounting/ota-reconciliation" },
  { name: "P&L", href: "/accounting/pnl" },
  { name: "Arus Kas", href: "/accounting/cashflow" },
];

export default function AccountingNav() {
  const pathname = usePathname();

  return (
    <div className="scrollbar-hide overflow-x-auto pb-2">
      <nav className="flex space-x-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
