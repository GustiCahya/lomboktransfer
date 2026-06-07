/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRevenue } from "@/hooks/useRevenue";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicCashflowAreaChart = dynamic(
  () => import("@/components/accounting/CashflowCharts").then((mod) => mod.CashflowAreaChart),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> }
);
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function CashflowPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { revenueList } = useRevenue({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });
  const { expenses } = useExpenses({ startDate: `${year}-01-01`, endDate: `${year}-12-31` });

  let runningBalance = 0;

  const monthlyData = MONTHS_SHORT.map((monthLabel, i) => {
    const kasmasuk = revenueList
      .filter((r: any) => {
        const d = new Date(r.pickup_datetime);
        return d.getFullYear() === year && d.getMonth() === i;
      })
      .reduce((s: number, r: any) => s + (r.gross_price || 0), 0);

    const kaskeluar = expenses
      .filter((e: any) => {
        const d = new Date(e.expense_date);
        return d.getFullYear() === year && d.getMonth() === i;
      })
      .reduce((s: number, e: any) => s + (e.amount || 0), 0);

    runningBalance += kasmasuk - kaskeluar;

    return {
      name: monthLabel,
      "Kas Masuk": kasmasuk,
      "Kas Keluar": kaskeluar,
      "Saldo Kumulatif": runningBalance,
    };
  });

  const totalIn = revenueList.reduce((s: number, r: any) => s + (r.gross_price || 0), 0);
  const totalOut = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
  const netCash = totalIn - totalOut;

  // Proyeksi: apakah saldo akhir bulan ini cukup untuk komisi bulan depan?
  const currentMonthIdx = new Date().getMonth();
  const projectedPayroll = monthlyData[currentMonthIdx]?.["Kas Masuk"] * 0.3; // Rough estimate ~30%
  const currentBalance = monthlyData[currentMonthIdx]?.["Saldo Kumulatif"] || 0;
  const isAtRisk = currentBalance < projectedPayroll;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Tahun:</label>
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

      {/* Alert jika saldo berisiko */}
      {isAtRisk && (
        <div className="flex items-center gap-3 rounded-lg border border-warning bg-warning/10 p-4 text-sm text-warning">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            Proyeksi saldo akhir bulan ini mungkin <strong>tidak cukup</strong> untuk membiayai komisi supir bulan depan. 
            Segera tinjau pengeluaran atau tambahkan kas masuk.
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Kas Masuk ({year})</p>
                <p className="text-xl font-bold text-success">Rp {totalIn.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Kas Keluar ({year})</p>
                <p className="text-xl font-bold text-destructive">Rp {totalOut.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${netCash >= 0 ? "bg-primary/10" : "bg-destructive/10"}`}>
                <TrendingUp className={`h-5 w-5 ${netCash >= 0 ? "text-primary" : "text-destructive"}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Net Cash Flow</p>
                <p className={`text-xl font-bold ${netCash >= 0 ? "text-primary" : "text-destructive"}`}>
                  Rp {netCash.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Chart */}
      <DynamicCashflowAreaChart data={monthlyData} year={year} />
    </div>
  );
}
