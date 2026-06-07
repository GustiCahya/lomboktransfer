"use client";

import React from "react";
import Link from "next/link";
import { useDashboardStats } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Car, Users, TrendingUp, AlertTriangle, Play, MapPin, CheckCircle } from "lucide-react";
import TodayBookings from "@/components/dashboard/TodayBookings";
import AlertList from "@/components/dashboard/AlertList";
import { formatRupiah } from "@/lib/utils/format";

export default function DashboardPage() {
  const { stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Ringkasan operasional Lombok Transfer hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/bookings/new">
            <Button>Buat Booking Baru</Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Total Booking Hari Ini</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold">
              {isLoading ? "-" : stats.todayBookingsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Semua status jadwal keberangkatan
            </p>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-primary">Trip Sedang Berjalan</CardTitle>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary animate-pulse">
              <Play className="h-3 w-3 fill-current" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold text-primary">
              {isLoading ? "-" : stats.activeTripsCount}
            </div>
            <p className="text-xs text-primary/70 mt-1">
              Status In-Progress
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Kesiapan Operasional</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-xl font-bold">
              {isLoading ? "-" : `${stats.availableDriversCount} Supir / ${stats.standbyVehiclesCount} Unit`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Status standby / aktif
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
            <CardTitle className="text-sm font-medium">Estimasi Pendapatan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? "-" : formatRupiah(stats.estimatedRevenueToday)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gross booking hari ini
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Kolom Kiri Utama (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col">
            <CardHeader className="pt-6 px-6 pb-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Jadwal Keberangkatan Hari Ini</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Urutan berdasarkan waktu penjemputan</p>
              </div>
              <Link href="/bookings">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <TodayBookings />
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="pt-6 px-6 pb-4 border-b">
              <CardTitle className="text-lg">Keuangan Bulan Ini (Placeholder)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Akan diintegrasikan penuh pada Modul 4 (Accounting)</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/30 border border-dashed text-center">
                  <p className="text-sm text-muted-foreground mb-1">Gross Revenue</p>
                  <p className="text-xl font-bold text-green-600">{formatRupiah(145000000)}</p>
                </div>
                <div className="p-4 rounded-md bg-muted/30 border border-dashed text-center">
                  <p className="text-sm text-muted-foreground mb-1">Net Profit Est.</p>
                  <p className="text-xl font-bold text-primary">{formatRupiah(65000000)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan Samping (1 Kolom) */}
        <div className="space-y-6">
          {/* Action Center */}
          <Card className="flex flex-col">
            <CardHeader className="pt-6 px-6 pb-4 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" /> Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-2 gap-3">
              <Link href="/bookings/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 text-left">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">Booking<br/>Baru</span>
                </Button>
              </Link>
              <Link href="/dispatch">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 text-left">
                  <CalendarCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">Kalender<br/>Dispatch</span>
                </Button>
              </Link>
              <Link href="/drivers/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 text-left">
                  <Users className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="truncate">Tambah<br/>Supir</span>
                </Button>
              </Link>
              <Link href="/fleet/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3 text-left">
                  <Car className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="truncate">Tambah<br/>Armada</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="flex flex-col border-amber-200 bg-amber-50/10 dark:border-amber-900/30 dark:bg-amber-900/5">
            <CardHeader className="pt-6 px-6 pb-4 border-b border-amber-100 dark:border-amber-900/30">
              <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-500">
                <AlertTriangle className="w-4 h-4" /> Perlu Perhatian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <AlertList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
