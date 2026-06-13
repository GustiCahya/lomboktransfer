/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  useKeyMetrics,
  useRevenueTrend,
  useBookingSources,
  useRoutePopularity,
  useDriverPerformance,
  useGuestDemographics,
} from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, BookOpen, Banknote, Target, Star } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicRevenueTrendChart = dynamic(
  () => import("@/components/reports/ReportCharts").then((mod) => mod.RevenueTrendChart),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> }
);

const DynamicBreakdownPieCharts = dynamic(
  () => import("@/components/reports/ReportCharts").then((mod) => mod.BreakdownPieCharts),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> }
);

const DynamicOperationalBarCharts = dynamic(
  () => import("@/components/reports/ReportCharts").then((mod) => mod.OperationalBarCharts),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div> }
);

// COLORS removed
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { metrics, isLoading: loadingMetrics } = useKeyMetrics();
  const { trend } = useRevenueTrend();
  const { sources } = useBookingSources();
  const { routes } = useRoutePopularity();
  const { drivers } = useDriverPerformance();
  const { demographics } = useGuestDemographics();

  const trendData = trend.map((t: any) => ({
    month: format(new Date(t.month), "MMM yy", { locale: id }),
    Pendapatan: Math.round(Number(t.total_revenue) / 1000000),
    Pengeluaran: Math.round(Number(t.total_expenses) / 1000000),
    Profit: Math.round(Number(t.net_profit) / 1000000),
  }));

  const sourcesData = sources.map((s: any) => ({
    name: s.source || "Unknown",
    value: Number(s.total_bookings),
    percentage: Number(s.percentage),
  }));

  const routesData = routes.map((r: any) => ({
    name: r.route_name || "Rute Custom",
    Bookings: Number(r.total_bookings),
    Revenue: Math.round(Number(r.total_revenue) / 1000000),
  }));

  const driverData = drivers.map((d: any) => ({
    name: (d.driver_name || "Driver").split(" ")[0],
    Trips: Number(d.total_trips),
    Rating: Number(Number(d.avg_rating).toFixed(1)),
    Revenue: Math.round(Number(d.total_revenue) / 1000000),
  }));

  const demographicsData = demographics.map((d: any) => ({
    name: d.nationality || "Unknown",
    value: Number(d.total_guests),
  }));

  // CustomTooltip removed

  return (
    <div className="space-y-8">
      {/* Row 1: Key Metrics */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Ringkasan Utama</h3>
        {loadingMetrics ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}><CardContent className="pt-6 h-24 animate-pulse bg-muted/40 rounded-lg" /></Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Booking Selesai"
              value={metrics.totalBookings.toLocaleString("id-ID")}
              icon={BookOpen}
              color="bg-indigo-500/10 text-indigo-500"
            />
            <MetricCard
              title="Gross Revenue"
              value={formatCurrency(metrics.grossRevenue)}
              icon={Banknote}
              color="bg-emerald-500/10 text-emerald-500"
            />
            <MetricCard
              title="Net Profit"
              value={formatCurrency(metrics.netProfit)}
              icon={TrendingUp}
              color={metrics.netProfit >= 0 ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"}
            />
            <MetricCard
              title="Avg. Order Value"
              value={formatCurrency(metrics.aov)}
              icon={Target}
              color="bg-violet-500/10 text-violet-500"
            />
          </div>
        )}
      </section>

      {/* Row 2: Revenue Trend */}
      <section>
        <DynamicRevenueTrendChart data={trendData} />
      </section>

      {/* Row 3: Breakdown Charts */}
      <DynamicBreakdownPieCharts sourcesData={sourcesData} demographicsData={demographicsData} />

      {/* Row 4: Operasional Charts */}
      <DynamicOperationalBarCharts routesData={routesData} driverData={driverData} />

      {/* Driver Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-warning fill-warning" />
            Ranking Performa Supir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {driverData.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{d.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Trips</p>
                  <p className="font-bold">{d.Trips}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-bold text-warning">{d.Rating > 0 ? `${d.Rating} ★` : "-"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-bold text-primary">Rp {d.Revenue}jt</p>
                </div>
              </div>
            ))}
            {driverData.length === 0 && (
              <p className="text-center text-muted-foreground py-6 text-sm">Belum ada data performa supir</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
