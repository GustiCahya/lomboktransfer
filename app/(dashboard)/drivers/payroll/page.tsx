import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils/format";
import { DollarSign, Users, TrendingUp } from "lucide-react";

const PLACEHOLDER = [
  { name: "Ahmad Supardi", trips: 22, gross: 15_400_000, commission: 3_080_000, status: "Draft" },
  { name: "Budi Santoso", trips: 18, gross: 12_600_000, commission: 2_520_000, status: "Draft" },
  { name: "Cahyo Pratama", trips: 31, gross: 21_700_000, commission: 4_340_000, status: "Approved" },
];

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Supir"
        subtitle="Ringkasan komisi dan pembayaran bulan berjalan. Detail proses payroll tersedia di modul Akuntansi."
        actions={<Button>Proses Payroll Bulan Ini</Button>}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{PLACEHOLDER.length}</p>
              <p className="text-xs text-muted-foreground">Supir Aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{PLACEHOLDER.reduce((a, b) => a + b.trips, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Trip Bulan Ini</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatRupiah(PLACEHOLDER.reduce((a, b) => a + b.commission, 0), true)}</p>
              <p className="text-xs text-muted-foreground">Total Komisi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supir</TableHead>
              <TableHead className="text-center">Total Trip</TableHead>
              <TableHead className="text-right">Pendapatan Kotor</TableHead>
              <TableHead className="text-right">Estimasi Komisi</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PLACEHOLDER.map(row => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-center">{row.trips}</TableCell>
                <TableCell className="text-right">{formatRupiah(row.gross)}</TableCell>
                <TableCell className="text-right font-semibold text-primary">{formatRupiah(row.commission)}</TableCell>
                <TableCell className="text-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${row.status === "Approved" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
