"use client";

import React from "react";

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

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <NotificationBell />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
