/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import BookingTable from "@/components/bookings/BookingTable";
import BookingFilters from "@/components/bookings/BookingFilters";
import { Plus, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { generateCSV } from "@/lib/exports/csv-generator";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BookingsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select("id, pickup_datetime, status, total_price, source, notes, guests(full_name, phone), routes(name), drivers(full_name), vehicles(plate_number)")
        .order("pickup_datetime", { ascending: false });

      if (error) throw error;

      const rows = (data || []).map((b: any) => ({
        "No. Booking": b.id.substring(0, 8).toUpperCase(),
        "Tanggal & Waktu": b.pickup_datetime
          ? format(new Date(b.pickup_datetime), "dd/MM/yyyy HH:mm", { locale: id })
          : "-",
        "Nama Tamu": b.guests?.full_name || "-",
        "HP Tamu": b.guests?.phone || "-",
        "Rute": b.routes?.name || "Custom",
        "Supir": b.drivers?.full_name || "-",
        "Kendaraan": b.vehicles?.plate_number || "-",
        "Harga (IDR)": b.total_price || 0,
        "Sumber": b.source || "-",
        "Status": b.status || "-",
        "Catatan": b.notes || "",
      }));

      const filename = `bookings_export_${format(new Date(), "yyyyMMdd_HHmm")}`;
      generateCSV(rows, filename);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Gagal mengexport data. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daftar Booking" 
        subtitle="Kelola seluruh pesanan trip masuk, tugaskan supir, dan pantau status perjalanan."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportCSV}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting ? "Mengexport..." : "Export CSV"}
            </Button>
            <Link href="/bookings/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Booking Baru
              </Button>
            </Link>
          </>
        }
      />

      {/* Filters */}
      <BookingFilters />

      <BookingTable />
    </div>
  );
}
