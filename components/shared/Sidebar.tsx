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
  DollarSign, 
  Heart, 
  Shield, 
  Store, 
  BarChart3, 
  Settings,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, route: "/" },
  { label: "Booking", icon: CalendarCheck, route: "/bookings" },
  { label: "Dispatch", icon: MapPin, route: "/dispatch" },
  { label: "Supir", icon: Users, route: "/drivers" },
  { label: "Armada", icon: Car, route: "/fleet" },
  { label: "Keuangan", icon: DollarSign, route: "/accounting" },
  { label: "CRM & Tamu", icon: Heart, route: "/crm" },
  { label: "Legal", icon: Shield, route: "/legal" },
  { label: "Vendor", icon: Store, route: "/vendors" },
  { label: "Laporan", icon: BarChart3, route: "/reports" },
  { label: "Pengaturan", icon: Settings, route: "/settings" },
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
          <Link href="/" className="flex items-center gap-2.5 font-bold text-base text-foreground truncate">
            {/* Compact gradient wordmark */}
            <span className="tracking-tight">Lombok Transfer</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center justify-center w-full">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-black">
              LT
            </span>
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
          const isActive = pathname === item.route || pathname.startsWith(item.route + "/");
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
