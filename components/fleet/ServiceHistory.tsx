"use client";

import React from "react";
import { useServiceRecords } from "@/hooks/useServiceRecords";
import { Vehicle } from "@/hooks/useVehicles";
import { formatRupiah } from "@/lib/utils/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wrench, AlertTriangle } from "lucide-react";

interface ServiceHistoryProps {
  vehicle: Vehicle;
}

export default function ServiceHistory({ vehicle }: ServiceHistoryProps) {
  const { records, isLoading } = useServiceRecords(vehicle.id);

  const serviceProgress = vehicle.next_service_km && vehicle.last_service_km
    ? Math.min(100, Math.max(0, ((vehicle.current_km - vehicle.last_service_km) / (vehicle.next_service_km - vehicle.last_service_km)) * 100))
    : 0;

  const isServiceDueSoon = serviceProgress > 90;

  return (
    <div className="space-y-6">
      {/* Service Progress Card */}
      <Card className={isServiceDueSoon ? "border-amber-500/50" : ""}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isServiceDueSoon ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary"}`}>
                {isServiceDueSoon ? <AlertTriangle className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold">Status Servis Rutin</h3>
                <p className="text-sm text-muted-foreground">Berdasarkan odometer kendaraan</p>
              </div>
            </div>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Catat Servis</Button>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 border">
            <div className="flex justify-between text-sm mb-2">
              <div>
                <span className="text-muted-foreground block text-xs">Servis Terakhir</span>
                <span className="font-medium">{vehicle.last_service_km?.toLocaleString() || 0} km</span>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground block text-xs">KM Saat Ini</span>
                <span className="font-bold text-lg">{vehicle.current_km.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground block text-xs">Target Servis</span>
                <span className="font-medium">{vehicle.next_service_km?.toLocaleString() || "-"} km</span>
              </div>
            </div>
            
            <div className="relative pt-2 pb-1">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${isServiceDueSoon ? 'bg-amber-500' : 'bg-primary'}`} 
                  style={{ width: `${serviceProgress}%` }}
                />
              </div>
              {/* Marker for current position if we want a fancy dot */}
            </div>
            {isServiceDueSoon && (
              <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Kendaraan ini sudah mendekati atau melewati jadwal servis!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <h3 className="font-semibold text-lg mt-8 mb-4">Riwayat Servis & Perbaikan</h3>
      
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Memuat riwayat servis...</p>
      ) : records.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground border rounded-md border-dashed">Belum ada riwayat servis tercatat.</p>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis Servis</TableHead>
                <TableHead>Bengkel</TableHead>
                <TableHead className="text-right">KM Servis</TableHead>
                <TableHead className="text-right">Biaya</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {new Date(record.service_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                      {record.service_type.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{record.workshop_name || "-"}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{record.km_at_service.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(record.cost)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={record.notes || ""}>
                    {record.notes || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
