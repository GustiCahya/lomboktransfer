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
import { TrendingUp, BookOpen, DollarSign, Target, Star } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

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
  const { trend, isLoading: loadingTrend } = useRevenueTrend();
  const { sources, isLoading: loadingSources } = useBookingSources();
  const { routes, isLoading: loadingRoutes } = useRoutePopularity();
  const { drivers, isLoading: loadingDrivers } = useDriverPerformance();
  const { demographics, isLoading: loadingDemographics } = useGuestDemographics();

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-sm">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name}: {entry.unit === "juta" ? `Rp ${entry.value}jt` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
              icon={DollarSign}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pendapatan vs Pengeluaran (12 Bulan Terakhir)</CardTitle>
            <p className="text-xs text-muted-foreground">Dalam Juta Rupiah (Rp)</p>
          </CardHeader>
          <CardContent>
            {loadingTrend ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Memuat grafik...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="Pendapatan" stroke="#6366f1" fill="url(#gradRevenue)" strokeWidth={2} unit="juta" />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="5 5" unit="juta" />
                  <Area type="monotone" dataKey="Profit" stroke="#10b981" fill="url(#gradProfit)" strokeWidth={2} unit="juta" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Row 3: Breakdown Charts */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Sumber Booking</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSources ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Memuat data...</div>
            ) : sourcesData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {sourcesData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Bookings"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demografi Kebangsaan Tamu</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDemographics ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Memuat data...</div>
            ) : demographicsData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={demographicsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {demographicsData.map((_: any, index: number) => (
                      <Cell key={`cell-demo-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, "Tamu"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Row 4: Operasional Charts */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Rute Populer</CardTitle>
            <p className="text-xs text-muted-foreground">Berdasarkan jumlah booking yang selesai</p>
          </CardHeader>
          <CardContent>
            {loadingRoutes ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Memuat data...</div>
            ) : routesData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Belum ada data rute</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={routesData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip />
                  <Bar dataKey="Bookings" fill="#6366f1" radius={[0, 4, 4, 0]}>
                    {routesData.map((_: any, index: number) => (
                      <Cell key={`cell-route-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performa Top 5 Supir</CardTitle>
            <p className="text-xs text-muted-foreground">Berdasarkan jumlah trip & pendapatan dihasilkan</p>
          </CardHeader>
          <CardContent>
            {loadingDrivers ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Memuat data...</div>
            ) : driverData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Belum ada data supir</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={driverData} margin={{ top: 5, right: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="trips" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="rating" orientation="right" domain={[0, 5]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-sm">
                            <p className="font-medium mb-1">{label}</p>
                            {payload.map((entry: any, i: number) => (
                              <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="trips" dataKey="Trips" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="rating" dataKey="Rating" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                    {driverData.map((_: any, index: number) => (
                      <Cell key={`driver-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

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
