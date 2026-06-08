/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useState } from "react";
import { usePayrollList, useGeneratePayroll } from "@/hooks/usePayroll";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  approved: { label: "Disetujui", className: "bg-blue-500/10 text-blue-500" },
  paid: { label: "Dibayar", className: "bg-green-500/10 text-green-600" },
};

export default function PayrollPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);

  const { payrollList, isLoading, mutate } = usePayrollList(month, year);
  const { generate } = useGeneratePayroll();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generate(month, year);
      mutate();
      toast.success("Payroll berhasil di-generate");
    } catch (error) {
      toast.error("Gagal generate payroll");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const updateData: any = { status: newStatus };
      if (newStatus === "paid") {
        updateData.payment_date = new Date().toISOString().split("T")[0];
      }
      await supabase.from("payroll").update(updateData).eq("id", id);
      mutate();
      toast.success(`Status diperbarui ke ${newStatus}`);
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  const totalNett = payrollList.reduce((s: number, p: any) => s + (p.net_payable || 0), 0);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="flex h-9 w-36 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="flex h-9 w-24 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Generate Payroll
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Supir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trip Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollList.reduce((s: number, p: any) => s + (p.total_trips || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Dibayarkan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalNett.toLocaleString("id-ID")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Memuat data payroll...
        </div>
      ) : payrollList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 rounded-lg border border-dashed text-muted-foreground">
          <Banknote className="h-10 w-10 opacity-40" />
          <p>Belum ada data payroll untuk periode ini.</p>
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Generate Sekarang
          </Button>
        </div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supir</TableHead>
                <TableHead className="text-center">Total Trip</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
                <TableHead className="text-center">Komisi (%)</TableHead>
                <TableHead className="text-right">Komisi (Rp)</TableHead>
                <TableHead className="text-right">Bonus</TableHead>
                <TableHead className="text-right">Potongan</TableHead>
                <TableHead className="text-right font-semibold">Nett Dibayar</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollList.map((p: any) => {
                const statusCfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.drivers?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{p.drivers?.bank_name} · {p.drivers?.bank_account_number}</div>
                    </TableCell>
                    <TableCell className="text-center">{p.total_trips}</TableCell>
                    <TableCell className="text-right">Rp {p.gross_revenue?.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-center">{p.commission_pct}%</TableCell>
                    <TableCell className="text-right">Rp {p.commission_amt?.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {p.bonus > 0 ? `+Rp ${p.bonus?.toLocaleString("id-ID")}` : "-"}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {p.deduction > 0 ? `-Rp ${p.deduction?.toLocaleString("id-ID")}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      Rp {p.net_payable?.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        {p.status === "draft" && (
                          <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(p.id, "approved")} className="h-7 px-2 text-xs gap-1">
                            <CheckCircle className="h-3 w-3" /> Setujui
                          </Button>
                        )}
                        {p.status === "approved" && (
                          <Button size="sm" variant="ghost" onClick={() => handleUpdateStatus(p.id, "paid")} className="h-7 px-2 text-xs gap-1 text-green-600">
                            <Banknote className="h-3 w-3" /> Bayar
                          </Button>
                        )}
                        {p.status === "paid" && (
                          <Badge variant="outline" className="text-xs text-green-600">✓ Lunas</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
