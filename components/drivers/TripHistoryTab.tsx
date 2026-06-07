"use client";

import React, { useState } from "react";
import { useDriverTrips } from "@/hooks/useDrivers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/shared/StatusBadge";
import { StatusType } from "@/components/shared/StatusBadge";
import { formatRupiah, formatTanggalWaktu } from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/card";

interface TripHistoryTabProps {
  driverId: string;
}

export default function TripHistoryTab({ driverId }: TripHistoryTabProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { trips, isLoading } = useDriverTrips(driverId, { month, year });

  const totalRevenue = trips
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.gross_price as number || 0), 0);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString("id-ID", { month: "long" }),
  }));

  return (
    <div className="space-y-6">
      {/* Period picker */}
      <div className="flex items-center gap-3">
        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold">{trips.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Trip</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold">{trips.filter(t => t.status === "completed").length}</p>
          <p className="text-xs text-muted-foreground mt-1">Trip Selesai</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold text-primary">{formatRupiah(totalRevenue, true)}</p>
          <p className="text-xs text-muted-foreground mt-1">Pendapatan</p>
        </CardContent></Card>
      </div>

      {/* Trips table */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Memuat riwayat trip...</p>
      ) : trips.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">Tidak ada trip pada periode ini.</p>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Code</TableHead>
                <TableHead>Tamu</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Pendapatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id as string}>
                  <TableCell className="font-mono text-xs">{trip.booking_code as string}</TableCell>
                  <TableCell className="text-sm">{(trip.guests as Record<string, string>)?.full_name || "-"}</TableCell>
                  <TableCell className="text-sm max-w-[160px] truncate">{(trip.routes as Record<string, string>)?.name || "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatTanggalWaktu(trip.pickup_datetime as string)}</TableCell>
                  <TableCell><StatusBadge status={trip.status as StatusType} /></TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(trip.gross_price as number)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
