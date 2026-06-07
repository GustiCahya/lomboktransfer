"use client";

import React from "react";
import { Search } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-card border-b border-border shadow-sm">
      {/* Left side: Breadcrumb & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Breadcrumb />
      </div>

      {/* Center: Search (Optional) */}
      <div className="flex-1 max-w-md hidden md:flex items-center relative">
        <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Cari... (Cmd+K)" 
          className="w-full h-9 pl-9 pr-4 text-sm bg-muted rounded-md border border-transparent focus:bg-background focus:border-ring outline-none transition-colors"
        />
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
