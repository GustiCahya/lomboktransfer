/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import ExpenseTable from "@/components/accounting/ExpenseTable";
import ExpenseForm from "@/components/accounting/ExpenseForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Download, Receipt, TrendingDown } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  fuel: "BBM", maintenance: "Servis", insurance: "Asuransi",
  commission: "Komisi", platform_fee: "Platform Fee",
  marketing: "Marketing", office: "Kantor", legal: "Legal", other: "Lainnya",
};

export default function ExpensesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const [startDate, setStartDate] = useState(`${currentYear}-${String(currentMonth).padStart(2, "0")}-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-${String(currentMonth).padStart(2, "0")}-${lastDay}`);
  const [category, setCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { expenses, isLoading, mutate } = useExpenses({ startDate, endDate, category: category || undefined });

  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

  // Breakdown per category
  const categoryBreakdown = expenses.reduce((acc: Record<string, number>, e: any) => {
    acc[e.category] = (acc[e.category] || 0) + (e.amount || 0);
    return acc;
  }, {});

  const top3Categories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const handleExport = () => {
    const headers = ["Tanggal", "Kategori", "Deskripsi", "Vendor", "Metode", "Jumlah"];
    const rows = expenses.map((e: any) => [
      e.expense_date,
      CATEGORY_LABELS[e.category] || e.category,
      e.description,
      e.vendors?.name || "",
      e.payment_method,
      e.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pengeluaran-${startDate}-${endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Actions & Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label>Dari Tanggal</Label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-44" />
        </div>
        <div className="space-y-2">
          <Label>Hingga Tanggal</Label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-44" />
        </div>
        <div className="space-y-2">
          <Label>Kategori</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-9 w-44 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">Semua</option>
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Tambah Pengeluaran
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Pengeluaran</DialogTitle>
              </DialogHeader>
              <ExpenseForm
                onSuccess={() => { setDialogOpen(false); mutate(); }}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
                <p className="text-xl font-bold text-destructive">Rp {totalExpenses.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Jumlah Transaksi</p>
                <p className="text-xl font-bold">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {top3Categories.map(([cat, amt]) => (
          <Card key={cat}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat] || cat}</p>
              <p className="text-xl font-bold">Rp {amt.toLocaleString("id-ID")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalExpenses > 0 ? `${((amt / totalExpenses) * 100).toFixed(1)}% dari total` : "-"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          Memuat data pengeluaran...
        </div>
      ) : (
        <ExpenseTable expenses={expenses} />
      )}
    </div>
  );
}
