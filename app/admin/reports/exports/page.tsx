/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateCSV } from "@/lib/exports/csv-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const REPORT_CONFIGS = [
  {
    id: "bookings_weekly",
    title: "Rekap Booking Mingguan",
    description: "Semua booking dalam 7 hari terakhir dengan detail tamu, rute, dan status.",
    type: "CSV",
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    id: "revenue_monthly",
    title: "Laporan Pendapatan Bulanan",
    description: "Total pendapatan bulan ini, dikelompokkan per sumber booking.",
    type: "CSV",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "expenses_monthly",
    title: "Rekap Pengeluaran Bulanan",
    description: "Semua pencatatan pengeluaran bulan ini dengan rincian kategori.",
    type: "CSV",
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    id: "driver_payroll",
    title: "Rekap Komisi Supir Bulanan",
    description: "Rincian komisi dan trip per supir untuk periode bulan ini.",
    type: "CSV",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "driver_performance",
    title: "Laporan Performa Supir",
    description: "Total trips, rating rata-rata, dan pendapatan semua supir.",
    type: "CSV",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "fleet_services",
    title: "Laporan Biaya Armada per Unit",
    description: "Rincian servis dan biaya per kendaraan sepanjang waktu.",
    type: "CSV",
    color: "bg-violet-500/10 text-violet-500",
  },
];

type ReportId = typeof REPORT_CONFIGS[number]["id"];

async function fetchReportData(reportId: ReportId): Promise<Record<string, unknown>[]> {
  const supabase = createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  switch (reportId) {
    case "bookings_weekly": {
      const { data } = await supabase
        .from("bookings")
        .select("id, pickup_datetime, status, net_price, source, guests(full_name, phone), routes(name), drivers(full_name)")
        .gte("pickup_datetime", weekAgo)
        .order("pickup_datetime", { ascending: false });
      return (data || []).map((b: any) => ({
        "No. Booking": b.id.substring(0, 8).toUpperCase(),
        Tanggal: format(new Date(b.pickup_datetime), "dd/MM/yyyy HH:mm", { locale: id }),
        Tamu: (b.guests as any)?.full_name || "-",
        HP: (b.guests as any)?.phone || "-",
        Rute: (b.routes as any)?.name || "-",
        Supir: (b.drivers as any)?.full_name || "-",
        "Harga (IDR)": b.net_price,
        Sumber: b.source,
        Status: b.status,
      }));
    }

    case "revenue_monthly": {
      const { data } = await supabase
        .from("bookings")
        .select("net_price, source, pickup_datetime")
        .eq("status", "completed")
        .gte("pickup_datetime", startOfMonth);
      return (data || []).map((b: any) => ({
        Tanggal: format(new Date(b.pickup_datetime), "dd/MM/yyyy", { locale: id }),
        Sumber: b.source,
        "Pendapatan (IDR)": b.net_price,
      }));
    }

    case "expenses_monthly": {
      const { data } = await supabase
        .from("expenses")
        .select("expense_date, category, description, amount, reference_number")
        .gte("expense_date", startOfMonth)
        .order("expense_date", { ascending: true });
      return (data || []).map((e: any) => ({
        Tanggal: e.expense_date,
        Kategori: e.category,
        Deskripsi: e.description,
        "Jumlah (IDR)": e.amount,
        Referensi: e.reference_number || "-",
      }));
    }

    case "driver_payroll": {
      const { data } = await supabase
        .from("bookings")
        .select("pickup_datetime, net_price, drivers(full_name), routes(name)")
        .eq("status", "completed")
        .gte("pickup_datetime", startOfMonth);
      return (data || []).map((b: any) => ({
        Supir: (b.drivers as any)?.full_name || "-",
        Rute: (b.routes as any)?.name || "-",
        Tanggal: format(new Date(b.pickup_datetime), "dd/MM/yyyy", { locale: id }),
        "Pendapatan Trip (IDR)": b.net_price,
      }));
    }

    case "driver_performance": {
      const { data } = await supabase.from("v_driver_performance").select("*");
      return (data || []).map((d: any) => ({
        Supir: d.driver_name,
        "Total Trips": d.total_trips,
        "Rating Rata-rata": Number(d.avg_rating || 0).toFixed(1),
        "Total Revenue (IDR)": d.total_revenue,
      }));
    }

    case "fleet_services": {
      const { data } = await supabase
        .from("vehicle_services")
        .select("service_date, service_type, description, cost, vehicles(plate_number, model)")
        .order("service_date", { ascending: false });
      return (data || []).map((s: any) => ({
        Kendaraan: (s.vehicles as any)?.plate_number || "-",
        Model: (s.vehicles as any)?.model || "-",
        Tanggal: s.service_date,
        "Jenis Servis": s.service_type,
        Deskripsi: s.description,
        "Biaya (IDR)": s.cost,
      }));
    }

    default:
      return [];
  }
}

export default function ExportCenterPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleExport = async (reportId: ReportId, title: string) => {
    setLoadingId(reportId);
    setSuccessId(null);
    try {
      const data = await fetchReportData(reportId);
      const filename = `${title.toLowerCase().replace(/ /g, "_")}_${format(new Date(), "yyyyMMdd")}`;
      generateCSV(data, filename);
      setSuccessId(reportId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      console.error("Export error:", err);
      alert("Gagal mengexport data. Silakan coba lagi.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export Center
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate dan unduh laporan dalam format CSV secara langsung dari data real-time di database.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REPORT_CONFIGS.map((report) => (
          <Card key={report.id} className="group hover:border-primary/40 transition-colors">
            <CardContent className="pt-6 flex flex-col h-full gap-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${report.color}`}>
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{report.title}</p>
                    <Badge variant="outline" className="text-xs font-mono">{report.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{report.description}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 mt-auto"
                disabled={loadingId === report.id}
                onClick={() => handleExport(report.id as ReportId, report.title)}
              >
                {loadingId === report.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengambil data...
                  </>
                ) : successId === report.id ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    Berhasil diunduh!
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download CSV
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
