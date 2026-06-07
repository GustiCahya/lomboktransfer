"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface PayrollTabProps {
  driverId: string;
}

// Placeholder payroll data - will be computed from real data in Step 11
const PLACEHOLDER_PAYROLL = [
  { period: "Mei 2026", total_trips: 22, gross: 15_400_000, commission_pct: 20, commission: 3_080_000, bonus: 250_000, deduction: 0, paid: 3_330_000, status: "Dibayar" },
  { period: "Apr 2026", total_trips: 18, gross: 12_600_000, commission_pct: 20, commission: 2_520_000, bonus: 0, deduction: 0, paid: 2_520_000, status: "Dibayar" },
  { period: "Mar 2026", total_trips: 24, gross: 16_800_000, commission_pct: 20, commission: 3_360_000, bonus: 300_000, deduction: 0, paid: 3_660_000, status: "Dibayar" },
];

function PayrollStatus({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Dibayar": "bg-green-500/10 text-green-600 border-green-200",
    "Approved": "bg-blue-500/10 text-blue-600 border-blue-200",
    "Draft": "bg-muted text-muted-foreground",
  };
  return <Badge variant="outline" className={`text-xs font-medium ${colors[status] || ""}`}>{status}</Badge>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PayrollTab({ driverId }: PayrollTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Riwayat payroll berdasarkan trip yang telah selesai. Proses payroll lengkap tersedia di modul Akuntansi.</p>
      </div>

      {/* Summary for current month */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold">22</p>
          <p className="text-xs text-muted-foreground mt-1">Trip Bulan Ini</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold text-primary">{formatRupiah(3_080_000, true)}</p>
          <p className="text-xs text-muted-foreground mt-1">Komisi Bulan Ini</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4 text-center">
          <p className="text-2xl font-bold text-green-500">{formatRupiah(3_330_000, true)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total + Bonus</p>
        </CardContent></Card>
      </div>

      {/* Payroll table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periode</TableHead>
              <TableHead className="text-center">Total Trip</TableHead>
              <TableHead className="text-right">Pendapatan Kotor</TableHead>
              <TableHead className="text-center">Komisi (%)</TableHead>
              <TableHead className="text-right">Total Komisi</TableHead>
              <TableHead className="text-right">Bonus</TableHead>
              <TableHead className="text-right">Dibayarkan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PLACEHOLDER_PAYROLL.map(row => (
              <TableRow key={row.period}>
                <TableCell className="font-medium">{row.period}</TableCell>
                <TableCell className="text-center">{row.total_trips}</TableCell>
                <TableCell className="text-right text-sm">{formatRupiah(row.gross)}</TableCell>
                <TableCell className="text-center">{row.commission_pct}%</TableCell>
                <TableCell className="text-right font-medium text-primary">{formatRupiah(row.commission)}</TableCell>
                <TableCell className="text-right">{row.bonus > 0 ? formatRupiah(row.bonus) : "-"}</TableCell>
                <TableCell className="text-right font-bold">{formatRupiah(row.paid)}</TableCell>
                <TableCell className="text-center"><PayrollStatus status={row.status} /></TableCell>
                <TableCell>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
