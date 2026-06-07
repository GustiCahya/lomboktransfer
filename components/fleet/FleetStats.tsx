"use client";

import React from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench, AlertTriangle, TrendingUp } from "lucide-react";

export default function FleetStats() {
  const { vehicles } = useVehicles();

  const total = vehicles.length;
  const active = vehicles.filter(v => v.status === "active").length;
  const maintenance = vehicles.filter(v => v.status === "maintenance").length;
  
  const needsService = vehicles.filter(v => {
    if (!v.next_service_km) return false;
    const progress = v.last_service_km 
      ? ((v.current_km - v.last_service_km) / (v.next_service_km - v.last_service_km)) * 100 
      : 0;
    return progress > 90;
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
          <CardTitle className="text-sm font-medium">Total Armada</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {active} aktif beroperasi
          </p>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
          <CardTitle className="text-sm font-medium">Dalam Perawatan</CardTitle>
          <Wrench className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-2xl font-bold text-amber-600">{maintenance}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Kendaraan masuk bengkel
          </p>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
          <CardTitle className="text-sm font-medium">Perlu Servis Segera</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-2xl font-bold text-destructive">{needsService}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Odometer mendekati batas
          </p>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6">
          <CardTitle className="text-sm font-medium">Utilisasi Hari Ini</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-2xl font-bold text-primary">{total > 0 ? Math.round((active/total)*100) : 0}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Persentase unit standby
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
