"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  MapPin,
  Users,
  Car,
  Banknote,
  Heart,
  Shield,
  Store,
  BarChart3,
  Settings,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/admin" },
  { label: "Booking", icon: CalendarCheck, route: "/admin/bookings" },
  { label: "Dispatch", icon: MapPin, route: "/admin/dispatch" },
  { label: "Supir", icon: Users, route: "/admin/drivers" },
  { label: "Armada", icon: Car, route: "/admin/fleet" },
  { label: "Keuangan", icon: Banknote, route: "/admin/accounting" },
  { label: "CRM & Tamu", icon: Heart, route: "/admin/crm" },
  { label: "Legal", icon: Shield, route: "/admin/legal" },
  { label: "Vendor", icon: Store, route: "/admin/vendors" },
  { label: "Laporan", icon: BarChart3, route: "/admin/reports" },
  { label: "Pengaturan", icon: Settings, route: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("sidebar_collapsed");
    if (stored === "true") setIsCollapsed(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar_collapsed", String(newState));
  };

  if (!isMounted) return null;

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out h-full",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        {!isCollapsed ? (
          <Link href="/admin" className="flex items-center gap-2.5 font-bold text-base text-foreground truncate">
            <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-border shadow-sm">
              <Image
                src="/logo.svg"
                alt="Lombok Transfer Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="tracking-tight">Lombok Transfer</span>
          </Link>
        ) : (
          <Link href="/admin" className="flex items-center justify-center w-full">
            <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-border shadow-sm">
              <Image
                src="/logo.svg"
                alt="Lombok Transfer Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full shadow-md z-10"
        aria-label="Toggle Sidebar"
      >
        <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = item.route === "/admin" ? pathname === "/admin" : pathname.startsWith(item.route);
          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info / Bottom Area placeholder */}
      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <div className="text-xs text-muted-foreground truncate">
            &copy; 2026 Lombok Transfer
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center">LT</div>
        )}
      </div>
    </aside>
  );
}
