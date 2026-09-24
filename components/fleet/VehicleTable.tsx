"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Vehicle, useDeleteVehicle } from "@/hooks/useVehicles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VehicleStatusBadge } from "./VehicleCard";
import { AlertTriangle, Car, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onRefetch?: () => void;
}

export default function VehicleTable({ vehicles, onRefetch }: VehicleTableProps) {
  const { deleteVehicle } = useDeleteVehicle();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus kendaraan ${name}?`)) return;
    setDeletingId(id);
    try {
      await deleteVehicle(id);
      if (onRefetch) onRefetch();
    } catch (e) {
      alert("Gagal menghapus kendaraan");
    } finally {
      setDeletingId(null);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg bg-card">
        <p className="text-muted-foreground">Tidak ada kendaraan ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kendaraan</TableHead>
            <TableHead>Plat Nomor</TableHead>
            <TableHead>Spesifikasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Odometer</TableHead>
            <TableHead className="text-center">Alerts</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => {
            const serviceProgress = vehicle.next_service_km && vehicle.last_service_km
              ? ((vehicle.current_km - vehicle.last_service_km) / (vehicle.next_service_km - vehicle.last_service_km)) * 100
              : 0;
            const isServiceDueSoon = serviceProgress > 90;

            return (
              <TableRow key={vehicle.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link href={`/admin/fleet/${vehicle.id}`} className="flex items-center gap-3 hover:text-primary group">
                    <div className="w-12 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden border group-hover:border-primary/50 transition-colors">
                      {vehicle.photo_url ? (
                        <Image src={vehicle.photo_url} alt={vehicle.brand} width={48} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold">{vehicle.unit_code}</div>
                      <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-mono font-medium">{vehicle.plate_number}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{vehicle.year} • {vehicle.color || "Warna -"}</div>
                  <div className="text-xs text-muted-foreground">{vehicle.capacity} Penumpang</div>
                </TableCell>
                <TableCell>
                  <VehicleStatusBadge status={vehicle.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">{vehicle.current_km.toLocaleString()} km</div>
                  <div className="text-xs text-muted-foreground">Next: {vehicle.next_service_km ? vehicle.next_service_km.toLocaleString() : "-"}</div>
                </TableCell>
                <TableCell className="text-center">
                  {isServiceDueSoon ? (
                    <div title="Service hampir tiba" className="flex justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                  ) : (
                    <span className="text-xs text-green-500 font-medium">✓ OK</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/fleet/${vehicle.id}/edit`} className="text-primary hover:underline text-sm font-medium">
                      Edit
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(vehicle.id, vehicle.plate_number)}
                      disabled={deletingId === vehicle.id}
                    >
                      {deletingId === vehicle.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
