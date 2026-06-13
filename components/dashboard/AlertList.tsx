/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Clock, FileText, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AlertItem {
  id: string;
  type: "document" | "service" | "pending_assign";
  title: string;
  description: string;
  severity: "high" | "medium";
  link: string;
}

export default function AlertList() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      const newAlerts: AlertItem[] = [];

      // 1. Pending Assign Bookings
      const { data: pendingBookings } = await supabase
        .from("bookings")
        .select("id, booking_code, guests(full_name)")
        .eq("status", "confirmed")
        .is("driver_id", null)
        .limit(3);

      if (pendingBookings && pendingBookings.length > 0) {
        pendingBookings.forEach(b => {
          newAlerts.push({
            id: `pending-${b.id}`,
            type: "pending_assign",
            title: "Booking Menunggu Supir",
            description: `Kode: ${b.booking_code} atas nama ${(b.guests as any)?.full_name}`,
            severity: "high",
            link: `/bookings/${b.id}`,
          });
        });
      }

      // 2. Expiring Driver Documents (mock check)
      const threshold = new Date();
      threshold.setDate(threshold.getDate() + 14);
      const { data: expDocs } = await supabase
        .from("driver_documents")
        .select("id, doc_type, drivers(id, full_name)")
        .lte("expiry_date", threshold.toISOString())
        .limit(3);

      if (expDocs && expDocs.length > 0) {
        expDocs.forEach(d => {
          newAlerts.push({
            id: `doc-${d.id}`,
            type: "document",
            title: "Dokumen Supir Akan Habis",
            description: `${d.doc_type.toUpperCase()} milik ${(d.drivers as any)?.full_name}`,
            severity: "medium",
            link: `/drivers/${(d.drivers as any)?.id}`,
          });
        });
      }

      setAlerts(newAlerts);
      setIsLoading(false);
    };

    fetchAlerts();
  }, [supabase]);

  if (isLoading) {
    return <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">Menganalisa alert...</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center border border-dashed rounded-md bg-green-50/50 dark:bg-green-950/10">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 text-green-600 rounded-full flex items-center justify-center mb-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <p className="text-green-700 dark:text-green-400 text-sm font-medium">Semua aman terkendali</p>
        <p className="text-muted-foreground text-xs mt-1">Tidak ada isu prioritas saat ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <Link key={alert.id} href={alert.link}>
          <div className="flex items-start gap-3 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors group cursor-pointer">
            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              alert.severity === "high" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            }`}>
              {alert.type === "pending_assign" && <Clock className="w-4 h-4" />}
              {alert.type === "document" && <FileText className="w-4 h-4" />}
              {alert.type === "service" && <AlertTriangle className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate text-foreground">{alert.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{alert.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1.5" />
          </div>
        </Link>
      ))}
    </div>
  );
}
