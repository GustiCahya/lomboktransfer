/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRevenue } from "@/hooks/useRevenue";
import { useExpenses } from "@/hooks/useExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicPnLBarChart = dynamic(
  () => import("@/components/accounting/PnLCharts").then((mod) => mod.PnLBarChart),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> }
);

const DynamicPnLPieCharts = dynamic(
  () => import("@/components/accounting/PnLCharts").then((mod) => mod.PnLPieCharts),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> }
);
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const EXPENSE_LABELS: Record<string, string> = {
  fuel: "BBM", maintenance: "Servis", insurance: "Asuransi",
  commission: "Komisi", platform_fee: "Platform Fee",
  marketing: "Marketing", office: "Kantor", legal: "Legal", other: "Lainnya",
};

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct", whatsapp: "WhatsApp", klook: "Klook",
  viator: "Viator", traveloka: "Traveloka", manual: "Manual",
};

export default function PnLPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  // Full year data
  const { revenueList } = useRevenue({
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  });
  const { expenses } = useExpenses({
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  });

  // Monthly aggregation
  const monthlyData = MONTHS_SHORT.map((monthLabel, i) => {
    const monthRevenue = revenueList
      .filter((r: any) => new Date(r.pickup_datetime).getMonth() === i)
      .reduce((s: number, r: any) => s + (r.gross_price || 0), 0);

    const monthExpenses = expenses
      .filter((e: any) => new Date(e.expense_date).getMonth() === i)
      .reduce((s: number, e: any) => s + (e.amount || 0), 0);

    return {
      name: monthLabel,
      Pendapatan: monthRevenue,
      Pengeluaran: monthExpenses,
      EBITDA: monthRevenue - monthExpenses,
    };
  });

  // Totals
  const totalGross = revenueList.reduce((s: number, r: any) => s + (r.gross_price || 0), 0);
  const totalExpenses = expenses.reduce((s: number, e: any) => s + (e.amount || 0), 0);
  const ebitda = totalGross - totalExpenses;
  const margin = totalGross > 0 ? (ebitda / totalGross) * 100 : 0;

  // Source breakdown for pie
  const sourceBreakdown = revenueList.reduce((acc: Record<string, number>, r: any) => {
    const src = r.source || "manual";
    acc[src] = (acc[src] || 0) + (r.gross_price || 0);
    return acc;
  }, {});
  const sourcePieData = Object.entries(sourceBreakdown).map(([name, value]) => ({
    name: SOURCE_LABELS[name] || name,
    value,
  }));

  // Expense category breakdown for pie
  const expenseCatBreakdown = expenses.reduce((acc: Record<string, number>, e: any) => {
    acc[e.category] = (acc[e.category] || 0) + (e.amount || 0);
    return acc;
  }, {});
  const expensePieData = Object.entries(expenseCatBreakdown).map(([name, value]) => ({
    name: EXPENSE_LABELS[name] || name,
    value,
  }));


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

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendapatan Gross</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalGross.toLocaleString("id-ID")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">Rp {totalExpenses.toLocaleString("id-ID")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">EBITDA</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${ebitda >= 0 ? "text-success" : "text-destructive"}`}>
              Rp {ebitda.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${margin >= 20 ? "text-success" : "text-warning"}`}>
              {margin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart: Monthly Revenue vs Expenses */}
      <DynamicPnLBarChart data={monthlyData} year={year} />

      {/* Pie Charts */}
      <DynamicPnLPieCharts sourcePieData={sourcePieData} expensePieData={expensePieData} />
    </div>
  );
}
