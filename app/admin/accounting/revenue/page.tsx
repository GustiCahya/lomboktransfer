/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRevenue } from "@/hooks/useRevenue";
import RevenueSummary from "@/components/accounting/RevenueSummary";
import RevenueTable from "@/components/accounting/RevenueTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

export default function RevenuePage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [startDate, setStartDate] = useState(
    `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`
  );
  const [endDate, setEndDate] = useState(
    `${currentYear}-${String(currentMonth).padStart(2, "0")}-31`
  );
  const [source, setSource] = useState("");

  const { revenueList, isLoading } = useRevenue({ startDate, endDate, source: source || undefined });

  const handleExport = () => {
    const headers = ["Tanggal", "Booking", "Tamu", "Rute", "Sumber", "Gross", "Komisi OTA", "Nett", "Status"];
    const rows = revenueList.map((item: any) => {
      const otaCommission = ["klook", "viator", "traveloka"].includes(item.source)
        ? item.gross_price * 0.2
        : 0;
      return [
        new Date(item.pickup_datetime).toLocaleDateString("id-ID"),
        item.booking_code,
        item.guests?.full_name || "-",
        item.routes?.name || "-",
        item.source,
        item.gross_price,
        otaCommission,
        item.gross_price - otaCommission,
        item.payment_status,
      ];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pendapatan-${startDate}-${endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label>Dari Tanggal</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-44"
          />
        </div>
        <div className="space-y-2">
          <Label>Hingga Tanggal</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-44"
          />
        </div>
        <div className="space-y-2">
          <Label>Sumber</Label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="flex h-9 w-40 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">Semua</option>
            <option value="direct">Direct</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="klook">Klook</option>
            <option value="viator">Viator</option>
            <option value="traveloka">Traveloka</option>
          </select>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <RevenueSummary revenueList={revenueList} />

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Memuat data pendapatan...
        </div>
      ) : (
        <RevenueTable revenueList={revenueList} />
      )}
    </div>
  );
}
