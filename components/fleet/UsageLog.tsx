"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Navigation } from "lucide-react";

interface UsageLogProps {
  vehicleId: string;
}

// Dummy data for usage logs
const DUMMY_LOGS = [
  { id: "1", date: "2026-06-05", driver: "Ahmad Rizki", start_km: 45010, end_km: 45150, route: "Bandara - Senggigi - Kuta" },
  { id: "2", date: "2026-06-06", driver: "Budi Santoso", start_km: 45150, end_km: 45220, route: "Mataram City Tour" },
  { id: "3", date: "2026-06-07", driver: "Ahmad Rizki", start_km: 45220, end_km: 45400, route: "Sembalun Tour" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UsageLog({ vehicleId }: UsageLogProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Jarak Tempuh (Bulan Ini)</p>
            <h3 className="text-2xl font-bold">1,245 <span className="text-sm font-normal text-muted-foreground">km</span></h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Rata-rata Harian</p>
            <h3 className="text-2xl font-bold">85 <span className="text-sm font-normal text-muted-foreground">km/hari</span></h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Estimasi BBM</p>
            <h3 className="text-2xl font-bold">124 <span className="text-sm font-normal text-muted-foreground">Liter</span></h3>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" /> Log Perjalanan Terakhir
        </h3>
        <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Input Manual Odometer</Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Supir</TableHead>
              <TableHead>Rute / Keterangan</TableHead>
              <TableHead className="text-right">KM Awal</TableHead>
              <TableHead className="text-right">KM Akhir</TableHead>
              <TableHead className="text-right">Jarak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_LOGS.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{new Date(log.date).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>{log.driver}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{log.route}</TableCell>
                <TableCell className="text-right font-mono text-sm">{log.start_km.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-sm">{log.end_km.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium text-primary">{(log.end_km - log.start_km).toLocaleString()} km</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
