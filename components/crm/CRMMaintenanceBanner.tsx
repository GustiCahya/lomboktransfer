"use client";

import React from "react";
import { usePathname } from "next/navigation";
import MaintenanceBanner from "@/components/shared/MaintenanceBanner";

export default function CRMMaintenanceBanner() {
  const pathname = usePathname();

  // Exclude Database Tamu (/admin/crm and /admin/crm/guests)
  const isGuestDatabase =
    pathname === "/admin/crm" || pathname.startsWith("/admin/crm/guests");

  if (isGuestDatabase) return null;

  return <MaintenanceBanner className="mb-6" />;
}
