"use client";

import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { useVehicles } from "@/hooks/useVehicles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Plus } from "lucide-react";
import Link from "next/link";

export default function FleetServicesPage() {
  const [search, setSearch] = useState("");
  const { vehicles, isLoading } = useVehicles({ search: search || undefined });

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const progressA = a.next_service_km && a.last_service_km ? ((a.current_km - a.last_service_km) / (a.next_service_km - a.last_service_km)) * 100 : 0;
    const progressB = b.next_service_km && b.last_service_km ? ((b.current_km - b.last_service_km) / (b.next_service_km - b.last_service_km)) * 100 : 0;
    return progressB - progressA;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Servis Kendaraan"
        subtitle="Pantau status odometer dan jadwalkan servis rutin untuk seluruh armada."
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 bg-card p-4 rounded-md border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kendaraan..."
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">Memuat data servis...</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kendaraan</TableHead>
                <TableHead className="text-right">KM Saat Ini</TableHead>
                <TableHead className="text-right">Servis Terakhir</TableHead>
                <TableHead className="text-right">Target Servis</TableHead>
                <TableHead className="text-center w-48">Progress</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVehicles.map(vehicle => {
                const progress = vehicle.next_service_km && vehicle.last_service_km
                  ? Math.min(100, Math.max(0, ((vehicle.current_km - vehicle.last_service_km) / (vehicle.next_service_km - vehicle.last_service_km)) * 100))
                  : 0;
                
                const sisa = vehicle.next_service_km ? vehicle.next_service_km - vehicle.current_km : null;
                const isUrgent = progress > 90;

                return (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="font-bold">{vehicle.unit_code}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.model}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">{vehicle.current_km.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{vehicle.last_service_km?.toLocaleString() || "-"}</TableCell>
                    <TableCell className="text-right font-mono">{vehicle.next_service_km?.toLocaleString() || "-"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{Math.round(progress)}%</span>
                          <span>{sisa !== null ? `${sisa.toLocaleString()} km lagi` : "-"}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${isUrgent ? 'bg-destructive' : 'bg-primary'}`} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isUrgent ? (
                        <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" /> Segera</Badge>
                      ) : progress > 70 ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-600">Mendekati</Badge>
                      ) : (
                        <Badge variant="secondary">Aman</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/fleet/${vehicle.id}`}>
                        <Button size="sm" variant={isUrgent ? "default" : "outline"} className="gap-2">
                          <Plus className="w-3 h-3" /> Servis
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
