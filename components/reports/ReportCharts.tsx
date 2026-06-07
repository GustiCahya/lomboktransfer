/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

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

export function RevenueTrendChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pendapatan vs Pengeluaran (12 Bulan Terakhir)</CardTitle>
        <p className="text-xs text-muted-foreground">Dalam Juta Rupiah (Rp)</p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Belum ada data</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
  );
}

export function BreakdownPieCharts({ sourcesData, demographicsData }: { sourcesData: any[]; demographicsData: any[] }) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribusi Sumber Booking</CardTitle>
        </CardHeader>
        <CardContent>
          {sourcesData.length === 0 ? (
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
                <Tooltip formatter={(v: any) => [v, "Bookings"]} />
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
          {demographicsData.length === 0 ? (
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
                <Tooltip formatter={(v: any) => [v, "Tamu"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export function OperationalBarCharts({ routesData, driverData }: { routesData: any[]; driverData: any[] }) {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Rute Populer</CardTitle>
          <p className="text-xs text-muted-foreground">Berdasarkan jumlah booking yang selesai</p>
        </CardHeader>
        <CardContent>
          {routesData.length === 0 ? (
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
          {driverData.length === 0 ? (
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
  );
}
